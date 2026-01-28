type Lang = "ja" | "en";

export default function WorkDetailPage({
  params,
}: {
  params: { lang: Lang; slug: string };
}) {
  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-10 text-[#0f1230] shadow-lg">
      <h1 className="text-3xl font-semibold tracking-tight">Work: {params.slug}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1d2038]">
        作品詳細のブロック表示は次フェーズで実装します。CMSと連携し、テキストや画像グリッドをここに描画します。
      </p>
    </section>
  );
}
