import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  draftEnable: vi.fn(),
  getPreviewSanityClient: vi.fn(),
  validatePreviewUrl: vi.fn(),
  withoutSecretSearchParams: vi.fn(),
}));

vi.mock("next/headers", () => ({
  draftMode: vi.fn(async () => ({ enable: mocks.draftEnable })),
}));
vi.mock("@/lib/sanity.server", () => ({
  getPreviewSanityClient: mocks.getPreviewSanityClient,
}));
vi.mock("@sanity/preview-url-secret", () => ({
  validatePreviewUrl: mocks.validatePreviewUrl,
}));
vi.mock("@sanity/preview-url-secret/without-secret-search-params", () => ({
  withoutSecretSearchParams: mocks.withoutSecretSearchParams,
}));

import { GET } from "./route";

describe("Presentation Tool draft mode endpoint", () => {
  beforeEach(() => {
    vi.stubEnv("SANITY_API_READ_TOKEN", "viewer-token");
    mocks.draftEnable.mockReset();
    mocks.getPreviewSanityClient.mockReset();
    mocks.validatePreviewUrl.mockReset();
    mocks.withoutSecretSearchParams.mockReset();
    mocks.getPreviewSanityClient.mockReturnValue({ withConfig: vi.fn().mockReturnThis() });
    mocks.withoutSecretSearchParams.mockImplementation((url: URL) => {
      url.search = "";
      return url;
    });
  });

  it("rejects an invalid Presentation Tool secret", async () => {
    mocks.validatePreviewUrl.mockResolvedValue({ isValid: false });

    const response = await GET(new Request("https://example.com/api/draft-mode/enable"));

    expect(response.status).toBe(401);
    expect(mocks.draftEnable).not.toHaveBeenCalled();
  });

  it("enables Draft Mode and redirects to a safe localized path", async () => {
    const redirect = new URL("/en/work/sample?sanity-preview-secret=hidden", "https://example.com");
    mocks.validatePreviewUrl.mockResolvedValue({ isValid: true, redirectTo: redirect.toString() });

    const response = await GET(new Request("https://example.com/api/draft-mode/enable"));

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/en/work/sample");
    expect(mocks.draftEnable).toHaveBeenCalledOnce();
  });

  it("rejects a redirect outside the localized site routes", async () => {
    mocks.validatePreviewUrl.mockResolvedValue({ isValid: true, redirectTo: "https://example.com/admin" });

    const response = await GET(new Request("https://example.com/api/draft-mode/enable"));

    expect(response.status).toBe(400);
    expect(mocks.draftEnable).not.toHaveBeenCalled();
  });
});
