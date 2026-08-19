import { sanityClient, urlFor } from "@/lib/sanity.client";
import { GALLERY_QUERY } from "@/lib/queries";
import type { WorkCard } from "@/lib/work";

export default async function GalleryPage() {
  const works: WorkCard[] = await sanityClient.fetch(GALLERY_QUERY);

  return (
    <main style={{ padding: 24 }}>
      <h1>Gallery</h1>
      <ul
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: 16,
          listStyle: "none",
          padding: 0,
        }}
      >
        {works.map((w) => (
          <li
            key={w.id}
            style={{ border: "1px solid #333", borderRadius: 12, overflow: "hidden" }}
          >
            {w.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlFor(w.coverImage).width(800).height(600).url()}
                alt={w.title_en || w.title_ja}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
            ) : (
              <div style={{ height: 180, background: "#222" }} />
            )}
            <div style={{ padding: 12 }}>
              <div style={{ opacity: 0.7, fontSize: 12 }}>{w.category}</div>
              <div style={{ fontWeight: 600 }}>{w.title_en || w.title_ja}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
