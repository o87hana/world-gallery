export const PINS_QUERY = /* groq */ `
*[_type=="work" && published==true] | order(date desc) {
  "id": _id,
  "slug": slug.current,
  category,
  "title_ja": title_ja,
  "title_en": title_en,
  title,
  createdAt,
  location { lat, lng, placeName_ja, placeName_en },
  "coverImage": heroImage
}
`;

export const GALLERY_QUERY = /* groq */ `
*[_type == "work" && published == true] | order(createdAt desc) {
  _id,
  title,
  "slug": slug.current,
  category,
  "excerpt": pt::text(coalesce(blocks, body)),
  "heroUrl": heroImage.asset->url
}
`;

export const WORK_BY_SLUG_QUERY = /* groq */ `
*[_type == "work" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  category,
  published,
  createdAt,
  location { lat, lng },
  "heroUrl": heroImage.asset->url,
  blocks[]{
    ...,
    image{..., asset},
    images[]{..., asset}
  },
  "gallery": gallery[]{
    _key,
    alt,
    caption,
    "url": asset->url
  },
  "bodyText": pt::text(body)
}
`;
