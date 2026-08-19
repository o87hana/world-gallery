import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import { PREVIEW_WORK_BY_SLUG_QUERY, PUBLIC_WORK_BY_SLUG_QUERY } from "@/lib/queries";

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
  getServerSanityContext: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/lib/sanity.server", () => ({ getServerSanityContext: mocks.getServerSanityContext }));
vi.mock("@/lib/sanity.client", () => ({
  urlFor: vi.fn(() => ({
    width: vi.fn().mockReturnThis(),
    auto: vi.fn().mockReturnThis(),
    url: vi.fn(() => ""),
  })),
}));

import WorkPage from "./page";

describe("WorkPage public access", () => {
  beforeEach(() => {
    mocks.fetch.mockReset();
    mocks.getServerSanityContext.mockReset();
    mocks.notFound.mockClear();
    mocks.getServerSanityContext.mockResolvedValue({
      client: { fetch: mocks.fetch },
      isDraft: false,
    });
  });

  it("returns not found when an unpublished slug is absent from the public query", async () => {
    const unpublishedFixture = {
      _id: "unpublished-work",
      slug: "secret-work",
      title_ja: "非公開作品",
      title_en: "Secret work",
      category: "Research",
      published: false,
    };

    mocks.fetch.mockImplementation(async (query: string) =>
      query === PUBLIC_WORK_BY_SLUG_QUERY ? null : unpublishedFixture,
    );

    await expect(
      WorkPage({ params: Promise.resolve({ lang: "ja", slug: unpublishedFixture.slug }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.fetch).toHaveBeenCalledWith(PUBLIC_WORK_BY_SLUG_QUERY, {
      slug: unpublishedFixture.slug,
    });
    expect(mocks.notFound).toHaveBeenCalledOnce();
  });

  it("uses the separate preview query when draft mode is enabled", async () => {
    const unpublishedFixture = {
      _id: "unpublished-work",
      slug: "secret-work",
      title_ja: "非公開作品",
      title_en: "Secret work",
      category: "Research",
      published: false,
    };

    mocks.getServerSanityContext.mockResolvedValue({
      client: { fetch: mocks.fetch },
      isDraft: true,
    });
    mocks.fetch.mockResolvedValue(unpublishedFixture);

    await WorkPage({ params: Promise.resolve({ lang: "ja", slug: unpublishedFixture.slug }) });

    expect(mocks.fetch).toHaveBeenCalledWith(PREVIEW_WORK_BY_SLUG_QUERY, {
      slug: unpublishedFixture.slug,
    });
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it("renders indexed Japanese fallback content when English is missing", async () => {
    mocks.fetch.mockResolvedValue({
      id: "localized-work",
      slug: "localized-work",
      title_ja: "日本語タイトル",
      title_en: "",
      subtitle_ja: "日本語サブタイトル",
      subtitle_en: "",
      category: "Sketch",
      published: true,
      date: "2026-08-01T09:00:00.000Z",
      location: { lat: 35.6, lng: 139.6 },
      blocks: [],
    });

    render(await WorkPage({ params: Promise.resolve({ lang: "en", slug: "localized-work" }) }));

    expect(screen.getByRole("heading", { name: "日本語タイトル" })).toBeInTheDocument();
    expect(screen.getByText("August 1, 2026")).toBeInTheDocument();
    expect(screen.getByText("This work is currently shown in Japanese.")).toBeInTheDocument();
    expect(screen.getByText("日本語サブタイトル")).toBeInTheDocument();
  });
});
