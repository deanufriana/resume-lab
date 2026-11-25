import { describe, expect, it, beforeEach } from "vite-plus/test";
import { ref } from "vue";
import { formatDate, toMonthInput } from "./date";
import { stripContactInfo } from "./privacy";
import { sanitizeUrl } from "./url";
import { saveResumeToStorage, loadResumeFromStorage, clearResumeFromStorage } from "./storage";
import { useStableList } from "../composables/useStableList";
import { parseGistId, getGistParamFromLocation, fetchResumeFromGist } from "./gist";

describe("formatDate", () => {
  it("formats ISO dates in UTC without timezone shift", () => {
    expect(formatDate("2020-01-01")).toBe("Jan 2020");
    expect(formatDate("2024-12-31")).toBe("Dec 2024");
  });

  it("returns empty string for missing input and original string for invalid dates", () => {
    expect(formatDate()).toBe("");
    expect(formatDate("")).toBe("");
    expect(formatDate("not-a-date")).toBe("not-a-date");
  });
});

describe("toMonthInput", () => {
  it("extracts YYYY-MM from ISO dates and returns empty string for invalid or missing input", () => {
    expect(toMonthInput("2020-01-15")).toBe("2020-01");
    expect(toMonthInput("2024-12")).toBe("2024-12");
    expect(toMonthInput("")).toBe("");
    expect(toMonthInput(undefined)).toBe("");
    expect(toMonthInput("invalid")).toBe("");
  });
});

describe("sanitizeUrl", () => {
  it("allows safe protocols", () => {
    expect(sanitizeUrl("https://example.com")).toBe("https://example.com");
    expect(sanitizeUrl("http://example.com/path")).toBe("http://example.com/path");
    expect(sanitizeUrl("mailto:test@example.com")).toBe("mailto:test@example.com");
    expect(sanitizeUrl("tel:+1234567890")).toBe("tel:+1234567890");
  });

  it("blocks dangerous or invalid URLs", () => {
    expect(sanitizeUrl("javascript:alert(1)")).toBe("#");
    expect(sanitizeUrl("  JAVASCRIPT:alert(1)")).toBe("#");
    expect(sanitizeUrl("data:text/html,<script>alert(1)</script>")).toBe("#");
    expect(sanitizeUrl("")).toBe("#");
    expect(sanitizeUrl(undefined)).toBe("#");
  });
});

describe("storage", () => {
  const store = new Map<string, string>();

  beforeEach(() => {
    store.clear();
    Object.defineProperty(globalThis, "localStorage", {
      value: {
        getItem: (k: string) => store.get(k) ?? null,
        setItem: (k: string, v: string) => {
          store.set(k, v);
        },
        removeItem: (k: string) => {
          store.delete(k);
        },
      },
      configurable: true,
    });
  });

  it("saves, loads, and clears resume data", () => {
    const resume = { basics: { name: "Jane Doe" }, work: [] };
    saveResumeToStorage(resume);
    expect(loadResumeFromStorage()).toEqual(resume);

    clearResumeFromStorage();
    expect(loadResumeFromStorage()).toBeNull();
  });
});

describe("useStableList", () => {
  it("assigns unique keys to duplicate items and preserves collapse state on reorder", () => {
    const source = ref([{ name: "" }, { name: "" }]);
    const { localItems, getItemKey, isCollapsed, toggleCollapse } = useStableList(
      () => source.value,
      (val) => {
        source.value = val;
      },
    );

    const first = localItems.value[0];
    const second = localItems.value[1];
    expect(getItemKey(first)).not.toBe(getItemKey(second));

    toggleCollapse(first);
    expect(isCollapsed(first)).toBe(true);
    expect(isCollapsed(second)).toBe(false);

    localItems.value = [second, first];
    expect(isCollapsed(first)).toBe(true);
    expect(isCollapsed(second)).toBe(false);
  });
});

describe("stripContactInfo", () => {
  it("strips email, phone, url, profiles, and street address when hideContact is true", () => {
    const resume = {
      basics: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+123456",
        url: "https://jane.dev",
        profiles: [{ network: "GitHub", username: "jane", url: "https://github.com/jane" }],
        location: { city: "Jakarta", address: "123 Main St" },
      },
      meta: { hideContact: true },
    };

    const result = stripContactInfo(resume);
    expect(result.basics?.name).toBe("Jane Doe");
    expect(result.basics?.email).toBe("");
    expect(result.basics?.phone).toBe("");
    expect(result.basics?.url).toBe("");
    expect(result.basics?.profiles).toEqual([]);
    expect(result.basics?.location?.city).toBe("Jakarta");
    expect(result.basics?.location?.address).toBe("");
    // Original object remains untouched
    expect(resume.basics.email).toBe("jane@example.com");
  });

  it("returns the resume unchanged when hideContact is false", () => {
    const resume = { basics: { name: "Jane Doe", email: "jane@example.com" }, meta: {} };
    expect(stripContactInfo(resume)).toBe(resume);
  });
});

describe("parseGistId", () => {
  const sampleId = "0123456789abcdef0123456789abcdef";

  it("extracts IDs from bare IDs and GitHub Gist URLs", () => {
    expect(parseGistId(sampleId)).toBe(sampleId);
    expect(parseGistId(`  ${sampleId}  `)).toBe(sampleId);
    expect(parseGistId(`https://gist.github.com/deanufriana/${sampleId}`)).toBe(sampleId);
    expect(parseGistId(`https://gist.github.com/${sampleId}/revisions`)).toBe(sampleId);
    expect(parseGistId(`gist.github.com/deanufriana/${sampleId}`)).toBe(sampleId);
    expect(
      parseGistId(`https://gist.githubusercontent.com/deanufriana/${sampleId}/raw/resume.json`),
    ).toBe(sampleId);
    expect(parseGistId(`https://api.github.com/gists/${sampleId}`)).toBe(sampleId);
  });

  it("returns null for invalid or non-gist inputs", () => {
    expect(parseGistId("")).toBeNull();
    expect(parseGistId("not-a-gist")).toBeNull();
    expect(parseGistId("https://example.com/0123456789abcdef0123456789abcdef")).toBeNull();
  });
});

describe("getGistParamFromLocation", () => {
  it("reads gist param from search or hash query string", () => {
    expect(getGistParamFromLocation("?gist=abc123", "")).toBe("abc123");
    expect(getGistParamFromLocation("", "#/?gist=def456")).toBe("def456");
    expect(getGistParamFromLocation("?gist=first", "#/?gist=second")).toBe("first");
    expect(getGistParamFromLocation("", "#/")).toBeNull();
  });
});

describe("fetchResumeFromGist", () => {
  const sampleId = "0123456789abcdef0123456789abcdef";

  it("prefers resume.json and falls back to other .json files", async () => {
    const mockFetch = (async () =>
      new Response(
        JSON.stringify({
          files: {
            "notes.txt": { filename: "notes.txt", content: "hello" },
            "other.json": { filename: "other.json", content: '{"basics":{"name":"Other"}}' },
            "resume.json": { filename: "resume.json", content: '{"basics":{"name":"Jane"}}' },
          },
        }),
        { status: 200 },
      )) as typeof fetch;

    const result = await fetchResumeFromGist(sampleId, mockFetch);
    expect(result.gistId).toBe(sampleId);
    expect(result.filename).toBe("resume.json");
    expect(result.resume.basics?.name).toBe("Jane");
  });

  it("falls back to first .json file when resume.json is absent", async () => {
    const mockFetch = (async () =>
      new Response(
        JSON.stringify({
          files: {
            "profile.json": { filename: "profile.json", content: '{"basics":{"name":"Alex"}}' },
          },
        }),
        { status: 200 },
      )) as typeof fetch;

    const result = await fetchResumeFromGist(sampleId, mockFetch);
    expect(result.filename).toBe("profile.json");
    expect(result.resume.basics?.name).toBe("Alex");
  });

  it("fetches raw_url when the gist file is truncated", async () => {
    const mockFetch = (async (url: string | URL | Request) => {
      const target = typeof url === "string" ? url : url instanceof URL ? url.href : url.url;
      if (target.includes("api.github.com")) {
        return new Response(
          JSON.stringify({
            files: {
              "resume.json": {
                filename: "resume.json",
                truncated: true,
                raw_url: "https://gist.githubusercontent.com/raw/resume.json",
                content: "{",
              },
            },
          }),
          { status: 200 },
        );
      }
      return new Response('{"basics":{"name":"Full"}}', { status: 200 });
    }) as typeof fetch;

    const result = await fetchResumeFromGist(sampleId, mockFetch);
    expect(result.resume.basics?.name).toBe("Full");
  });

  it("throws clear errors on invalid input, HTTP errors, missing JSON, and invalid JSON", async () => {
    await expect(fetchResumeFromGist("bad-id")).rejects.toThrow("Invalid GitHub Gist URL or ID.");

    const notFoundFetch = (async () => new Response("", { status: 404 })) as typeof fetch;
    await expect(fetchResumeFromGist(sampleId, notFoundFetch)).rejects.toThrow("Gist not found");

    const rateLimitFetch = (async () => new Response("", { status: 403 })) as typeof fetch;
    await expect(fetchResumeFromGist(sampleId, rateLimitFetch)).rejects.toThrow("rate limit");

    const noJsonFetch = (async () =>
      new Response(JSON.stringify({ files: { "readme.md": { content: "hi" } } }), {
        status: 200,
      })) as typeof fetch;
    await expect(fetchResumeFromGist(sampleId, noJsonFetch)).rejects.toThrow("No JSON file found");

    const badJsonFetch = (async () =>
      new Response(JSON.stringify({ files: { "resume.json": { content: "{bad" } } }), {
        status: 200,
      })) as typeof fetch;
    await expect(fetchResumeFromGist(sampleId, badJsonFetch)).rejects.toThrow(
      "does not contain valid JSON",
    );
  });
});
