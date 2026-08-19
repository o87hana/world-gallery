import { describe, expect, it, vi } from "vitest";
import { TURNSTILE_TOKEN_MAX_LENGTH, verifyTurnstileToken } from "./turnstile";

function siteverifyResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("Turnstile verification", () => {
  it("accepts a successful contact-action token", async () => {
    const fetchMock = vi.fn().mockResolvedValue(siteverifyResponse({ success: true, action: "contact" }));

    const result = await verifyTurnstileToken("token", "secret", fetchMock);

    expect(result).toBe("valid");
    expect(fetchMock).toHaveBeenCalledWith(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      expect.objectContaining({ method: "POST", cache: "no-store" }),
    );
    const requestBody = fetchMock.mock.calls[0][1].body as URLSearchParams;
    expect(requestBody.get("secret")).toBe("secret");
    expect(requestBody.get("response")).toBe("token");
    expect(requestBody.get("idempotency_key")).toMatch(/^[0-9a-f-]{36}$/u);
  });

  it.each([
    [{ success: false, action: "contact" }, "invalid"],
    [{ success: true, action: "login" }, "invalid"],
  ] as const)("rejects an unsuccessful or wrong-action response", async (payload, expected) => {
    const fetchMock = vi.fn().mockResolvedValue(siteverifyResponse(payload));
    await expect(verifyTurnstileToken("token", "secret", fetchMock)).resolves.toBe(expected);
  });

  it("reports an unavailable verification service", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network error"));
    await expect(verifyTurnstileToken("token", "secret", fetchMock)).resolves.toBe("unavailable");
  });

  it("rejects missing and oversized tokens without a network request", async () => {
    const fetchMock = vi.fn();

    await expect(verifyTurnstileToken("", "secret", fetchMock)).resolves.toBe("invalid");
    await expect(
      verifyTurnstileToken("x".repeat(TURNSTILE_TOKEN_MAX_LENGTH + 1), "secret", fetchMock),
    ).resolves.toBe("invalid");
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
