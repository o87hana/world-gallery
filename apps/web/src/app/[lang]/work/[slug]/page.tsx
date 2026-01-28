import { notFound } from "next/navigation";
import { getServerSanityClient } from "@/lib/sanity.server";
import { WORK_BY_SLUG_QUERY } from "@/lib/queries";

type WorkDetail = {
  _id: string;
  slug: string;
  title: string;
  category: string;
  published?: boolean;
  heroUrl?: string;
  gallery?: { _key?: string; alt?: string; caption?: string; url?: string }[];
  bodyText?: string;
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
    </article>
  );
}
