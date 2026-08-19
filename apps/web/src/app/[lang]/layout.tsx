import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { lato } from "@/app/site-font";
import { HeaderTabs } from "@/components/HeaderTabs";
import { PreviewBanner } from "@/components/PreviewBanner";
import { isLang, LANGUAGES } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";
import "@/app/globals.css";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata({ lang: isLang(lang) ? lang : "ja" });
}

export function generateStaticParams() {
  return LANGUAGES.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html lang={lang}>
      <body className={`${lato.variable} bg-[#0f1230] text-[#f6f2ea] antialiased`}>
        <div className="min-h-screen" data-lang={lang}>
          <PreviewBanner lang={lang} />
          <HeaderTabs lang={lang} />
          <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:py-10">{children}</main>
        </div>
      </body>
    </html>
  );
}
