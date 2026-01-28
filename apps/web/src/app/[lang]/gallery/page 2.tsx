type Lang = "ja" | "en";

const COPY: Record<Lang, { title: string; description: string }> = {
  ja: {
    title: "Gallery",
    description: "作品一覧ページの枠組みだけ用意しました。カテゴリフィルタや検索は次フェーズで追加します。",
  },
  en: {
    title: "Gallery",
    description: "Scaffold for the gallery page is ready. Category filters and search come next.",
  },
};

export default function GalleryPage({ params }: { params: { lang: Lang } }) {
  const t = COPY[params.lang];

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-10 text-[#0f1230] shadow-lg">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1d2038]">{t.description}</p>
    </section>
  );
}
