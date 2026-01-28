import { sanityClient, urlFor } from "@/lib/sanity.client";

type Work = {
  _id: string;
  title: string;
  slug: { current: string };
  category: string;
  heroImage?: any;
};

const query = /* groq */ `
*[_type=="work" && published==true] | order(createdAt desc) {
  _id, title, slug, category, heroImage
}
`;

export default async function GalleryPage() {
  const works: Work[] = await sanityClient.fetch(query);

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
            key={w._id}
            style={{ border: "1px solid #333", borderRadius: 12, overflow: "hidden" }}
          >
            {w.heroImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlFor(w.heroImage).width(800).height(600).url()}
                alt={w.title}
                style={{ width: "100%", height: 180, objectFit: "cover" }}
              />
            ) : (
              <div style={{ height: 180, background: "#222" }} />
            )}
            <div style={{ padding: 12 }}>
              <div style={{ opacity: 0.7, fontSize: 12 }}>{w.category}</div>
              <div style={{ fontWeight: 600 }}>{w.title}</div>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
