import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  GALLERY_QUERY,
  PINS_QUERY,
  PREVIEW_WORK_BY_SLUG_QUERY,
  PUBLIC_WORK_BY_SLUG_QUERY,
  SITEMAP_WORKS_QUERY,
} from "./queries";
import { SANITY_CACHE_TAGS } from "./sanity.cache";

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  getPublicSanityClient: vi.fn(),
  getServerSanityContext: vi.fn(),
}));

vi.mock("./sanity.server", () => ({
  getPublicSanityClient: mocks.getPublicSanityClient,
  getServerSanityContext: mocks.getServerSanityContext,
}));

import {
  getSanityGalleryWorks,
  getSanityPins,
  getSanitySitemapWorks,
  getSanityWork,
} from "./sanity.data";

describe("Sanity data cache policy", () => {
  beforeEach(() => {
    mocks.fetch.mockReset();
    mocks.fetch.mockResolvedValue([]);
    mocks.getPublicSanityClient.mockReset();
    mocks.getPublicSanityClient.mockReturnValue({ fetch: mocks.fetch });
    mocks.getServerSanityContext.mockReset();
    mocks.getServerSanityContext.mockResolvedValue({
      client: { fetch: mocks.fetch },
      isDraft: false,
    });
  });

  it.each([
    ["pins", getSanityPins, PINS_QUERY, [SANITY_CACHE_TAGS.works, SANITY_CACHE_TAGS.pins]],
    [
      "gallery",
      getSanityGalleryWorks,
      GALLERY_QUERY,
      [SANITY_CACHE_TAGS.works, SANITY_CACHE_TAGS.gallery],
    ],
  ])("caches published %s data with revalidation tags", async (_name, load, query, tags) => {
    await load();

    expect(mocks.fetch).toHaveBeenCalledWith(query, {}, {
      cache: "force-cache",
      next: { revalidate: 3600, tags },
    });
  });

  it("uses a slug-specific tag for a published work", async () => {
    mocks.fetch.mockResolvedValue(null);

    await getSanityWork("my-work");

    expect(mocks.fetch).toHaveBeenCalledWith(
      PUBLIC_WORK_BY_SLUG_QUERY,
      { slug: "my-work" },
      {
        cache: "force-cache",
        next: {
          revalidate: 3600,
          tags: [SANITY_CACHE_TAGS.works, SANITY_CACHE_TAGS.work("my-work")],
        },
      },
    );
  });

  it("bypasses every cache and uses the draft query in Preview mode", async () => {
    mocks.getServerSanityContext.mockResolvedValue({
      client: { fetch: mocks.fetch },
      isDraft: true,
    });
    mocks.fetch.mockResolvedValue(null);

    await getSanityWork("draft-work");

    expect(mocks.fetch).toHaveBeenCalledWith(
      PREVIEW_WORK_BY_SLUG_QUERY,
      { slug: "draft-work" },
      { cache: "no-store" },
    );
  });

  it("keeps sitemap data on the published client with its own tag", async () => {
    await getSanitySitemapWorks();

    expect(mocks.getServerSanityContext).not.toHaveBeenCalled();
    expect(mocks.getPublicSanityClient).toHaveBeenCalledOnce();
    expect(mocks.fetch).toHaveBeenCalledWith(SITEMAP_WORKS_QUERY, {}, {
      cache: "force-cache",
      next: {
        revalidate: 3600,
        tags: [SANITY_CACHE_TAGS.works, SANITY_CACHE_TAGS.sitemap],
      },
    });
  });

  it("propagates a cold-fetch failure to the route error boundary", async () => {
    const error = new Error("Sanity unavailable");
    mocks.fetch.mockRejectedValue(error);

    await expect(getSanityPins()).rejects.toBe(error);
  });
});
