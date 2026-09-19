import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { WorkContent } from "@/components/WorkContent";
import { SanityImage } from "@/components/SanityImage";
import { getSanityWork } from "@/lib/sanity.data";
import { urlFor } from "@/lib/sanity.client";
import { isLang } from "@/lib/i18n";
import { localizedOptionalValue, localizedValue } from "@/lib/work";
import { createPageMetadata } from "@/lib/seo";

const getWork = cache(async (slug: string) => {
  return getSanityWork(slug);
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLang(lang)) return {};
  const work = await getWork(slug);
  if (!work) return {};

  const title = localizedValue(lang, work.title_ja, work.title_en);
  const subtitle = localizedOptionalValue(lang, work.subtitle_ja, work.subtitle_en);
  const image = work.coverImage
    ? urlFor(work.coverImage).width(1200).height(630).fit("crop").auto("format").url()
    : undefined;

  return createPageMetadata({
    lang,
    path: `/work/${slug}`,
    title,
    description: subtitle ?? (lang === "ja" ? `${title} — 村上花の作品` : `${title} — A work by Hana Murakami`),
    image,
  });
}

function formatWorkDate(date: string | undefined, lang: "ja" | "en") {
  if (!date) return undefined;
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return undefined;

  return new Intl.DateTimeFormat(lang === "ja" ? "ja-JP" : "en-US", {
    year: "numeric",
    month: lang === "ja" ? "numeric" : "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(parsed);
}

export default async function WorkPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (!isLang(lang)) notFound();

  const work = await getWork(slug);

  if (!work) notFound();

  const title = localizedValue(lang, work.title_ja, work.title_en);
  const subtitle = localizedOptionalValue(lang, work.subtitle_ja, work.subtitle_en);
  const formattedDate = formatWorkDate(work.date, lang);
  const coverUrl = work.coverImage ? urlFor(work.coverImage).width(1800).auto("format").url() : "";
  const usesJapaneseFallback = lang === "en" && !work.title_en?.trim();

  return (
    <article className="rounded-2xl bg-[#f6f2ea] p-6 text-[#0f1230] shadow-lg sm:p-10">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/60">
        <span>{work.category}</span>
        {formattedDate ? <time dateTime={work.date}>{formattedDate}</time> : null}
      </div>
      <h1 className="mt-2 break-words text-3xl font-semibold sm:text-4xl">{title}</h1>
      {subtitle ? <p className="mt-3 text-lg text-black/65">{subtitle}</p> : null}
      {usesJapaneseFallback ? <p className="mt-3 text-sm text-black/50">This work is currently shown in Japanese.</p> : null}

      {coverUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl">
          <SanityImage
            src={coverUrl}
            alt={title}
            sizes="(max-width: 767px) calc(100vw - 3rem), (max-width: 1279px) calc(100vw - 5rem), 1088px"
            loading="eager"
            className="h-auto w-full"
          />
        </div>
      ) : null}

      {work.blocks?.length ? <WorkContent blocks={work.blocks} lang={lang} /> : null}
    </article>
  );
}
