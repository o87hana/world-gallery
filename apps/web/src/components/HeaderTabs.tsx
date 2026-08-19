"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDictionary, switchPathLanguage, type Lang } from "@/lib/i18n";

export function HeaderTabs({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const dictionary = getDictionary(lang);
  const t = dictionary.navigation;

  const tabs = [
    { href: `/${lang}`, label: t.travel },
    { href: `/${lang}/gallery`, label: t.gallery },
    { href: `/${lang}/about`, label: t.about },
    { href: `/${lang}/contact`, label: t.contact },
  ];

  return (
    <header className="bg-[#0f1230]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-4 px-4 py-6 sm:flex-nowrap">
        <Link href={`/${lang}`} className="rounded-sm text-white tracking-wide focus-visible:outline-white">
          HANA MURAKAMI
        </Link>
        <nav
          className="order-3 flex w-full gap-5 overflow-x-auto pb-1 sm:order-none sm:w-auto sm:gap-8 sm:overflow-visible sm:pb-0"
          aria-label={lang === "ja" ? "メインナビゲーション" : "Main navigation"}
        >
          {tabs.map((x) => {
            const active = pathname === x.href;
            return (
              <Link
                key={x.href}
                href={x.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 rounded-sm text-sm focus-visible:outline-white ${active ? "text-white" : "text-white/60"} hover:text-white`}
              >
                {x.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-3 text-sm" aria-label={dictionary.languageSwitcher} role="group">
          <Link className="rounded-sm text-white/70 hover:text-white focus-visible:outline-white" href={switchPathLanguage(pathname, "ja")} hrefLang="ja" aria-current={lang === "ja" ? "page" : undefined}>
            JA
          </Link>
          <Link className="rounded-sm text-white/70 hover:text-white focus-visible:outline-white" href={switchPathLanguage(pathname, "en")} hrefLang="en" aria-current={lang === "en" ? "page" : undefined}>
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
