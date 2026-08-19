import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { ContactForm } from "./ContactForm";

vi.mock("./TurnstileWidget", () => ({
  TurnstileWidget: ({ onTokenChange }: { onTokenChange: (token: string) => void }) => (
    <button type="button" onClick={() => onTokenChange("verified-token")}>Verify</button>
  ),
}));

function fillValidForm() {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Hana" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Murakami" } });
  fireEvent.change(screen.getByLabelText("Email address"), { target: { value: "hana@example.com" } });
  fireEvent.change(screen.getByLabelText("Message"), { target: { value: "Hello" } });
  fireEvent.click(screen.getByRole("button", { name: "Verify" }));
}

describe("ContactForm", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("exposes English labels, autocomplete attributes, limits, and required state", () => {
    const { container } = render(<ContactForm siteKey="test-site-key" lang="en" />);

    expect(screen.getByLabelText("First name")).toHaveAttribute("autocomplete", "given-name");
    expect(screen.getByLabelText("Last name")).toHaveAttribute("autocomplete", "family-name");
    expect(screen.getByLabelText("Email address")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Phone (optional)")).toHaveAttribute("autocomplete", "tel");
    expect(screen.getByLabelText("Message")).toHaveAttribute("maxlength", "5000");
    expect(screen.getByLabelText("First name")).toBeRequired();
    expect(screen.getByLabelText("Phone (optional)")).not.toBeRequired();
    expect(container.querySelector('input[name="website"]')).toHaveAttribute("tabindex", "-1");
    expect(container.querySelector('input[name="turnstileToken"]')).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeDisabled();
  });

  it("renders Japanese copy", () => {
    render(<ContactForm siteKey="" lang="ja" />);

    expect(screen.getByLabelText("名")).toBeRequired();
    expect(screen.getByLabelText("姓")).toBeRequired();
    expect(screen.getByLabelText("電話番号（任意）")).not.toBeRequired();
    expect(screen.getByRole("alert")).toHaveTextContent("現在、送信確認機能を利用できません。");
    expect(screen.getByRole("button", { name: "送信する" })).toBeDisabled();
  });

  it("shows field errors and focuses the first invalid field", () => {
    render(<ContactForm siteKey="test-site-key" lang="en" />);
    fireEvent.click(screen.getByRole("button", { name: "Verify" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(screen.getAllByText("This field is required.")).toHaveLength(4);
    expect(screen.getByLabelText("First name")).toHaveFocus();
    expect(screen.getByLabelText("First name")).toHaveAttribute("aria-invalid", "true");
  });

  it("announces the sending and success states", async () => {
    let resolveRequest: ((response: Response) => void) | undefined;
    vi.stubGlobal("fetch", vi.fn(() => new Promise<Response>((resolve) => {
      resolveRequest = resolve;
    })));
    render(<ContactForm siteKey="test-site-key" lang="en" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(screen.getByRole("button", { name: "Sending…" })).toBeDisabled();
    resolveRequest?.(new Response(JSON.stringify({ ok: true }), { status: 200 }));

    expect(await screen.findByRole("status")).toHaveTextContent("Sent. Thank you for your message.");
  });

  it("uses API field errors and announces non-validation failures", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ fields: { email: "invalid" } }), { status: 400 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ error: "email_delivery_failed" }), { status: 502 }));
    vi.stubGlobal("fetch", fetchMock);
    render(<ContactForm siteKey="test-site-key" lang="en" />);
    fillValidForm();

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    expect(await screen.findByText("Check this value and try again.")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Verify" }));
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));
    await waitFor(() => expect(screen.getByRole("alert")).toHaveTextContent("Your message could not be sent."));
  });
});
