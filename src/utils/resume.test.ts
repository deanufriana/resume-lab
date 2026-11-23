import { describe, expect, it, beforeEach } from "vite-plus/test";
import { ref } from "vue";
import { formatDate, toMonthInput } from "./date";
import { stripContactInfo } from "./privacy";
import { sanitizeUrl } from "./url";
import { saveResumeToStorage, loadResumeFromStorage, clearResumeFromStorage } from "./storage";
import { useStableList } from "../composables/useStableList";

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
