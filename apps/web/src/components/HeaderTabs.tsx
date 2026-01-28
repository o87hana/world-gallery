"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const T = {
  ja: { travel: "Travel", gallery: "Gallery", about: "Designer/Team", contact: "Order/Contact" },
  en: { travel: "Travel", gallery: "Gallery", about: "Designer/Team", contact: "Order/Contact" },
} as const;

export function HeaderTabs({ lang }: { lang: "ja" | "en" }) {
  const pathname = usePathname();
  const currentLang: "ja" | "en" = lang === "en" ? "en" : "ja";
  const t = T[currentLang];

  const tabs = [
    { href: `/${currentLang}`, label: t.travel },
    { href: `/${currentLang}/gallery`, label: t.gallery },
    { href: `/${currentLang}/about`, label: t.about },
    { href: `/${currentLang}/contact`, label: t.contact },
  ];

  return (
    <header className="bg-[#0f1230]">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-6">
        <Link href={`/${lang}`} className="text-white tracking-wide">
          HANA MURAKAMI
        </Link>
        <nav className="flex gap-8">
          {tabs.map((x) => {
            const active = pathname === x.href;
            return (
              <Link
                key={x.href}
                href={x.href}
                className={`text-sm ${active ? "text-white" : "text-white/60"} hover:text-white`}
              >
                {x.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex gap-3 text-sm">
          <Link className="text-white/70 hover:text-white" href={pathname.replace(/^\/(ja|en)/, "/ja")}>
            JA
          </Link>
          <Link className="text-white/70 hover:text-white" href={pathname.replace(/^\/(ja|en)/, "/en")}>
            EN
          </Link>
        </div>
      </div>
    </header>
  );
}
