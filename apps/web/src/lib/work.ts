import type { SanityImageSource } from "@sanity/image-url";
import type { PortableTextBlock } from "@portabletext/react";
import type { Lang } from "@/lib/i18n";

export const WORK_CATEGORIES = ["Sketch", "Architecture", "Travel", "Research", "Other"] as const;

export type WorkCategory = (typeof WORK_CATEGORIES)[number];

export type LocalizedWorkFields = {
  title_ja: string;
  title_en?: string;
  subtitle_ja?: string;
  subtitle_en?: string;
};

export type WorkLocation = {
  lat: number;
  lng: number;
  placeName_ja?: string;
  placeName_en?: string;
};

export type WorkPin = {
  id: string;
  slug: string;
  category: WorkCategory;
  title_ja: string;
  title_en?: string;
  date?: string;
  location: WorkLocation;
  coverUrl?: string;
};

export type WorkCard = LocalizedWorkFields & {
  id: string;
  slug: string;
  category: WorkCategory;
  date?: string;
  coverImage?: SanityImageSource;
};

export type WorkDetail = LocalizedWorkFields & {
  id: string;
  slug: string;
  category: WorkCategory;
  published?: boolean;
  date?: string;
  location: WorkLocation;
  coverImage?: SanityImageSource;
  blocks?: WorkContentBlock[];
};

export type WorkImage = {
  _type?: "image";
  _key?: string;
  alt?: string;
  caption_ja?: string;
  caption_en?: string;
  asset?: {
    _ref?: string;
    _type?: "reference";
    url?: string;
  };
};

export type WorkTextBlock = {
  _key: string;
  _type: "textBlock";
  body_ja?: PortableTextBlock[];
  body_en?: PortableTextBlock[];
};

export type WorkImageBlock = {
  _key: string;
  _type: "imageBlock";
  image?: WorkImage;
  caption_ja?: string;
  caption_en?: string;
  widthPreset?: "full" | "medium" | "narrow";
};

export type WorkImageGridBlock = {
  _key: string;
  _type: "imageGridBlock";
  images?: WorkImage[];
  columns?: 1 | 2 | 3 | 4;
  gap?: "small" | "medium" | "large";
};

export type WorkSpacerBlock = {
  _key: string;
  _type: "spacer";
  size?: "s" | "m" | "l";
};

export type WorkDividerBlock = {
  _key: string;
  _type: "divider";
  style?: "solid" | "dashed";
};

export type WorkContentBlock =
  | PortableTextBlock
  | WorkTextBlock
  | WorkImageBlock
  | WorkImageGridBlock
  | WorkSpacerBlock
  | WorkDividerBlock;

export function localizedValue(
  lang: Lang,
  valueJa: string,
  valueEn?: string,
): string {
  return lang === "ja" ? valueJa : valueEn?.trim() || valueJa;
}

export function localizedOptionalValue(
  lang: Lang,
  valueJa?: string,
  valueEn?: string,
): string | undefined {
  return lang === "ja" ? valueJa : valueEn?.trim() || valueJa;
}
