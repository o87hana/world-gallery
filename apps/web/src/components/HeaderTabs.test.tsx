import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { HeaderTabs } from "./HeaderTabs";

const mocks = vi.hoisted(() => ({ pathname: "/en/gallery" }));

vi.mock("next/navigation", () => ({
  usePathname: () => mocks.pathname,
}));

describe("HeaderTabs", () => {
  beforeEach(() => {
    mocks.pathname = "/en/gallery";
  });

  it("marks the current English route and preserves it when switching languages", () => {
    render(<HeaderTabs lang="en" />);

    expect(screen.getByRole("navigation", { name: "Main navigation" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Gallery" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "JA" })).toHaveAttribute("href", "/ja/gallery");
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("aria-current", "page");
  });

  it("preserves a work slug when switching from Japanese to English", () => {
    mocks.pathname = "/ja/work/tokyo-observation-sketch";
    render(<HeaderTabs lang="ja" />);

    expect(screen.getByRole("navigation", { name: "メインナビゲーション" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute(
      "href",
      "/en/work/tokyo-observation-sketch",
    );
    expect(screen.getByRole("link", { name: "JA" })).toHaveAttribute("aria-current", "page");
  });
});
