import { describe, expect, it, vi } from "vitest";
import { CategoryColor } from "@/lib/colors";
import type { WorkPin } from "@/lib/work";
import { createGlobeData, optimizeSanityImageUrl, supportsWebGL } from "./globe";

const pins: WorkPin[] = [
  {
    id: "tokyo",
    slug: "tokyo",
    category: "Sketch",
    title_ja: "東京",
    title_en: "Tokyo",
    location: { lat: 35.6, lng: 139.6, placeName_ja: "東京", placeName_en: "Tokyo" },
    coverUrl: "https://cdn.sanity.io/images/project/production/image.jpg",
  },
  {
    id: "invalid",
    slug: "invalid",
    category: "Other",
    title_ja: "無効",
    location: { lat: 100, lng: 0 },
  },
];

describe("globe data", () => {
  it("localizes valid pins, assigns the fixed category color, and optimizes Sanity images", () => {
    expect(createGlobeData(pins, "en")).toEqual([
      expect.objectContaining({
        id: "tokyo",
        lat: 35.6,
        lng: 139.6,
        title: "Tokyo",
        placeName: "Tokyo",
        color: CategoryColor.Sketch,
        coverUrl: "https://cdn.sanity.io/images/project/production/image.jpg?w=480&q=70&auto=format",
      }),
    ]);
  });

  it("uses the Japanese title as the indexed English fallback", () => {
    expect(createGlobeData([{ ...pins[0], title_en: undefined }], "en")[0].title).toBe("東京");
  });

  it("rejects non-Sanity and malformed image URLs", () => {
    expect(optimizeSanityImageUrl("https://example.com/image.jpg")).toBeUndefined();
    expect(optimizeSanityImageUrl("not-a-url")).toBeUndefined();
  });
});

describe("WebGL support", () => {
  it("accepts WebGL even when WebGPU APIs are unavailable", () => {
    const getContext = vi.fn((name: string) => (name === "webgl" ? {} : null));
    const documentObject = { createElement: vi.fn(() => ({ getContext })) } as unknown as Pick<Document, "createElement">;
    expect(supportsWebGL(documentObject)).toBe(true);
    expect(getContext).toHaveBeenCalledWith("webgl");
  });

  it("rejects browsers without either WebGL context", () => {
    const documentObject = {
      createElement: vi.fn(() => ({ getContext: vi.fn(() => null) })),
    } as unknown as Pick<Document, "createElement">;
    expect(supportsWebGL(documentObject)).toBe(false);
  });
});
