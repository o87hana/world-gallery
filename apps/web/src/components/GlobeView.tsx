"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Image } from "sanity";
import { AmbientLight, Color, DirectionalLight } from "three";
import { CategoryColor } from "@/lib/colors";
import { urlFor } from "@/lib/sanity.client";

const Globe = dynamic(
  async () => {
    if (typeof window === "undefined") return () => null;

    const hasWebGPU = typeof (window as any).GPUShaderStage !== "undefined";
    if (!hasWebGPU) {
      // Fallback renderer for browsers without WebGPU
      return function GlobeUnsupported() {
        return (
          <div className="flex h-full w-full items-center justify-center text-center text-[#0f1230]">
            <div>
              <p className="font-semibold">Globe view needs a WebGPU-capable browser.</p>
              <p className="mt-2 text-sm text-black/60">Try Chrome / Edge or update your browser.</p>
            </div>
          </div>
        );
      };
    }

    const mod = await import("react-globe.gl");
    return mod.default;
  },
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center text-[#0f1230]">Loading globe...</div>
    ),
  }
);

type Pin = {
  id: string;
  slug: string;
  category: string;
  title_ja: string;
  title_en?: string;
  location: { lat: number; lng: number; placeName_ja?: string; placeName_en?: string };
  coverImage: Image;
};

type GlobeDatum = Pin & {
  lat: number;
  lng: number;
  color: string;
  title: string;
  placeName?: string;
  coverUrl?: string;
};

export function GlobeView({ lang, pins }: { lang: "ja" | "en"; pins: Pin[] }) {
  const router = useRouter();
  const [hover, setHover] = useState<Pin | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lightsAddedRef = useRef(false);
  const hasWebGPU = typeof window !== "undefined" && typeof (window as any).GPUShaderStage !== "undefined";

  const data = useMemo(
    () =>
      pins.map((p): GlobeDatum => ({
        ...p,
        lat: p.location.lat,
        lng: p.location.lng,
        color: CategoryColor[p.category] ?? "#ffffff",
        title: lang === "ja" ? p.title_ja : p.title_en || "Coming soon",
        placeName: lang === "ja" ? p.location.placeName_ja : p.location.placeName_en,
        coverUrl: p.coverImage ? urlFor(p.coverImage).width(480).quality(70).url() : "",
      })),
    [pins, lang]
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const width = Math.max(0, Math.round(rect.width));
      const height = Math.max(0, Math.round(rect.height));

      setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));

      const renderer = globeRef.current?.renderer?.();
      if (renderer && width && height) {
        renderer.setSize(width, height);
      }

      const canvas = el.querySelector("canvas");
      if (canvas) {
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
      }
    };

    updateSize();

    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!hasWebGPU) return;
    let frameId = 0;

    const applyLighting = () => {
      const globe = globeRef.current;
      if (!globe) return false;

      const scene = globe.scene?.();
      if (scene && !lightsAddedRef.current) {
        const ambient = new AmbientLight(0xffffff, 1.6);
        ambient.name = "globe-ambient";
        const directional = new DirectionalLight(0xffffff, 1.2);
        directional.position.set(1, 1, 1);
        directional.name = "globe-directional";
        scene.add(ambient, directional);
        lightsAddedRef.current = true;
      }

      const material = globe.globeMaterial?.();
      if (!material) return false;

      material.color = new Color("#ffffff");
      material.emissive = new Color("#ffffff");
      material.emissiveMap = material.map ?? null;
      material.emissiveIntensity = 2.0;
      material.needsUpdate = true;
      return true;
    };

    const tick = () => {
      if (!applyLighting()) {
        frameId = window.requestAnimationFrame(tick);
      }
    };

    tick();
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
    };
  }, [hasWebGPU]);

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div ref={containerRef} className="relative h-full w-full overflow-hidden">
        <Globe
          {...(hasWebGPU ? { ref: globeRef } : {})}
          globeImageUrl="https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="https://unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          width={size.width || undefined}
          height={size.height || undefined}
          style={{ width: "100%", height: "100%", display: "block" }}
          // 操作感：慣性あり／滑りすぎない（中間寄せ）
          enablePointerInteraction={true}
          animateIn={true}
          // ピン（points）
          pointsData={data}
          pointLat={(d: GlobeDatum) => d.lat}
          pointLng={(d: GlobeDatum) => d.lng}
          pointColor={(d: GlobeDatum) => d.color}
          pointAltitude={0.01}
          pointRadius={0.45}
          onPointHover={(d: unknown) => setHover((d as GlobeDatum) ?? null)}
          onPointClick={(d: unknown) => router.push(`/${lang}/work/${(d as GlobeDatum).slug}`)}
        />

        {/* hoverカード */}
        {hover && (
          <div className="absolute left-4 bottom-4 w-[320px] rounded-2xl bg-white/95 shadow-xl p-4">
            {hover.coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={urlFor(hover.coverImage).width(640).quality(70).url()}
                alt=""
                className="h-40 w-full rounded-xl object-cover"
              />
            )}
            <div className="mt-3 text-sm text-black/60">{hover.category}</div>
            <div className="text-lg font-semibold">{lang === "ja" ? hover.title_ja : hover.title_en || "Coming soon"}</div>
            {((lang === "ja" ? hover.location.placeName_ja : hover.location.placeName_en) ?? "") && (
              <div className="text-sm text-black/70 mt-1">
                {lang === "ja" ? hover.location.placeName_ja : hover.location.placeName_en}
              </div>
            )}
            <button
              className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#0f1230] px-4 py-2 text-white text-sm"
              onClick={() => router.push(`/${lang}/work/${hover.slug}`)}
            >
              Open
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
