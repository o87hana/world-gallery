import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

const mocks = vi.hoisted(() => ({
  getSanityWork: vi.fn(),
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

vi.mock("next/navigation", () => ({ notFound: mocks.notFound }));
vi.mock("@/lib/sanity.data", () => ({ getSanityWork: mocks.getSanityWork }));
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
    mocks.getSanityWork.mockReset();
    mocks.notFound.mockClear();
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

    mocks.getSanityWork.mockResolvedValue(null);

    await expect(
      WorkPage({ params: Promise.resolve({ lang: "ja", slug: unpublishedFixture.slug }) }),
    ).rejects.toThrow("NEXT_NOT_FOUND");

    expect(mocks.getSanityWork).toHaveBeenCalledWith(unpublishedFixture.slug);
    expect(mocks.notFound).toHaveBeenCalledOnce();
  });

  it("renders an unpublished work returned by the Preview-aware data loader", async () => {
    const unpublishedFixture = {
      _id: "unpublished-work",
      slug: "secret-work",
      title_ja: "非公開作品",
      title_en: "Secret work",
      category: "Research",
      published: false,
    };

    mocks.getSanityWork.mockResolvedValue(unpublishedFixture);

    await WorkPage({ params: Promise.resolve({ lang: "ja", slug: unpublishedFixture.slug }) });

    expect(mocks.getSanityWork).toHaveBeenCalledWith(unpublishedFixture.slug);
    expect(mocks.notFound).not.toHaveBeenCalled();
  });

  it("renders indexed Japanese fallback content when English is missing", async () => {
    mocks.getSanityWork.mockResolvedValue({
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
