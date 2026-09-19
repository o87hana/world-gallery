import { Suspense } from "react";
import { notFound } from "next/navigation";
import { GalleryExplorer, type GalleryCard } from "@/components/GalleryExplorer";
import { getSanityGalleryWorks } from "@/lib/sanity.data";
import { urlFor } from "@/lib/sanity.client";
import { getDictionary, isLang } from "@/lib/i18n";
import type { WorkCard } from "@/lib/work";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  return createPageMetadata({
    lang,
    path: "/gallery",
    title: "Gallery",
    description: lang === "ja" ? "村上花の作品をカテゴリやタイトルから探せるギャラリーです。" : "Browse Hana Murakami's works by category or title.",
  });
}

function GalleryFallback() {
  return <div className="mt-8 h-64 animate-pulse rounded-xl bg-black/5" aria-hidden="true" />;
}

export default async function GalleryPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  const works: WorkCard[] = await getSanityGalleryWorks();
  const cards: GalleryCard[] = works.map((work) => ({
    ...work,
    coverUrl: work.coverImage ? urlFor(work.coverImage).width(900).auto("format").url() : undefined,
  }));

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-6 text-[#0f1230] shadow-lg sm:p-8">
      <h1 className="mb-8 text-3xl font-semibold">{getDictionary(lang).gallery.title}</h1>
      <Suspense fallback={<GalleryFallback />}>
        <GalleryExplorer lang={lang} works={cards} />
      </Suspense>
    </section>
  );
}
import type { Metadata } from "next";
