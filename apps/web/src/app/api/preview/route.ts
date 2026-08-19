import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { PREVIEW_WORK_BY_SLUG_QUERY } from "@/lib/queries";
import { parsePreviewLanguage, parsePreviewSlug, previewPath } from "@/lib/preview";
import { getPreviewSanityClient } from "@/lib/sanity.server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const configuredSecret = process.env.PREVIEW_SECRET;
  const suppliedSecret = searchParams.get("secret");

  if (!configuredSecret) {
    return new Response("Preview is not configured", { status: 503 });
  }

  if (!suppliedSecret || suppliedSecret !== configuredSecret) {
    return new Response("Invalid secret", { status: 401 });
  }

  const lang = parsePreviewLanguage(searchParams.get("lang"));
  const slug = parsePreviewSlug(searchParams.get("slug"));

  if (!lang || !slug) {
    return new Response("Invalid language or slug", { status: 400 });
  }

  let previewClient;
  try {
    previewClient = getPreviewSanityClient();
  } catch {
    return new Response("Preview is not configured", { status: 503 });
  }

  const work = await previewClient.fetch<{ id: string } | null>(PREVIEW_WORK_BY_SLUG_QUERY, {
    slug,
  });

  if (!work) {
    return new Response("Work not found", { status: 404 });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(new URL(previewPath(lang, slug), request.url));
}
