"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import type { GlobeMethods } from "react-globe.gl";
import { AmbientLight, Color, DirectionalLight, type MeshPhongMaterial } from "three";
import { createGlobeData, supportsWebGL, type GlobeDatum } from "@/lib/globe";
import type { WorkPin } from "@/lib/work";

const Globe = dynamic(
  async () => {
    if (typeof window === "undefined") return () => null;

    if (!supportsWebGL()) {
      return function GlobeUnsupported() {
        return (
          <div className="flex h-full w-full items-center justify-center text-center text-[#0f1230]">
            <div>
              <p className="font-semibold">Globe view needs a WebGL-capable browser.</p>
              <p className="mt-2 text-sm text-black/60">Enable hardware acceleration or update your browser.</p>
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

type HoverState = {
  primary: GlobeDatum;
  items: GlobeDatum[];
};

type GlobeHandle = GlobeMethods & {
  globeMaterial(): MeshPhongMaterial;
};

const EARTH_RADIUS_KM = 6371;
const POPUP_RANGE_KM = 100;
const HOVER_DELAY_MS = 300;
const COARSE_POINTER_QUERY = "(hover: none), (pointer: coarse)";
const toRad = (deg: number) => (deg * Math.PI) / 180;
const distanceKm = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
};

const subscribeToCoarsePointer = (callback: () => void) => {
  const mediaQuery = window.matchMedia(COARSE_POINTER_QUERY);
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
};

const getCoarsePointerSnapshot = () => window.matchMedia(COARSE_POINTER_QUERY).matches;
const getServerCoarsePointerSnapshot = () => false;

export function GlobeView({ lang, pins }: { lang: "ja" | "en"; pins: WorkPin[] }) {
  const router = useRouter();
  const [hover, setHover] = useState<HoverState | null>(null);
  const [selected, setSelected] = useState<HoverState | null>(null);
  const isCoarsePointer = useSyncExternalStore(
    subscribeToCoarsePointer,
    getCoarsePointerSnapshot,
    getServerCoarsePointerSnapshot,
  );
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<GlobeHandle | undefined>(undefined);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const lightsAddedRef = useRef(false);
  const data = useMemo(() => createGlobeData(pins, lang), [pins, lang]);

  const clearHoverTimer = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const nearbyMap = useMemo(() => {
    const getDateScore = (value?: string) => {
      if (!value) return 0;
      const time = new Date(value).getTime();
      return Number.isFinite(time) ? time : 0;
    };
    const map = new Map<string, GlobeDatum[]>();
    for (let i = 0; i < data.length; i += 1) {
      const base = data[i];
      const group: GlobeDatum[] = [];
      for (let j = 0; j < data.length; j += 1) {
        const candidate = data[j];
        if (distanceKm(base, candidate) <= POPUP_RANGE_KM) {
          group.push(candidate);
        }
      }
      const uniqueById = new Map<string, GlobeDatum>();
      for (const item of group) {
        if (!uniqueById.has(item.id)) {
          uniqueById.set(item.id, item);
        }
      }
      const sorted = Array.from(uniqueById.values()).sort(
        (a, b) => getDateScore(b.date) - getDateScore(a.date)
      );
      map.set(base.id, sorted);
    }
    return map;
  }, [data]);

  useEffect(() => () => clearHoverTimer(), []);

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
    if (!supportsWebGL()) return;
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

      const controls = globe.controls?.();
      if (controls) {
        controls.enableDamping = true;
        controls.dampingFactor = 0.08;
        controls.rotateSpeed = 0.55;
        controls.zoomSpeed = 0.8;
      }

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
  }, []);

  const popup = selected ?? hover;

  if (data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center px-6 text-center text-[#f6f2ea]" role="status">
        <div>
          <p className="font-semibold">{lang === "ja" ? "表示できる作品がありません" : "No works are available"}</p>
          <p className="mt-2 text-sm text-white/70">
            {lang === "ja" ? "公開作品が追加されると、ここに表示されます。" : "Published works will appear here."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div ref={containerRef} className="relative h-full w-full overflow-hidden">
        <Globe
          ref={globeRef}
          globeImageUrl="/textures/earth-blue-marble.jpg"
          bumpImageUrl="/textures/earth-topology.png"
          backgroundColor="rgba(0,0,0,0)"
          width={size.width || undefined}
          height={size.height || undefined}
          // 操作感：慣性あり／滑りすぎない（中間寄せ）
          enablePointerInteraction={true}
          animateIn={true}
          // ピン（points）
          pointsData={data}
          pointLat={(d) => (d as GlobeDatum).lat}
          pointLng={(d) => (d as GlobeDatum).lng}
          pointColor={(d) => (d as GlobeDatum).color}
          pointAltitude={0.01}
          pointRadius={0.75}
          onPointHover={(d: unknown) => {
            if (isCoarsePointer || selected) return;
            clearHoverTimer();
            const datum = d as GlobeDatum | null;
            if (!datum) {
              setHover(null);
              return;
            }
            hoverTimerRef.current = setTimeout(() => {
              const items = nearbyMap.get(datum.id) ?? [datum];
              setHover({ primary: datum, items });
              hoverTimerRef.current = null;
            }, HOVER_DELAY_MS);
          }}
          onPointClick={(d: unknown) => {
            const datum = d as GlobeDatum;
            clearHoverTimer();
            setHover(null);

            if (!isCoarsePointer || selected?.primary.id === datum.id) {
              router.push(`/${lang}/work/${datum.slug}`);
              return;
            }

            const items = nearbyMap.get(datum.id) ?? [datum];
            setSelected({ primary: datum, items });
          }}
        />

        {/* hoverカード */}
        {popup && (
          <div
            className="absolute inset-x-4 bottom-4 max-h-[calc(100%-2rem)] overflow-auto rounded-2xl bg-white/95 p-4 shadow-xl sm:right-auto sm:w-[min(480px,calc(100%-2rem))] sm:p-6"
            role={selected ? "dialog" : "status"}
            aria-label={selected ? (lang === "ja" ? "作品情報" : "Work details") : undefined}
          >
            {selected && (
              <button
                className="absolute right-3 top-3 rounded-sm text-[1.35rem] leading-none text-black/50 hover:text-black"
                onClick={() => {
                  clearHoverTimer();
                  setSelected(null);
                  setHover(null);
                }}
                aria-label={lang === "ja" ? "閉じる" : "Close"}
              >
                ×
              </button>
            )}
            {popup.items.length === 1 ? (
              <>
                {popup.primary.coverUrl && (
                  <div className="relative h-40 w-full overflow-hidden rounded-xl">
                    <Image
                      src={popup.primary.coverUrl}
                      alt=""
                      fill
                      sizes="(max-width: 639px) calc(100vw - 4rem), 432px"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="mt-3 text-sm text-black/60">{popup.primary.category}</div>
                <div className="text-lg font-semibold">{popup.primary.title}</div>
                {popup.primary.placeName ? (
                  <div className="mt-1 text-sm text-black/70">{popup.primary.placeName}</div>
                ) : null}
              <button
                className="mt-3 inline-flex items-center justify-center rounded-xl bg-[#0f1230] px-4 py-2 text-sm text-white"
                onClick={() => router.push(`/${lang}/work/${popup.primary.slug}`)}
              >
                {lang === "ja" ? "作品を見る" : "Open work"}
              </button>
              </>
            ) : (
              <div className="space-y-3">
                {popup.items.map((item) => (
                  <button
                    key={item.id}
                    className="w-full rounded-xl border border-black/10 px-3 py-2 text-left text-sm hover:bg-black/5"
                    onClick={() => router.push(`/${lang}/work/${item.slug}`)}
                  >
                    {item.coverUrl ? (
                      <span className="relative block h-40 w-full overflow-hidden rounded-xl">
                        <Image
                          src={item.coverUrl}
                          alt=""
                          fill
                          sizes="(max-width: 639px) calc(100vw - 4rem), 432px"
                          className="object-cover"
                        />
                      </span>
                    ) : null}
                    <div className={item.coverUrl ? "mt-2 font-medium text-black/80" : "font-medium text-black/80"}>
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
