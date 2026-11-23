import { describe, expect, it, beforeEach } from "vite-plus/test";
import { ref } from "vue";
import { formatDate } from "./date";
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
