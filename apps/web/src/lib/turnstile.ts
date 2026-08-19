import { randomUUID } from "node:crypto";

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_ACTION = "contact";
export const TURNSTILE_TOKEN_MAX_LENGTH = 2_048;

export type TurnstileVerification = "valid" | "invalid" | "unavailable";

type SiteverifyResponse = {
  success?: boolean;
  action?: string;
};

export async function verifyTurnstileToken(
  token: string,
  secret: string,
  fetchImplementation: typeof fetch = fetch,
): Promise<TurnstileVerification> {
  if (!token || token.length > TURNSTILE_TOKEN_MAX_LENGTH) return "invalid";

  const body = new URLSearchParams({
    secret,
    response: token,
    idempotency_key: randomUUID(),
  });

  try {
    const response = await fetchImplementation(SITEVERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
      signal: AbortSignal.timeout(5_000),
    });
    if (!response.ok) return "unavailable";

    const result = await response.json() as SiteverifyResponse;
    return result.success === true && result.action === TURNSTILE_ACTION ? "valid" : "invalid";
  } catch {
    return "unavailable";
  }
}
