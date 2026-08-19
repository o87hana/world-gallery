import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { parsePreviewLanguage } from "@/lib/preview";

export async function POST(request: Request) {
  const lang = parsePreviewLanguage(new URL(request.url).searchParams.get("lang")) ?? "ja";
  const draft = await draftMode();
  draft.disable();

  return NextResponse.redirect(new URL(`/${lang}`, request.url));
}
