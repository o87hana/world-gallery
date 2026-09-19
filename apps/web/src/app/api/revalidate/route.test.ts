import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  isValidSignature: vi.fn(),
  revalidateTag: vi.fn(),
}));

vi.mock("@sanity/webhook", () => ({
  isValidSignature: mocks.isValidSignature,
  SIGNATURE_HEADER_NAME: "sanity-webhook-signature",
}));
vi.mock("next/cache", () => ({ revalidateTag: mocks.revalidateTag }));

import { SANITY_CACHE_TAGS } from "@/lib/sanity.cache";
import { POST } from "./route";

function webhookRequest(body: string, signature = "signed-request") {
  return new Request("https://example.com/api/revalidate", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "sanity-webhook-signature": signature,
    },
    body,
  });
}

describe("Sanity revalidation webhook", () => {
  beforeEach(() => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "test-revalidation-secret");
    mocks.isValidSignature.mockReset();
    mocks.isValidSignature.mockResolvedValue(true);
    mocks.revalidateTag.mockReset();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns a service error when the webhook secret is unavailable", async () => {
    vi.stubEnv("SANITY_REVALIDATE_SECRET", "");

    const response = await POST(webhookRequest('{"_type":"work"}'));

    expect(response.status).toBe(503);
    expect(mocks.isValidSignature).not.toHaveBeenCalled();
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects an invalid Sanity signature", async () => {
    mocks.isValidSignature.mockResolvedValue(false);
    const rawBody = '{"_type":"work","slug":"my-work"}';

    const response = await POST(webhookRequest(rawBody, "invalid-signature"));

    expect(response.status).toBe(401);
    expect(mocks.isValidSignature).toHaveBeenCalledWith(
      rawBody,
      "invalid-signature",
      "test-revalidation-secret",
    );
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it.each([
    ["malformed JSON", "not-json"],
    ["unknown document type", '{"_type":"author"}'],
    ["invalid slug", '{"_type":"work","slug":42}'],
  ])("rejects a signed %s payload", async (_name, body) => {
    const response = await POST(webhookRequest(body));

    expect(response.status).toBe(400);
    expect(mocks.revalidateTag).not.toHaveBeenCalled();
  });

  it("immediately expires every work cache and the changed slug", async () => {
    const response = await POST(webhookRequest('{"_type":"work","slug":"my-work"}'));
    const body = await response.json();
    const tags = [
      SANITY_CACHE_TAGS.works,
      SANITY_CACHE_TAGS.pins,
      SANITY_CACHE_TAGS.gallery,
      SANITY_CACHE_TAGS.sitemap,
      SANITY_CACHE_TAGS.work("my-work"),
    ];

    expect(response.status).toBe(200);
    expect(body).toEqual({ revalidated: true, tags });
    expect(mocks.revalidateTag.mock.calls).toEqual(tags.map((tag) => [tag, { expire: 0 }]));
  });

  it("still expires all shared caches when a delete payload has no slug", async () => {
    const response = await POST(webhookRequest('{"_type":"work"}'));

    expect(response.status).toBe(200);
    expect(mocks.revalidateTag).toHaveBeenCalledTimes(4);
    expect(mocks.revalidateTag).not.toHaveBeenCalledWith(
      expect.stringMatching(/^sanity:work:/),
      expect.anything(),
    );
  });

  it("rejects oversized payloads before signature verification", async () => {
    const response = await POST(webhookRequest("x".repeat(16 * 1024 + 1)));

    expect(response.status).toBe(413);
    expect(mocks.isValidSignature).not.toHaveBeenCalled();
  });
});
