import Link from "next/link";

export default function NotFound() {
  return (
    <section className="rounded-2xl bg-[#f6f2ea] px-6 py-16 text-center text-[#0f1230] shadow-lg">
      <p className="text-sm font-semibold tracking-[0.2em] text-black/50">404</p>
      <h1 className="mt-3 text-3xl font-semibold">ページが見つかりません / Page not found</h1>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-black/65">
        お探しのページは移動または削除された可能性があります。The page may have been moved or removed.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-4">
        <Link href="/ja" className="rounded-full bg-[#0f1230] px-5 py-3 text-sm text-white">日本語トップへ</Link>
        <Link href="/en" className="rounded-full border border-[#0f1230] px-5 py-3 text-sm">English home</Link>
      </div>
    </section>
  );
}
