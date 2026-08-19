import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { getDictionary, type Lang } from "@/lib/i18n";
import { createPageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  return createPageMetadata({
    lang,
    path: "/contact",
    title: lang === "ja" ? "お問い合わせ" : "Contact",
    description: lang === "ja" ? "村上花へのお問い合わせはこちらからお送りください。" : "Contact Hana Murakami about her work and practice.",
  });
}

export default async function ContactPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const dictionary = getDictionary(lang);

  return (
    <section className="-mx-4 bg-[#f6f2ea] px-2 py-10 text-[#0f1230] shadow-lg sm:mx-0 sm:rounded-2xl sm:px-12 sm:py-12">
      <div className="mx-auto max-w-3xl rounded-xl bg-white px-0 py-8 shadow-md sm:rounded-2xl sm:px-12 sm:py-12">
        <h1 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">{dictionary.contact.title}</h1>
        <ContactForm siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? ""} lang={lang} />
      </div>
    </section>
  );
}
