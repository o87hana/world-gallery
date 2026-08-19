import { describe, expect, it } from "vitest";
import { getAboutContent } from "./about";

describe("About content", () => {
  it.each([
    ["ja", "デザイナー", "詩を書くように、建築をデザインしたい。"],
    ["en", "Designer", "I want to design architecture as if I were writing a poem."],
  ] as const)("provides complete %s profile content", (lang, role, opening) => {
    const content = getAboutContent(lang);

    expect(content.role).toBe(role);
    expect(content.timeline).toHaveLength(4);
    expect(content.featured.flatMap((entry) => entry.items)).toHaveLength(5);
    expect(content.skills.flatMap((group) => group.items)).toHaveLength(12);
    expect(content.philosophy).toHaveLength(10);
    expect(content.philosophy[0]).toBe(opening);
    expect(content.portraitAlt).not.toBe("");
  });

  it("keeps language-independent achievements and skills aligned", () => {
    const ja = getAboutContent("ja");
    const en = getAboutContent("en");

    expect(ja.featured).toEqual(en.featured);
    expect(ja.skills.map((group) => group.items)).toEqual(en.skills.map((group) => group.items));
  });
});
