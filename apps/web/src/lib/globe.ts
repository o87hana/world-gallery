import { CategoryColor } from "@/lib/colors";
import type { Lang } from "@/lib/i18n";
import { localizedValue, type WorkPin } from "@/lib/work";

export type GlobeDatum = WorkPin & {
  lat: number;
  lng: number;
  color: string;
  title: string;
  placeName?: string;
  coverUrl?: string;
};

export function optimizeSanityImageUrl(source: string | undefined): string | undefined {
  if (!source) return undefined;

  try {
    const url = new URL(source);
    if (url.protocol !== "https:" || url.hostname !== "cdn.sanity.io") return undefined;
    url.searchParams.set("w", "480");
    url.searchParams.set("q", "70");
    url.searchParams.set("auto", "format");
    return url.toString();
  } catch {
    return undefined;
  }
}

export function createGlobeData(pins: WorkPin[], lang: Lang): GlobeDatum[] {
  return pins
    .filter(
      (pin) =>
        Number.isFinite(pin.location?.lat) &&
        Number.isFinite(pin.location?.lng) &&
        pin.location.lat >= -90 &&
        pin.location.lat <= 90 &&
        pin.location.lng >= -180 &&
        pin.location.lng <= 180,
    )
    .map((pin) => ({
      ...pin,
      lat: pin.location.lat,
      lng: pin.location.lng,
      color: CategoryColor[pin.category],
      title: localizedValue(lang, pin.title_ja, pin.title_en),
      placeName: lang === "ja" ? pin.location.placeName_ja : pin.location.placeName_en,
      coverUrl: optimizeSanityImageUrl(pin.coverUrl),
    }));
}

export function supportsWebGL(documentObject: Pick<Document, "createElement"> = document): boolean {
  try {
    const canvas = documentObject.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}
