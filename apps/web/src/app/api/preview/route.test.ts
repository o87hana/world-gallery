import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  disable: vi.fn(),
  enable: vi.fn(),
  fetch: vi.fn(),
  getPreviewSanityClient: vi.fn(),
  draftMode: vi.fn(),
}));

vi.mock("next/headers", () => ({ draftMode: mocks.draftMode }));
vi.mock("@/lib/sanity.server", () => ({
  getPreviewSanityClient: mocks.getPreviewSanityClient,
}));

import { POST as exitPreview } from "@/app/api/exit-preview/route";
import { GET as enterPreview } from "./route";

describe("preview mode routes", () => {
  beforeEach(() => {
    vi.stubEnv("PREVIEW_SECRET", "test-preview-secret");
    mocks.fetch.mockReset();
    mocks.enable.mockReset();
    mocks.disable.mockReset();
    mocks.getPreviewSanityClient.mockReset();
    mocks.draftMode.mockReset();
    mocks.getPreviewSanityClient.mockReturnValue({ fetch: mocks.fetch });
    mocks.draftMode.mockResolvedValue({
      disable: mocks.disable,
      enable: mocks.enable,
      isEnabled: false,
    });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects an invalid secret without querying Sanity or enabling draft mode", async () => {
    const response = await enterPreview(
      new Request("https://example.com/api/preview?secret=wrong&lang=ja&slug=hidden-work"),
    );

    expect(response.status).toBe(401);
    expect(mocks.getPreviewSanityClient).not.toHaveBeenCalled();
    expect(mocks.enable).not.toHaveBeenCalled();
  });

  it.each([
    ["invalid language", "lang=fr&slug=hidden-work"],
    ["missing slug", "lang=ja"],
    ["unsafe slug", "lang=ja&slug=https%3A%2F%2Fevil.example"],
  ])("rejects %s", async (_name, params) => {
    const response = await enterPreview(
      new Request(`https://example.com/api/preview?secret=test-preview-secret&${params}`),
    );

    expect(response.status).toBe(400);
    expect(mocks.enable).not.toHaveBeenCalled();
  });

  it("does not enable preview for an unknown work", async () => {
    mocks.fetch.mockResolvedValue(null);

    const response = await enterPreview(
      new Request(
        "https://example.com/api/preview?secret=test-preview-secret&lang=en&slug=missing-work",
      ),
    );

    expect(response.status).toBe(404);
    expect(mocks.enable).not.toHaveBeenCalled();
  });

  it("enables preview and redirects to the validated localized work path", async () => {
    mocks.fetch.mockResolvedValue({ id: "drafts.hidden-work" });

    const response = await enterPreview(
      new Request(
        "https://example.com/api/preview?secret=test-preview-secret&lang=en&slug=hidden-work",
      ),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/en/work/hidden-work");
    expect(mocks.fetch).toHaveBeenCalledWith(expect.any(String), { slug: "hidden-work" });
    expect(mocks.enable).toHaveBeenCalledOnce();
  });

  it("returns a service error when the preview token is unavailable", async () => {
    mocks.getPreviewSanityClient.mockImplementation(() => {
      throw new Error("missing token");
    });

    const response = await enterPreview(
      new Request(
        "https://example.com/api/preview?secret=test-preview-secret&lang=ja&slug=hidden-work",
      ),
    );

    expect(response.status).toBe(503);
    expect(mocks.enable).not.toHaveBeenCalled();
  });

  it("disables preview and redirects to the selected language home", async () => {
    const response = await exitPreview(
      new Request("https://example.com/api/exit-preview?lang=en", { method: "POST" }),
    );

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://example.com/en");
    expect(mocks.disable).toHaveBeenCalledOnce();
  });
});
