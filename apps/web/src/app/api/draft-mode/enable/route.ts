import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { withoutSecretSearchParams } from "@sanity/preview-url-secret/without-secret-search-params";
import { draftMode } from "next/headers";
import { NextResponse } from "next/server";
import { getPreviewSanityClient } from "@/lib/sanity.server";

const ALLOWED_PREVIEW_PATH = /^\/(?:ja|en)(?:\/|$)/u;

export async function GET(request: Request) {
  const token = process.env.SANITY_API_READ_TOKEN;
  if (!token) return new Response("Preview is not configured", { status: 503 });

  let validation;
  try {
    validation = await validatePreviewUrl(
      getPreviewSanityClient().withConfig({ token, useCdn: false }),
      request.url,
    );
  } catch {
    return new Response("Preview is not configured", { status: 503 });
  }

  if (!validation.isValid) return new Response("Invalid preview secret", { status: 401 });

  const redirectTo = validation.redirectTo
    ? withoutSecretSearchParams(new URL(validation.redirectTo, request.url))
    : new URL("/ja", request.url);

  if (redirectTo.origin !== new URL(request.url).origin || !ALLOWED_PREVIEW_PATH.test(redirectTo.pathname)) {
    return new Response("Invalid preview path", { status: 400 });
  }

  const draft = await draftMode();
  draft.enable();
  return NextResponse.redirect(redirectTo);
}
