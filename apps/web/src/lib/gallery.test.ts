import { describe, expect, it } from "vitest";
import type { WorkCard } from "@/lib/work";
import { createGalleryQueryString, filterGalleryWorks, parseGalleryCategories } from "./gallery";

const works: WorkCard[] = [
  { id: "1", slug: "tokyo", category: "Sketch", title_ja: "東京の線", title_en: "Tokyo Lines" },
  { id: "2", slug: "london", category: "Architecture", title_ja: "ロンドン建築", title_en: "London Form" },
  { id: "3", slug: "research", category: "Research", title_ja: "素材研究" },
];

describe("Gallery filtering", () => {
  it("combines a localized title search with multiple categories", () => {
    expect(filterGalleryWorks(works, "en", "o", ["Sketch", "Architecture"]).map((work) => work.id)).toEqual([
      "1",
      "2",
    ]);
    expect(filterGalleryWorks(works, "ja", "素材", ["Research"]).map((work) => work.id)).toEqual(["3"]);
  });

  it("searches the Japanese title when it is the English fallback", () => {
    expect(filterGalleryWorks(works, "en", "素材", [])).toEqual([works[2]]);
    expect(filterGalleryWorks(works, "en", "coming", [])).toEqual([]);
  });

  it("ignores unknown categories and keeps the canonical order", () => {
    expect(parseGalleryCategories(["Travel", "invalid", "Sketch", "Travel"])).toEqual(["Sketch", "Travel"]);
  });

  it("serializes search and repeated category parameters without dropping unrelated parameters", () => {
    expect(createGalleryQueryString("preview=1&q=old&category=Other", " tokyo ", ["Travel", "Sketch"])).toBe(
      "preview=1&q=tokyo&category=Sketch&category=Travel",
    );
  });
});
