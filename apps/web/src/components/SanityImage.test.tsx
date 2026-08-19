import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { getSanityImageDimensions, SanityImage } from "./SanityImage";

describe("SanityImage", () => {
  it("uses dimensions encoded in a Sanity CDN URL", () => {
    expect(getSanityImageDimensions("https://cdn.sanity.io/images/p/d/hash-1200x800.jpg?w=900")).toEqual({
      width: 1200,
      height: 800,
    });
  });

  it("uses a safe fallback for malformed or non-Sanity URLs", () => {
    expect(getSanityImageDimensions("https://example.com/image.jpg")).toEqual({ width: 3, height: 2 });
    expect(getSanityImageDimensions("invalid")).toEqual({ width: 3, height: 2 });
  });

  it("renders meaningful alternative text and responsive sizes", () => {
    render(
      <SanityImage
        src="https://cdn.sanity.io/images/p/d/hash-1200x800.jpg"
        alt="Architectural model"
        sizes="100vw"
        loading="eager"
      />,
    );
    expect(screen.getByRole("img", { name: "Architectural model" })).toHaveAttribute("sizes", "100vw");
    expect(screen.getByRole("img", { name: "Architectural model" })).toHaveAttribute("loading", "eager");
  });
});
