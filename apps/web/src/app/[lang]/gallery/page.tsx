import Link from "next/link";
import { getServerSanityClient } from "@/lib/sanity.server";
import { GALLERY_QUERY } from "@/lib/queries";

type WorkCard = {
  _id: string;
  slug: string;
  category: string;
  title: string;
  excerpt?: string;
  heroUrl?: string;
};

export default async function GalleryPage({ params }: { params: Promise<{ lang: "ja" | "en" }> }) {
  const { lang } = await params;
  const client = await getServerSanityClient();
  const works: WorkCard[] = await client.fetch(GALLERY_QUERY);

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-8 shadow-lg text-[#0f1230]">
      <h1 className="mb-8 text-3xl font-semibold">Gallery</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {works.map((w) => (
          <Link key={w._id} href={`/${lang}/work/${w.slug}`} className="group">
            <div className="overflow-hidden rounded-2xl bg-white shadow-md">
              {w.heroUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={w.heroUrl}
                  alt={w.title}
                  className="h-52 w-full object-cover transition group-hover:scale-[1.02]"
                />
              ) : (
                <div className="h-52 w-full bg-[#e6e0d6]" />
              )}
              <div className="p-4">
                <div className="text-xs text-black/60">{w.category}</div>
                <div className="mt-1 text-lg font-semibold">{w.title}</div>
                {w.excerpt ? <p className="mt-3 text-sm leading-6 text-black/70 line-clamp-3">{w.excerpt}</p> : null}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
