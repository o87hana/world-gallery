const PUBLIC_WORK_FILTER = `_type == "work" && published == true`;

export const PINS_QUERY = /* groq */ `
*[${PUBLIC_WORK_FILTER}] | order(date desc) {
  "id": _id,
  "slug": slug.current,
  category,
  title_ja,
  title_en,
  date,
  location { lat, lng, placeName_ja, placeName_en },
  "coverUrl": coverImage.asset->url
}
`;

export const GALLERY_QUERY = /* groq */ `
*[${PUBLIC_WORK_FILTER}] | order(date desc) {
  "id": _id,
  "slug": slug.current,
  category,
  title_ja,
  title_en,
  subtitle_ja,
  subtitle_en,
  date,
  coverImage
}
`;

export const SITEMAP_WORKS_QUERY = /* groq */ `
*[${PUBLIC_WORK_FILTER}] | order(date desc) {
  "id": _id,
  "slug": slug.current,
  date,
  "coverUrl": coverImage.asset->url
}
`;

export const DESIGNER_PROFILE_QUERY = /* groq */ `
*[_type == "designerProfile"] | order(_updatedAt desc)[0] {
  role_ja, role_en, name_ja, name_en,
  "portraitUrl": portrait.asset->url,
  "portraitAlt_ja": portrait.alt_ja, "portraitAlt_en": portrait.alt_en,
  timeline[]{year, text_ja, text_en},
  featured_heading_ja, featured_heading_en,
  featured[]{year, items_ja[]{title_ja, title_en, url}, items_en[]{title_ja, title_en, url}},
  skills_heading_ja, skills_heading_en,
  skills[]{experience_ja, experience_en, items_ja, items_en},
  philosophy_heading_ja, philosophy_heading_en, philosophy_ja, philosophy_en,
  signature
}
`;

const workBySlugProjection = /* groq */ `{
  "id": _id,
  "slug": slug.current,
  category,
  published,
  title_ja,
  title_en,
  subtitle_ja,
  subtitle_en,
  date,
  location { lat, lng, placeName_ja, placeName_en },
  coverImage,
  blocks[]{
    ...,
    image{..., asset},
    images[]{..., asset}
  }
}`;

export const PUBLIC_WORK_BY_SLUG_QUERY = /* groq */ `
*[${PUBLIC_WORK_FILTER} && slug.current == $slug][0]${workBySlugProjection}
`;

export const PREVIEW_WORK_BY_SLUG_QUERY = /* groq */ `
*[_type == "work" && slug.current == $slug][0]${workBySlugProjection}
`;
