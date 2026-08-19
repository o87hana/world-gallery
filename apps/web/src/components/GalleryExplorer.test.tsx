import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { GalleryCard } from "./GalleryExplorer";

const navigation = vi.hoisted(() => ({
  pathname: "/en/gallery",
  replace: vi.fn(),
  searchParams: new URLSearchParams("q=Tokyo&category=Sketch&category=Travel"),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => navigation.pathname,
  useRouter: () => ({ replace: navigation.replace }),
  useSearchParams: () => navigation.searchParams,
}));

import { GalleryExplorer } from "./GalleryExplorer";

const works: GalleryCard[] = [
  { id: "1", slug: "tokyo", category: "Sketch", title_ja: "東京", title_en: "Tokyo Lines" },
  { id: "2", slug: "london", category: "Architecture", title_ja: "ロンドン", title_en: "London Form" },
  { id: "3", slug: "travel", category: "Travel", title_ja: "旅", title_en: "Iceland Light" },
];

describe("GalleryExplorer", () => {
  beforeEach(() => {
    navigation.replace.mockReset();
    navigation.searchParams = new URLSearchParams("q=Tokyo&category=Sketch&category=Travel");
  });

  it("restores search and multiple categories from the URL and filters cards", () => {
    render(<GalleryExplorer lang="en" works={works} />);

    expect(screen.getByRole("searchbox")).toHaveValue("Tokyo");
    expect(screen.getByRole("checkbox", { name: "Sketch" })).toBeChecked();
    expect(screen.getByRole("checkbox", { name: "Travel" })).toBeChecked();
    expect(screen.getByRole("heading", { name: "Tokyo Lines" })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "London Form" })).not.toBeInTheDocument();
    expect(screen.getByText("1 work")).toBeInTheDocument();
  });

  it("writes search and category changes back to repeated URL parameters", () => {
    render(<GalleryExplorer lang="en" works={works} />);

    fireEvent.change(screen.getByRole("searchbox"), { target: { value: "London" } });
    expect(navigation.replace).toHaveBeenLastCalledWith(
      "/en/gallery?q=London&category=Sketch&category=Travel",
      { scroll: false },
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Travel" }));
    expect(navigation.replace).toHaveBeenLastCalledWith("/en/gallery?q=Tokyo&category=Sketch", { scroll: false });
  });

  it("shows a localized empty state and clears all filters", () => {
    navigation.searchParams = new URLSearchParams("q=missing&category=Other");
    render(<GalleryExplorer lang="ja" works={works} />);

    expect(screen.getByText("条件に一致する作品がありません。")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "絞り込みを解除" }));
    expect(navigation.replace).toHaveBeenLastCalledWith("/en/gallery", { scroll: false });
  });
});
