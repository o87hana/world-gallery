import { describe, expect, it } from "vitest";
import { createPageMetadata, DEFAULT_OG_IMAGE, SITE_URL } from "./seo";

describe("SEO metadata", () => {
  it("creates canonical and hreflang URLs for a Japanese page", () => {
    const metadata = createPageMetadata({ lang: "ja", path: "/gallery", title: "Gallery" });

    expect(SITE_URL.href).toBe("https://world-gallery-studio.vercel.app/");
    expect(metadata.alternates).toEqual({
      canonical: "/ja/gallery",
      languages: {
        ja: "/ja/gallery",
        en: "/en/gallery",
        "x-default": "/ja/gallery",
      },
    });
    expect(metadata.openGraph?.locale).toBe("ja_JP");
  });

  it("keeps English fallback pages canonical and uses the profile image by default", () => {
    const metadata = createPageMetadata({ lang: "en", path: "/work/example", title: "日本語作品名" });

    expect(metadata.robots).toBeUndefined();
    expect(metadata.openGraph?.images).toEqual([{ url: DEFAULT_OG_IMAGE, alt: "日本語作品名" }]);
    expect(metadata.alternates?.canonical).toBe("/en/work/example");
  });
});
