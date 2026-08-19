"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useOptimistic, useTransition } from "react";
import { createGalleryQueryString, filterGalleryWorks, parseGalleryCategories } from "@/lib/gallery";
import { getDictionary, type Lang } from "@/lib/i18n";
import { WORK_CATEGORIES, localizedOptionalValue, localizedValue, type WorkCard, type WorkCategory } from "@/lib/work";

export type GalleryCard = WorkCard & { coverUrl?: string };

export function GalleryExplorer({ lang, works }: { lang: Lang; works: GalleryCard[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlQuery = searchParams.get("q") ?? "";
  const urlCategories = parseGalleryCategories(searchParams.getAll("category"));
  const [query, setOptimisticQuery] = useOptimistic(urlQuery);
  const [categories, setOptimisticCategories] = useOptimistic<WorkCategory[]>(urlCategories);
  const [, startTransition] = useTransition();
  const dictionary = getDictionary(lang).gallery;

  const updateUrl = (nextQuery: string, nextCategories: WorkCategory[]) => {
    const next = createGalleryQueryString(searchParams.toString(), nextQuery, nextCategories);
    router.replace(next ? `${pathname}?${next}` : pathname, { scroll: false });
  };

  const changeQuery = (nextQuery: string) => {
    startTransition(() => {
      setOptimisticQuery(nextQuery);
      updateUrl(nextQuery, categories);
    });
  };

  const toggleCategory = (category: WorkCategory) => {
    const nextCategories = categories.includes(category)
      ? categories.filter((value) => value !== category)
      : [...categories, category];
    startTransition(() => {
      setOptimisticCategories(nextCategories);
      updateUrl(query, nextCategories);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      setOptimisticQuery("");
      setOptimisticCategories([]);
      updateUrl("", []);
    });
  };

  const filteredWorks = filterGalleryWorks(works, lang, query, categories);
  const hasFilters = Boolean(query.trim() || categories.length);

  return (
    <>
      <div className="grid gap-6 border-y border-black/10 py-6 md:grid-cols-[minmax(0,1fr)_2fr]">
        <label className="block text-sm font-semibold" htmlFor="gallery-search">
          {dictionary.searchLabel}
          <input
            id="gallery-search"
            type="search"
            value={query}
            onChange={(event) => changeQuery(event.target.value)}
            placeholder={dictionary.searchPlaceholder}
            className="mt-2 w-full rounded-lg border border-black/20 bg-white px-4 py-3 font-normal outline-none transition focus-visible:border-[#1e4e9e] focus-visible:ring-2 focus-visible:ring-[#1e4e9e]/30"
          />
        </label>

        <fieldset>
          <legend className="text-sm font-semibold">{dictionary.categoriesLabel}</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {WORK_CATEGORIES.map((category) => (
              <label
                key={category}
                className={`cursor-pointer rounded-full border px-4 py-2 text-sm transition focus-within:ring-2 focus-within:ring-[#1e4e9e] focus-within:ring-offset-2 ${
                  categories.includes(category)
                    ? "border-[#0f1230] bg-[#0f1230] text-white"
                    : "border-black/20 bg-white hover:border-black/50"
                }`}
              >
                <input
                  className="sr-only"
                  type="checkbox"
                  checked={categories.includes(category)}
                  onChange={() => toggleCategory(category)}
                />
                {category}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="my-6 flex min-h-8 items-center justify-between gap-4 text-sm text-black/60" aria-live="polite">
        <span>{dictionary.resultCount(filteredWorks.length)}</span>
        {hasFilters ? (
          <button type="button" onClick={clearFilters} className="rounded-sm underline decoration-black/30 underline-offset-4 hover:text-black">
            {dictionary.clearFilters}
          </button>
        ) : null}
      </div>

      {filteredWorks.length ? (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {filteredWorks.map((work, index) => {
            const title = localizedValue(lang, work.title_ja, work.title_en);
            const subtitle = localizedOptionalValue(lang, work.subtitle_ja, work.subtitle_en);
            return (
              <Link key={work.id} href={`/${lang}/work/${work.slug}`} className="group rounded-2xl">
                <article className="h-full overflow-hidden rounded-2xl bg-white shadow-md">
                  {work.coverUrl ? (
                    <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={work.coverUrl}
                      alt={title}
                      fill
                  loading={index === 0 ? "eager" : "lazy"}
                      sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) 33vw, 352px"
                      className="object-cover transition group-hover:scale-[1.02]"
                    />
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full bg-[#e6e0d6]" aria-hidden="true" />
                  )}
                  <div className="p-4">
                    <div className="text-xs text-black/60">{work.category}</div>
                    <h2 className="mt-1 text-lg font-semibold">{title}</h2>
                    {subtitle ? <p className="mt-3 line-clamp-3 text-sm leading-6 text-black/70">{subtitle}</p> : null}
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-black/20 px-6 py-12 text-center text-black/60">
          {dictionary.empty}
        </p>
      )}
    </>
  );
}
