"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ lang?: string }>();
  const isJapanese = params.lang === "ja";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="rounded-2xl bg-[#f6f2ea] px-6 py-16 text-center text-[#0f1230] shadow-lg" role="alert">
      <h1 className="text-2xl font-semibold">{isJapanese ? "ページを読み込めませんでした" : "This page could not be loaded"}</h1>
      <p className="mt-3 text-sm text-black/65">
        {isJapanese ? "時間をおいて、もう一度お試しください。" : "Please wait a moment and try again."}
      </p>
      <button type="button" onClick={reset} className="mt-6 rounded-lg bg-[#0f1230] px-5 py-3 text-sm text-white">
        {isJapanese ? "再読み込み" : "Try again"}
      </button>
    </section>
  );
}
