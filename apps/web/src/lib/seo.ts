import type { Metadata } from "next";
import type { Lang } from "@/lib/i18n";

export const SITE_URL = new URL("https://world-gallery-studio.vercel.app/");
export const SITE_NAME = "World Gallery — Hana Murakami";
export const DEFAULT_OG_IMAGE = "/designerphoto.avif";

const SITE_DESCRIPTIONS: Record<Lang, string> = {
  ja: "村上花の建築、スケッチ、旅、リサーチ作品を、世界の場所とともに紹介するポートフォリオです。",
  en: "Hana Murakami's portfolio of architecture, sketches, travel, and research connected to places around the world.",
};

function localizedPath(lang: Lang, path = "") {
  return `/${lang}${path}`;
}

export function createPageMetadata({
  lang,
  path = "",
  title,
  description = SITE_DESCRIPTIONS[lang],
  image = DEFAULT_OG_IMAGE,
}: {
  lang: Lang;
  path?: string;
  title?: string;
  description?: string;
  image?: string;
}): Metadata {
  const pageTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const canonical = localizedPath(lang, path);

  return {
    metadataBase: SITE_URL,
    title: pageTitle,
    description,
    alternates: {
      canonical,
      languages: {
        ja: localizedPath("ja", path),
        en: localizedPath("en", path),
        "x-default": localizedPath("ja", path),
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: pageTitle,
      description,
      url: canonical,
      locale: lang === "ja" ? "ja_JP" : "en_US",
      alternateLocale: lang === "ja" ? ["en_US"] : ["ja_JP"],
      images: [{ url: image, alt: title ?? "Hana Murakami" }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description,
      images: [image],
    },
  };
}

export function getSiteDescription(lang: Lang) {
  return SITE_DESCRIPTIONS[lang];
}
