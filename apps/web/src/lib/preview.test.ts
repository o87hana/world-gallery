import { describe, expect, it } from "vitest";
import { parsePreviewLanguage, parsePreviewSlug, previewPath } from "./preview";

describe("preview parameters", () => {
  it("accepts only supported languages", () => {
    expect(parsePreviewLanguage("ja")).toBe("ja");
    expect(parsePreviewLanguage("en")).toBe("en");
    expect(parsePreviewLanguage("fr")).toBeNull();
    expect(parsePreviewLanguage(null)).toBeNull();
  });

  it("rejects missing, oversized, and path-like slugs", () => {
    expect(parsePreviewSlug("work-1")).toBe("work-1");
    expect(parsePreviewSlug("作品-1")).toBe("作品-1");
    expect(parsePreviewSlug("/work-1")).toBeNull();
    expect(parsePreviewSlug("https://evil.example")).toBeNull();
    expect(parsePreviewSlug("a".repeat(97))).toBeNull();
  });

  it("encodes the slug as one internal path segment", () => {
    expect(previewPath("ja", "作品-1")).toBe("/ja/work/%E4%BD%9C%E5%93%81-1");
  });
});
