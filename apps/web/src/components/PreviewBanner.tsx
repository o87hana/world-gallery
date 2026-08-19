import { draftMode } from "next/headers";
import type { Lang } from "@/lib/i18n";

const COPY = {
  ja: { status: "プレビューモード中", exit: "プレビューを終了" },
  en: { status: "Preview mode", exit: "Exit preview" },
} as const;

export async function PreviewBanner({ lang }: { lang: Lang }) {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  const copy = COPY[lang];

  return (
    <aside
      role="status"
      className="flex items-center justify-center gap-4 bg-[#F6C445] px-4 py-2 text-sm font-semibold text-[#0f1230]"
    >
      <span>{copy.status}</span>
      <form action={`/api/exit-preview?lang=${lang}`} method="post">
        <button type="submit" className="rounded-md border border-current px-3 py-1 hover:bg-black/10 focus-visible:outline-[#0f1230]">
          {copy.exit}
        </button>
      </form>
    </aside>
  );
}
