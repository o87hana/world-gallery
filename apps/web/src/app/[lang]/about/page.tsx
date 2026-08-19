import type { Metadata } from "next";
import Image from "next/image";
import { getAboutContent } from "@/lib/about";
import type { Lang } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata({
    lang,
    path: "/about",
    title: lang === "ja" ? "デザイナー 村上花" : "Designer Hana Murakami",
    description: lang === "ja" ? "村上花の経歴、スキル、建築に対する思想を紹介します。" : "Hana Murakami's biography, skills, and architectural philosophy.",
  });
}

export default async function AboutPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const content = getAboutContent(lang);

  return (
    <section className="rounded-2xl bg-[#f6f2ea] px-6 py-10 text-[#0f1230] shadow-lg sm:px-12 sm:py-14">
      <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
        <div className="space-y-12">
          <div className="flex items-start gap-6">
            <span className="mt-1 h-12 w-1.5 bg-[#121a4d]" aria-hidden="true" />
            <div>
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">{content.role}</h1>
              <p className="mt-3 text-lg sm:text-xl">{content.name}</p>
            </div>
          </div>

          <ol className="space-y-3 text-sm leading-relaxed text-[#3b3f58]">
            {content.timeline.map((entry) => (
              <li key={entry.year} className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:gap-4">
                <time className="font-semibold text-[#0f1230]">{entry.year}</time>
                <span>{entry.text}</span>
              </li>
            ))}
          </ol>

          <div className="space-y-4 text-sm text-[#3b3f58]">
            <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-[#0f1230]">
              {content.featuredHeading}
            </h2>
            <dl className="space-y-3">
              {content.featured.map((entry) => (
                <div key={entry.year} className="grid gap-1 sm:grid-cols-[4rem_1fr] sm:gap-4">
                  <dt className="font-semibold text-[#0f1230]">{entry.year}</dt>
                  <dd className="space-y-1">
                    {entry.items.map((item) => <p key={item}>{item}</p>)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="w-full max-w-md rounded-2xl bg-white p-4 shadow-md">
            <Image
              src="/designerphoto.avif"
              alt={content.portraitAlt}
              width={594}
              height={594}
              sizes="(max-width: 1024px) calc(100vw - 4rem), 28rem"
              className="h-auto w-full rounded-xl object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-16 border-t-4 border-[#0f1230] pt-12">
        <div className="space-y-8 text-sm text-[#3b3f58]">
          <div className="flex items-start gap-6">
            <span className="mt-1 h-10 w-1.5 bg-[#121a4d]" aria-hidden="true" />
            <h2 className="text-xl font-semibold tracking-tight text-[#0f1230] sm:text-2xl">
              {content.skillsHeading}
            </h2>
          </div>
          {content.skills.map((group) => (
            <div key={group.experience} className="grid gap-3 sm:grid-cols-[160px_1fr] sm:gap-6">
              <p className="font-semibold text-[#0f1230]">{group.experience}</p>
              <ul className="space-y-1">
                {group.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-16 border-t-4 border-[#0f1230] pt-12">
        <div className="space-y-6 text-sm leading-relaxed text-[#3b3f58]">
          <div className="flex items-start gap-6">
            <span className="mt-1 h-10 w-1.5 bg-[#121a4d]" aria-hidden="true" />
            <h2 className="text-xl font-semibold tracking-tight text-[#0f1230] sm:text-2xl">
              {content.philosophyHeading}
            </h2>
          </div>
          {content.philosophy.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <p className="pt-4 font-semibold text-[#0f1230]">{content.signature}</p>
        </div>
      </div>
    </section>
  );
}
