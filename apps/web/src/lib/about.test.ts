import { describe, expect, it } from "vitest";
import { getAboutContent } from "./about";

describe("About content", () => {
  it.each([
    ["ja", "デザイナー", "日本生まれ。"],
    ["en", "Designer", "Born in Japan."],
  ] as const)("provides the requested %s profile content", (lang, role, firstEntry) => {
    const content = getAboutContent(lang);

    expect(content.role).toBe(role);
    expect(content.timeline).toHaveLength(4);
    expect(content.timeline[0].text).toBe(firstEntry);
    expect(content.timeline[2].year).toBe("2019–2023");
    expect(content.timeline[3].year).toBe("2024–");
    expect(content.featured.flatMap((entry) => entry.items)).toHaveLength(6);
    expect(content.featured.at(-1)?.items[0].url).toBe("https://www.architectsjournal.co.uk/news/sketchbook-hana-murakami");
    expect(content.skills).toEqual([]);
    expect(content.philosophy).toEqual([]);
    expect(content.portraitAlt).not.toBe("");
  });

  it("keeps featured years and article links aligned across languages", () => {
    const ja = getAboutContent("ja");
    const en = getAboutContent("en");

    expect(ja.featured.map((entry) => entry.year)).toEqual(en.featured.map((entry) => entry.year));
    expect(ja.featured.at(-1)?.items[0].url).toBe(en.featured.at(-1)?.items[0].url);
  });
});
