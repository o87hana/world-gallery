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
