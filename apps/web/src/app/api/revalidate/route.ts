import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { SANITY_CACHE_TAGS } from "@/lib/sanity.cache";

type SanityWebhookPayload = {
  _type: "work" | "designerProfile";
  slug?: string;
};

const MAX_WEBHOOK_BODY_LENGTH = 16 * 1024;

function parsePayload(rawBody: string): SanityWebhookPayload | null {
  try {
    const value: unknown = JSON.parse(rawBody);
    if (!value || typeof value !== "object" || Array.isArray(value)) return null;

    const payload = value as Record<string, unknown>;
    if (payload._type !== "work" && payload._type !== "designerProfile") return null;
    if (payload.slug !== undefined && typeof payload.slug !== "string") return null;

    const slug = typeof payload.slug === "string" ? payload.slug.trim() : undefined;
    return { _type: payload._type, slug: slug || undefined };
  } catch {
    return null;
  }
}

function revalidationTags(type: SanityWebhookPayload["_type"], slug?: string) {
  if (type === "designerProfile") return [SANITY_CACHE_TAGS.designerProfile];
  const tags: string[] = [
    SANITY_CACHE_TAGS.works,
    SANITY_CACHE_TAGS.pins,
    SANITY_CACHE_TAGS.gallery,
    SANITY_CACHE_TAGS.sitemap,
  ];

  if (slug) tags.push(SANITY_CACHE_TAGS.work(slug));
  return tags;
}

export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ revalidated: false, error: "Webhook is not configured" }, { status: 503 });
  }

  const declaredLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_WEBHOOK_BODY_LENGTH) {
    return Response.json({ revalidated: false, error: "Payload too large" }, { status: 413 });
  }

  const rawBody = await request.text();
  if (rawBody.length > MAX_WEBHOOK_BODY_LENGTH) {
    return Response.json({ revalidated: false, error: "Payload too large" }, { status: 413 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME) ?? "";
  if (!(await isValidSignature(rawBody, signature, secret))) {
    return Response.json({ revalidated: false, error: "Invalid signature" }, { status: 401 });
  }

  const payload = parsePayload(rawBody);
  if (!payload) {
    return Response.json({ revalidated: false, error: "Invalid payload" }, { status: 400 });
  }

  const tags = revalidationTags(payload._type, payload.slug);
  for (const tag of tags) {
    revalidateTag(tag, { expire: 0 });
  }

  return Response.json({ revalidated: true, tags });
}
