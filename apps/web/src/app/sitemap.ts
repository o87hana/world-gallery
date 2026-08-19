import type { MetadataRoute } from "next";
import { getPublicSanityClient } from "@/lib/sanity.server";
import { PINS_QUERY } from "@/lib/queries";
import { LANGUAGES } from "@/lib/i18n";
import { SITE_URL } from "@/lib/seo";
import type { WorkPin } from "@/lib/work";

const STATIC_PATHS = ["", "/gallery", "/about", "/contact"] as const;

function absolute(path: string) {
  return new URL(path, SITE_URL).href;
}

function languages(path: string) {
  return {
    ja: absolute(`/ja${path}`),
    en: absolute(`/en${path}`),
    "x-default": absolute(`/ja${path}`),
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const client = getPublicSanityClient();
  const works: WorkPin[] = await client.fetch(PINS_QUERY);

  const staticEntries: MetadataRoute.Sitemap = LANGUAGES.flatMap((lang) =>
    STATIC_PATHS.map((path) => ({
      url: absolute(`/${lang}${path}`),
      changeFrequency: path === "" ? "weekly" as const : "monthly" as const,
      priority: path === "" ? 1 : path === "/gallery" ? 0.9 : 0.6,
      alternates: { languages: languages(path) },
    })),
  );

  const workEntries: MetadataRoute.Sitemap = LANGUAGES.flatMap((lang) =>
    works.map((work) => {
      const path = `/work/${work.slug}`;
      return {
        url: absolute(`/${lang}${path}`),
        lastModified: work.date,
        changeFrequency: "monthly" as const,
        priority: 0.8,
        alternates: { languages: languages(path) },
        images: work.coverUrl ? [work.coverUrl] : undefined,
      };
    }),
  );

  return [...staticEntries, ...workEntries];
}
