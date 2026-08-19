import { isLang, type Lang } from "./i18n";

export function parsePreviewLanguage(value: string | null): Lang | null {
  return value && isLang(value) ? value : null;
}

export function parsePreviewSlug(value: string | null): string | null {
  if (!value || value !== value.trim() || value.length > 96) return null;
  if (/[/?#\u0000-\u001f\u007f]/u.test(value)) return null;
  return value;
}

export function previewPath(lang: Lang, slug: string): string {
  return `/${lang}/work/${encodeURIComponent(slug)}`;
}
