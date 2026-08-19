import React, { type Ref, forwardRef, useImperativeHandle } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { GlobeDatum } from "@/lib/globe";
import type { WorkPin } from "@/lib/work";
import { GlobeView } from "./GlobeView";

const mocks = vi.hoisted(() => ({
  coarsePointer: false,
  push: vi.fn(),
  controls: {
    enableDamping: false,
    dampingFactor: 0,
    rotateSpeed: 0,
    zoomSpeed: 0,
  },
}));

type FakeGlobeProps = {
  pointsData: GlobeDatum[];
  onPointHover: (datum: GlobeDatum | null) => void;
  onPointClick: (datum: GlobeDatum) => void;
};

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mocks.push }),
}));

vi.mock("next/dynamic", () => ({
  default: () => {
    const FakeGlobe = forwardRef(function FakeGlobe(
      { pointsData, onPointHover, onPointClick }: FakeGlobeProps,
      ref: Ref<unknown>,
    ) {
      useImperativeHandle(ref, () => ({
        renderer: () => ({ setSize: vi.fn() }),
        scene: () => ({ add: vi.fn() }),
        controls: () => mocks.controls,
        globeMaterial: () => ({ map: null }),
      }));

      const point = pointsData[0];
      return (
        <div data-testid="fake-globe" data-point-count={pointsData.length}>
          <button onMouseEnter={() => onPointHover(point)}>Hover point</button>
          <button onMouseEnter={() => onPointHover(null)}>Leave point</button>
          <button onClick={() => onPointClick(point)}>Click point</button>
        </div>
      );
    });

    return FakeGlobe;
  },
}));

vi.mock("@/lib/globe", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/globe")>();
  return { ...original, supportsWebGL: () => true };
});

const pin: WorkPin = {
  id: "tokyo",
  slug: "tokyo",
  category: "Sketch",
  title_ja: "東京",
  title_en: "Tokyo",
  location: {
    lat: 35.6762,
    lng: 139.6503,
    placeName_ja: "東京",
    placeName_en: "Tokyo",
  },
};

class ResizeObserverMock implements ResizeObserver {
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

function installMatchMedia() {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: vi.fn((query: string) => ({
      matches: query.includes("pointer") ? mocks.coarsePointer : false,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

describe("GlobeView interactions", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mocks.coarsePointer = false;
    Object.assign(mocks.controls, {
      enableDamping: false,
      dampingFactor: 0,
      rotateSpeed: 0,
      zoomSpeed: 0,
    });
    installMatchMedia();
    vi.stubGlobal("ResizeObserver", ResizeObserverMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("shows a desktop hover card after 300ms and opens a work directly on click", () => {
    render(<GlobeView lang="en" pins={[pin]} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Hover point" }));
    act(() => vi.advanceTimersByTime(299));
    expect(screen.queryByText("Tokyo")).not.toBeInTheDocument();

    act(() => vi.advanceTimersByTime(1));
    expect(screen.getByRole("status")).toHaveTextContent("Tokyo");

    fireEvent.click(screen.getByRole("button", { name: "Click point" }));
    expect(mocks.push).toHaveBeenCalledWith("/en/work/tokyo");
  });

  it("cancels a pending desktop hover card when the pointer leaves", () => {
    render(<GlobeView lang="en" pins={[pin]} />);

    fireEvent.mouseEnter(screen.getByRole("button", { name: "Hover point" }));
    fireEvent.mouseEnter(screen.getByRole("button", { name: "Leave point" }));
    act(() => vi.advanceTimersByTime(300));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("uses two-stage tapping on coarse pointers and allows the popup to close", () => {
    mocks.coarsePointer = true;
    render(<GlobeView lang="ja" pins={[pin]} />);

    const point = screen.getByRole("button", { name: "Click point" });
    fireEvent.click(point);
    const popup = screen.getByRole("dialog", { name: "作品情報" });
    expect(popup).toHaveTextContent("東京");
    expect(mocks.push).not.toHaveBeenCalled();

    expect(popup).toHaveClass("inset-x-4", "sm:w-[min(480px,calc(100%-2rem))]");
    fireEvent.click(screen.getByRole("button", { name: "閉じる" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(point);
    fireEvent.click(point);
    expect(mocks.push).toHaveBeenCalledWith("/ja/work/tokyo");
  });

  it("configures damped globe controls for restrained inertia", () => {
    render(<GlobeView lang="en" pins={[pin]} />);

    expect(mocks.controls).toMatchObject({
      enableDamping: true,
      dampingFactor: 0.08,
      rotateSpeed: 0.55,
      zoomSpeed: 0.8,
    });
  });

  it("prepares and passes 100 published work pins to the globe", () => {
    const pins = Array.from({ length: 100 }, (_, index): WorkPin => ({
      ...pin,
      id: `work-${index}`,
      slug: `work-${index}`,
      title_ja: `作品 ${index}`,
      title_en: `Work ${index}`,
      location: {
        ...pin.location,
        lat: -60 + (index % 60) * 2,
        lng: -170 + (index % 85) * 4,
      },
    }));

    render(<GlobeView lang="en" pins={pins} />);

    expect(screen.getByTestId("fake-globe")).toHaveAttribute("data-point-count", "100");
  });
});
