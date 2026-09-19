import type { QueryParams } from "@sanity/client";
import {
  GALLERY_QUERY,
  PINS_QUERY,
  PREVIEW_WORK_BY_SLUG_QUERY,
  PUBLIC_WORK_BY_SLUG_QUERY,
  SITEMAP_WORKS_QUERY,
} from "@/lib/queries";
import { getPublicSanityClient, getServerSanityContext } from "@/lib/sanity.server";
import type { WorkCard, WorkDetail, WorkPin } from "@/lib/work";

export const SANITY_CACHE_TAGS = {
  works: "sanity:works",
  pins: "sanity:pins",
  gallery: "sanity:gallery",
  sitemap: "sanity:sitemap",
  work: (slug: string) => `sanity:work:${slug}`,
} as const;

const SANITY_REVALIDATE_SECONDS = 60 * 60;

function publicFetchOptions(tags: string[]) {
  return {
    cache: "force-cache" as const,
    next: {
      revalidate: SANITY_REVALIDATE_SECONDS,
      tags,
    },
  };
}

const previewFetchOptions = { cache: "no-store" as const };

async function fetchForCurrentMode<T>(
  publicQuery: string,
  tags: string[],
  params: QueryParams = {},
  previewQuery = publicQuery,
) {
  const { client, isDraft } = await getServerSanityContext();

  return client.fetch<T>(
    isDraft ? previewQuery : publicQuery,
    params,
    isDraft ? previewFetchOptions : publicFetchOptions(tags),
  );
}

export function getSanityPins() {
  return fetchForCurrentMode<WorkPin[]>(PINS_QUERY, [
    SANITY_CACHE_TAGS.works,
    SANITY_CACHE_TAGS.pins,
  ]);
}

export function getSanityGalleryWorks() {
  return fetchForCurrentMode<WorkCard[]>(GALLERY_QUERY, [
    SANITY_CACHE_TAGS.works,
    SANITY_CACHE_TAGS.gallery,
  ]);
}

export function getSanityWork(slug: string) {
  return fetchForCurrentMode<WorkDetail | null>(
    PUBLIC_WORK_BY_SLUG_QUERY,
    [SANITY_CACHE_TAGS.works, SANITY_CACHE_TAGS.work(slug)],
    { slug },
    PREVIEW_WORK_BY_SLUG_QUERY,
  );
}

export function getSanitySitemapWorks() {
  return getPublicSanityClient().fetch<WorkPin[]>(
    SITEMAP_WORKS_QUERY,
    {},
    publicFetchOptions([SANITY_CACHE_TAGS.works, SANITY_CACHE_TAGS.sitemap]),
  );
}
