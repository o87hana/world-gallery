import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ draftMode: vi.fn() }));

vi.mock("next/headers", () => ({ draftMode: mocks.draftMode }));

import { PreviewBanner } from "./PreviewBanner";

describe("PreviewBanner", () => {
  it("is hidden outside draft mode", async () => {
    mocks.draftMode.mockResolvedValue({ isEnabled: false });

    const { container } = render(await PreviewBanner({ lang: "ja" }));

    expect(container).toBeEmptyDOMElement();
  });

  it("shows localized preview status and a POST exit form", async () => {
    mocks.draftMode.mockResolvedValue({ isEnabled: true });

    render(await PreviewBanner({ lang: "en" }));

    expect(screen.getByRole("status")).toHaveTextContent("Preview mode");
    expect(screen.getByRole("button", { name: "Exit preview" })).toBeInTheDocument();
    expect(screen.getByRole("button").closest("form")).toHaveAttribute(
      "action",
      "/api/exit-preview?lang=en",
    );
    expect(screen.getByRole("button").closest("form")).toHaveAttribute("method", "post");
  });
});
