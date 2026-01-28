import type { ReactNode } from "react";
import { HeaderTabs } from "@/components/HeaderTabs";

type Lang = "ja" | "en";

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: Lang }>;
}) {
  const { lang } = await params;
  const currentLang: Lang = lang === "en" ? "en" : "ja";
  return (
    <div className="min-h-screen" data-lang={currentLang}>
      <HeaderTabs lang={currentLang} />
      <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
    </div>
  );
}
