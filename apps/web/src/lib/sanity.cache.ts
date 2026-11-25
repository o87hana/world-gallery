export const SANITY_CACHE_TAGS = {
  works: "sanity:works",
  pins: "sanity:pins",
  gallery: "sanity:gallery",
  sitemap: "sanity:sitemap",
  designerProfile: "sanity:designer-profile",
  work: (slug: string) => `sanity:work:${slug}`,
} as const;
