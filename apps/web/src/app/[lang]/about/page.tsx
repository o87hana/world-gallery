type Lang = "ja" | "en";

const COPY: Record<Lang, { title: string; description: string }> = {
  ja: {
    title: "Designer / Team",
    description: "プロフィールページの枠を用意しました。自己紹介や経歴カード、連絡導線を後続で配置します。",
  },
  en: {
    title: "Designer / Team",
    description: "Placeholder for the profile page. Bio, experience, and contact cues will be added next.",
  },
};

export default async function AboutPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = COPY[lang];

  return (
    <section className="rounded-2xl bg-[#f6f2ea] p-10 text-[#0f1230] shadow-lg">
      <h1 className="text-3xl font-semibold tracking-tight">{t.title}</h1>
      <p className="mt-3 max-w-2xl text-base leading-relaxed text-[#1d2038]">{t.description}</p>
    </section>
  );
}
