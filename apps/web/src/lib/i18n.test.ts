import { describe, expect, it } from "vitest";
import { getDictionary, isLang, switchPathLanguage } from "./i18n";

describe("locale routing", () => {
  it("accepts only the supported languages", () => {
    expect(isLang("ja")).toBe(true);
    expect(isLang("en")).toBe(true);
    expect(isLang("fr")).toBe(false);
    expect(isLang("")).toBe(false);
  });

  it("keeps the current route and work slug while changing language", () => {
    expect(switchPathLanguage("/ja", "en")).toBe("/en");
    expect(switchPathLanguage("/ja/gallery", "en")).toBe("/en/gallery");
    expect(switchPathLanguage("/en/work/tokyo-observation-sketch", "ja")).toBe(
      "/ja/work/tokyo-observation-sketch",
    );
  });

  it("falls back to the target language home for non-localized paths", () => {
    expect(switchPathLanguage("/gallery", "en")).toBe("/en");
  });

  it("provides shared navigation copy for both languages", () => {
    expect(getDictionary("ja").navigation.contact).toBe("お問い合わせ");
    expect(getDictionary("en").navigation.contact).toBe("Contact");
  });
});
