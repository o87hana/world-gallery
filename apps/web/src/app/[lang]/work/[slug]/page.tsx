import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "@portabletext/react";
import { getServerSanityClient } from "@/lib/sanity.server";
import { urlFor } from "@/lib/sanity.client";
import { WORK_BY_SLUG_QUERY } from "@/lib/queries";

type WorkDetail = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  published?: boolean;
  heroUrl?: string;
  blocks?: any[];
  gallery?: { _key?: string; alt?: string; caption?: string; url?: string }[];
  bodyText?: string;
};

const gridColsClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-4",
} as const;

const gridGapClass = {
  small: "gap-3",
  medium: "gap-5",
  large: "gap-8",
} as const;

const widthClass = {
  full: "w-full",
  medium: "max-w-3xl",
  narrow: "max-w-xl",
} as const;

const spacerClass = {
  s: "h-6",
  m: "h-10",
  l: "h-16",
} as const;

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mt-6 text-base leading-7 text-black/80">{children}</p>,
    h2: ({ children }) => <h2 className="mt-10 text-2xl font-semibold">{children}</h2>,
    h3: ({ children }) => <h3 className="mt-8 text-xl font-semibold">{children}</h3>,
  },
  types: {
    imageBlock: ({ value }) => {
      const image = value?.image;
      const url = image?.asset ? urlFor(image).width(1600).auto("format").url() : "";
      const caption = image?.caption;
      const widthPreset = value?.widthPreset as keyof typeof widthClass | undefined;
      const width = widthClass[widthPreset ?? "full"] ?? widthClass.full;

      if (!url) return null;

      return (
        <figure className={`mt-8 ${width} mx-auto`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt={image?.alt ?? ""} className="w-full rounded-xl" />
          {caption ? <figcaption className="mt-3 text-sm text-black/60">{caption}</figcaption> : null}
        </figure>
      );
    },
    imageGridBlock: ({ value }) => {
      const images = Array.isArray(value?.images) ? value.images : [];
      if (images.length === 0) return null;

      const cols = Math.min(4, Math.max(1, Number(value?.columns ?? 2)));
      const gapKey = (value?.gap as keyof typeof gridGapClass) ?? "medium";
      const gap = gridGapClass[gapKey] ?? gridGapClass.medium;
      const colsClass = gridColsClass[cols as 1 | 2 | 3 | 4] ?? gridColsClass[2];

      return (
        <div className={`mt-10 grid ${colsClass} ${gap}`}>
          {images.map((img: any, i: number) => {
            const url = img?.asset ? urlFor(img).width(1200).auto("format").url() : "";
            if (!url) return null;
            return (
              <figure key={img?._key ?? i} className="overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={url} alt={img?.alt ?? ""} className="h-auto w-full" />
                {img?.caption ? <figcaption className="mt-2 text-sm text-black/60">{img.caption}</figcaption> : null}
              </figure>
            );
          })}
        </div>
      );
    },
    spacer: ({ value }) => {
      const sizeKey = (value?.size as keyof typeof spacerClass) ?? "m";
      const size = spacerClass[sizeKey] ?? spacerClass.m;
      return <div className={size} aria-hidden="true" />;
    },
    divider: ({ value }) => {
      const style = value?.style === "dashed" ? "border-dashed" : "border-solid";
      return <hr className={`my-10 border-t border-black/10 ${style}`} />;
    },
  },
};

export default async function WorkPage({ params }: { params: Promise<{ lang: "ja" | "en"; slug: string }> }) {
  const { slug } = await params;
  const client = await getServerSanityClient();
  const work: WorkDetail | null = await client.fetch(WORK_BY_SLUG_QUERY, { slug });

  if (!work) return notFound();

  // published=false は通常アクセスでは404（preview時だけ見える）
  if (work.published === false) {
    // draftMode時は通す（clientが previewDrafts）
  }

  const heroUrl = work.heroUrl ?? "";
  const galleryImages = (work.gallery ?? []).filter((img) => img?.url);
  const hasBlocks = Array.isArray(work.blocks) && work.blocks.length > 0;

  return (
    <article className="rounded-2xl bg-[#f6f2ea] p-10 text-[#0f1230] shadow-lg">
      <div className="text-sm text-black/60">{work.category}</div>
      <h1 className="mt-2 text-4xl font-semibold">{work.title}</h1>

      {heroUrl ? (
        <div className="mt-6 overflow-hidden rounded-2xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroUrl} alt={work.title} className="w-full" />
        </div>
      ) : null}

      {hasBlocks ? (
        <div className="mt-6">
          <PortableText value={work.blocks ?? []} components={portableTextComponents} />
        </div>
      ) : (
        <>
          {work.bodyText ? (
            <div className="mt-8 text-base leading-7 text-black/80 whitespace-pre-line">{work.bodyText}</div>
          ) : null}

          {galleryImages.length > 0 ? (
            <div className="mt-10 grid grid-cols-2 gap-4">
              {galleryImages.map((img, i) => (
                <div key={img?._key ?? i} className="overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.url} alt={img?.alt ?? work.title} className="h-auto w-full" />
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}
    </article>
  );
}
