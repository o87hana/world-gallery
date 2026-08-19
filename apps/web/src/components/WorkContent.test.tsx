import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { WorkContentBlock } from "@/lib/work";

vi.mock("@/lib/sanity.client", () => ({
  urlFor: vi.fn((image: { asset?: { _ref?: string } }) => ({
    width: vi.fn().mockReturnThis(),
    auto: vi.fn().mockReturnThis(),
    url: vi.fn(() => `https://cdn.sanity.io/${image.asset?._ref ?? "missing"}.jpg`),
  })),
}));

import { WorkContent } from "./WorkContent";

const richText = (key: string, text: string) => [
  {
    _key: key,
    _type: "block" as const,
    style: "normal",
    markDefs: [],
    children: [{ _key: `${key}-span`, _type: "span" as const, marks: [], text }],
  },
];

const blocks: WorkContentBlock[] = [
  {
    _key: "text",
    _type: "textBlock",
    body_ja: richText("ja", "日本語の本文"),
    body_en: richText("en", "English body"),
  },
  {
    _key: "image",
    _type: "imageBlock",
    image: { asset: { _type: "reference", _ref: "image-one" }, alt: "Study" },
    caption_ja: "日本語キャプション",
    caption_en: "English caption",
    widthPreset: "narrow",
  },
  {
    _key: "grid",
    _type: "imageGridBlock",
    columns: 3,
    gap: "large",
    images: [
      {
        _key: "grid-one",
        asset: { _type: "reference", _ref: "image-two" },
        alt: "Grid study",
        caption_ja: "グリッド画像",
        caption_en: "Grid image",
      },
    ],
  },
  { _key: "spacer", _type: "spacer", size: "l" },
  { _key: "divider", _type: "divider", style: "dashed" },
];

describe("WorkContent", () => {
  it("renders Japanese text, captions, image widths, grid columns, spacer, and divider", () => {
    const { container } = render(<WorkContent blocks={blocks} lang="ja" />);

    expect(screen.getByText("日本語の本文")).toBeInTheDocument();
    expect(screen.getByText("日本語キャプション")).toBeInTheDocument();
    expect(screen.getByText("グリッド画像")).toBeInTheDocument();
    expect(screen.queryByText("English body")).not.toBeInTheDocument();
    expect(screen.getByAltText("Study").closest("figure")).toHaveClass("max-w-xl");
    expect(screen.getByAltText("Grid study").closest("div.grid")).toHaveClass("md:grid-cols-3", "gap-8");
    expect(container.querySelector(".h-16")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("hr")).toHaveClass("border-dashed");
  });

  it("renders only English localized fields on the English route", () => {
    render(<WorkContent blocks={blocks} lang="en" />);

    expect(screen.getByText("English body")).toBeInTheDocument();
    expect(screen.getByText("English caption")).toBeInTheDocument();
    expect(screen.getByText("Grid image")).toBeInTheDocument();
    expect(screen.queryByText("日本語の本文")).not.toBeInTheDocument();
  });

  it("shows Japanese text as the indexed fallback when English is missing", () => {
    render(
      <WorkContent
        lang="en"
        blocks={[{ _key: "ja-only", _type: "textBlock", body_ja: richText("ja-only", "日本語のみ") }]}
      />,
    );

    expect(screen.getByText("日本語のみ")).toBeInTheDocument();
  });
});
