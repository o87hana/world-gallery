type Lang = "ja" | "en";

const COPY: Record<Lang, { title: string; description: string }> = {
  ja: {
    title: "Order / Contact",
    description: "フォームとメール送信処理は次のフェーズで実装します。先にルーティングとセクション構造だけ整えました。",
  },
  en: {
    title: "Order / Contact",
    description: "Form UI and mail handling will follow in the next phase. Routing and page shell are ready.",
  },
};

export default async function ContactPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = COPY[lang];

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-10 text-[#0f1230] shadow-lg">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1d2038]">{t.description}</p>
    </section>
  );
}
