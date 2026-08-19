import { WORK_CATEGORIES, localizedValue, type WorkCard, type WorkCategory } from "@/lib/work";
import type { Lang } from "@/lib/i18n";

export function parseGalleryCategories(values: readonly string[]): WorkCategory[] {
  return WORK_CATEGORIES.filter((category) => values.includes(category));
}

export function filterGalleryWorks<T extends WorkCard>(
  works: T[],
  lang: Lang,
  query: string,
  categories: readonly WorkCategory[],
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase(lang === "ja" ? "ja-JP" : "en-US");
  const selectedCategories = new Set(categories);

  return works.filter((work) => {
    const matchesCategory = selectedCategories.size === 0 || selectedCategories.has(work.category);
    const title = localizedValue(lang, work.title_ja, work.title_en).toLocaleLowerCase(
      lang === "ja" ? "ja-JP" : "en-US",
    );
    return matchesCategory && (!normalizedQuery || title.includes(normalizedQuery));
  });
}

export function createGalleryQueryString(
  current: string,
  query: string,
  categories: readonly WorkCategory[],
): string {
  const params = new URLSearchParams(current);
  params.delete("q");
  params.delete("category");

  const normalizedQuery = query.trim();
  if (normalizedQuery) params.set("q", normalizedQuery);
  for (const category of WORK_CATEGORIES) {
    if (categories.includes(category)) params.append("category", category);
  }

  return params.toString();
}
