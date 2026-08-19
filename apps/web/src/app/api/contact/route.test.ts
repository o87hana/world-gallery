import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ send: vi.fn(), verifyTurnstileToken: vi.fn() }));

vi.mock("resend", () => ({
  Resend: class ResendMock {
    emails = { send: mocks.send };
  },
}));

vi.mock("@/lib/turnstile", async (importOriginal) => {
  const original = await importOriginal<typeof import("@/lib/turnstile")>();
  return { ...original, verifyTurnstileToken: mocks.verifyTurnstileToken };
});

import { POST } from "./route";

const validPayload = {
  firstName: "Hana",
  lastName: "Murakami",
  email: "hana@example.com",
  phone: "+61 400 123 456",
  message: "I would like to discuss a project.",
  website: "",
  turnstileToken: "valid-turnstile-token",
};

function request(payload: unknown, headers?: HeadersInit) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  });
}

describe("contact route", () => {
  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_TO_EMAIL", "owner@example.com");
    vi.stubEnv("CONTACT_FROM_EMAIL", "World Gallery <contact@example.com>");
    vi.stubEnv("TURNSTILE_SECRET_KEY", "turnstile-secret");
    mocks.send.mockReset();
    mocks.verifyTurnstileToken.mockReset();
    mocks.send.mockResolvedValue({ data: { id: "email-id" }, error: null });
    mocks.verifyTurnstileToken.mockResolvedValue("valid");
  });

  afterEach(() => vi.unstubAllEnvs());

  it("returns 503 without initializing Resend when email configuration is incomplete", async () => {
    vi.stubEnv("RESEND_API_KEY", "");

    const response = await POST(request(validPayload));

    expect(response.status).toBe(503);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("rejects unsupported content types and malformed JSON", async () => {
    const unsupported = await POST(request(validPayload, { "content-type": "text/plain" }));
    const malformed = await POST(request("{"));

    expect(unsupported.status).toBe(415);
    expect(malformed.status).toBe(400);
    await expect(malformed.json()).resolves.toEqual({ error: "invalid_json" });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("returns field errors for invalid input", async () => {
    const response = await POST(request({ ...validPayload, email: "invalid", message: "" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "validation_failed",
      fields: { email: "invalid", message: "required" },
    });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("rejects oversized bodies", async () => {
    const response = await POST(request({ ...validPayload, message: "x".repeat(17_000) }));

    expect(response.status).toBe(413);
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("silently accepts honeypot submissions without verification or email", async () => {
    const response = await POST(request({ ...validPayload, website: "https://spam.example" }));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("requires a Turnstile token", async () => {
    const response = await POST(request({ ...validPayload, turnstileToken: "" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "turnstile_required" });
    expect(mocks.verifyTurnstileToken).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid", 400, "turnstile_failed"],
    ["unavailable", 502, "verification_unavailable"],
  ] as const)("rejects a %s Turnstile verification", async (result, status, error) => {
    mocks.verifyTurnstileToken.mockResolvedValue(result);

    const response = await POST(request(validPayload));

    expect(response.status).toBe(status);
    await expect(response.json()).resolves.toEqual({ error });
    expect(mocks.send).not.toHaveBeenCalled();
  });

  it("blocks replay when Cloudflare rejects a previously used token", async () => {
    mocks.verifyTurnstileToken.mockResolvedValueOnce("valid").mockResolvedValueOnce("invalid");

    const firstResponse = await POST(request(validPayload));
    const replayResponse = await POST(request(validPayload));

    expect(firstResponse.status).toBe(200);
    expect(replayResponse.status).toBe(400);
    expect(mocks.send).toHaveBeenCalledOnce();
  });

  it("sends normalized email data with a deterministic idempotency key", async () => {
    const response = await POST(request({ ...validPayload, email: " HANA@EXAMPLE.COM " }));
    const secondResponse = await POST(request({
      ...validPayload,
      email: " HANA@EXAMPLE.COM ",
      turnstileToken: "another-valid-token",
    }));

    expect(response.status).toBe(200);
    expect(secondResponse.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
    expect(mocks.send).toHaveBeenCalledTimes(2);
    expect(mocks.send.mock.calls[0][0]).toMatchObject({
      from: "World Gallery <contact@example.com>",
      to: "owner@example.com",
      subject: "World Gallery Contact: Hana Murakami",
      replyTo: "hana@example.com",
    });
    expect(mocks.send.mock.calls[0][1].idempotencyKey).toMatch(/^world-gallery-contact\/[a-f0-9]{64}$/u);
    expect(mocks.send.mock.calls[1][1]).toEqual(mocks.send.mock.calls[0][1]);
    expect(mocks.verifyTurnstileToken).toHaveBeenCalledWith("valid-turnstile-token", "turnstile-secret");
  });

  it("does not report success when Resend returns an error", async () => {
    mocks.send.mockResolvedValue({ data: null, error: { message: "provider rejected request" } });

    const response = await POST(request(validPayload));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "email_delivery_failed" });
  });

  it("returns 502 when the provider request throws", async () => {
    mocks.send.mockRejectedValue(new Error("network unavailable"));

    const response = await POST(request(validPayload));

    expect(response.status).toBe(502);
    await expect(response.json()).resolves.toEqual({ error: "email_delivery_failed" });
  });
});
