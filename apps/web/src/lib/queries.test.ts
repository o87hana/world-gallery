import { describe, expect, it } from "vitest";

import {
  GALLERY_QUERY,
  PINS_QUERY,
  PREVIEW_WORK_BY_SLUG_QUERY,
  PUBLIC_WORK_BY_SLUG_QUERY,
  SITEMAP_WORKS_QUERY,
} from "./queries";
import { localizedValue, WORK_CATEGORIES } from "./work";

const publishedFilter = /_type\s*==\s*"work"\s*&&\s*published\s*==\s*true/;

describe("public work queries", () => {
  it.each([
    ["pins", PINS_QUERY],
    ["gallery", GALLERY_QUERY],
    ["sitemap", SITEMAP_WORKS_QUERY],
    ["work detail", PUBLIC_WORK_BY_SLUG_QUERY],
  ])("requires published works for %s", (_name, query) => {
    expect(query).toMatch(publishedFilter);
  });

  it("keeps the preview detail query separate from the public filter", () => {
    expect(PREVIEW_WORK_BY_SLUG_QUERY).not.toMatch(publishedFilter);
  });

  it.each([
    ["pins", PINS_QUERY],
    ["gallery", GALLERY_QUERY],
    ["work detail", PUBLIC_WORK_BY_SLUG_QUERY],
  ])("uses the bilingual work contract for %s", (_name, query) => {
    expect(query).toContain("title_ja");
    expect(query).toContain("title_en");
    expect(query).toContain("coverImage");
    expect(query).toMatch(/order\(date desc\)|\bdate\b/);
    expect(query).not.toContain("heroImage");
    expect(query).not.toContain("createdAt");
  });

  it("projects localized content fields for work details", () => {
    expect(PUBLIC_WORK_BY_SLUG_QUERY).toContain("subtitle_ja");
    expect(PUBLIC_WORK_BY_SLUG_QUERY).toContain("subtitle_en");
    expect(PUBLIC_WORK_BY_SLUG_QUERY).toContain("placeName_ja");
    expect(PUBLIC_WORK_BY_SLUG_QUERY).toContain("placeName_en");
    expect(PUBLIC_WORK_BY_SLUG_QUERY).toContain("blocks[]");
  });

  it("keeps the sitemap projection limited to routing metadata", () => {
    expect(SITEMAP_WORKS_QUERY).toContain('"slug": slug.current');
    expect(SITEMAP_WORKS_QUERY).toContain('"coverUrl": coverImage.asset->url');
    expect(SITEMAP_WORKS_QUERY).not.toContain("blocks[]");
  });
});

describe("work data contract", () => {
  it("keeps the canonical category values in specification order", () => {
    expect(WORK_CATEGORIES).toEqual(["Sketch", "Architecture", "Travel", "Research", "Other"]);
  });

  it("uses Japanese content when an English title has not been authored", () => {
    expect(localizedValue("ja", "日本語タイトル")).toBe("日本語タイトル");
    expect(localizedValue("en", "日本語タイトル")).toBe("日本語タイトル");
    expect(localizedValue("en", "日本語タイトル", "English title")).toBe("English title");
  });
});
