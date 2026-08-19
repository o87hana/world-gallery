import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { CONTACT_LIMITS, validateContactPayload, type ContactPayload } from "@/lib/contact";
import { TURNSTILE_TOKEN_MAX_LENGTH, verifyTurnstileToken } from "@/lib/turnstile";

function createIdempotencyKey(payload: ContactPayload): string {
  const digest = createHash("sha256").update(JSON.stringify(payload)).digest("hex");
  return `world-gallery-contact/${digest}`;
}

export async function POST(req: Request) {
  if (!req.headers.get("content-type")?.toLowerCase().startsWith("application/json")) {
    return NextResponse.json({ error: "unsupported_media_type" }, { status: 415 });
  }

  const contentLength = Number(req.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > CONTACT_LIMITS.requestBytes) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let rawBody: string;
  try {
    rawBody = await req.text();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  if (new TextEncoder().encode(rawBody).byteLength > CONTACT_LIMITS.requestBytes) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return NextResponse.json({ error: "validation_failed", fields: {} }, { status: 400 });
  }

  const antiSpamInput = body as Record<string, unknown>;
  const honeypot = antiSpamInput.website;
  if ((typeof honeypot === "string" && honeypot.trim()) || (honeypot !== undefined && typeof honeypot !== "string")) {
    return NextResponse.json({ ok: true });
  }

  const turnstileToken = antiSpamInput.turnstileToken;
  if (
    typeof turnstileToken !== "string" ||
    !turnstileToken ||
    turnstileToken.length > TURNSTILE_TOKEN_MAX_LENGTH
  ) {
    return NextResponse.json({ error: "turnstile_required" }, { status: 400 });
  }

  const validation = validateContactPayload(body);
  if (!validation.success) {
    return NextResponse.json({ error: "validation_failed", fields: validation.fields }, { status: 400 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (!turnstileSecret) {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }

  const turnstileVerification = await verifyTurnstileToken(turnstileToken, turnstileSecret);
  if (turnstileVerification === "unavailable") {
    return NextResponse.json({ error: "verification_unavailable" }, { status: 502 });
  }
  if (turnstileVerification === "invalid") {
    return NextResponse.json({ error: "turnstile_failed" }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !toEmail || !fromEmail) {
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }

  const { firstName, lastName, email, phone, message } = validation.data;
  const resend = new Resend(apiKey);

  try {
    const result = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      subject: `World Gallery Contact: ${firstName} ${lastName}`,
      replyTo: email,
      text: [`Name: ${firstName} ${lastName}`, `Email: ${email}`, `Phone: ${phone}`, "", message].join("\n"),
    }, {
      idempotencyKey: createIdempotencyKey(validation.data),
    });

    if (result.error) {
      return NextResponse.json({ error: "email_delivery_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "email_delivery_failed" }, { status: 502 });
  }
}
