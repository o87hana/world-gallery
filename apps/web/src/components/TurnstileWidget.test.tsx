import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TurnstileWidget } from "./TurnstileWidget";

vi.mock("next/script", () => ({
  default: ({ onReady }: { onReady: () => void }) => <button onClick={onReady}>Load Turnstile</button>,
}));

const turnstile = {
  render: vi.fn(),
  remove: vi.fn(),
  reset: vi.fn(),
};

describe("TurnstileWidget", () => {
  beforeEach(() => {
    turnstile.render.mockReset();
    turnstile.remove.mockReset();
    turnstile.reset.mockReset();
    turnstile.render.mockReturnValue("widget-id");
    window.turnstile = turnstile;
  });

  afterEach(() => {
    delete window.turnstile;
  });

  it("renders the contact challenge and reports token lifecycle changes", () => {
    const onTokenChange = vi.fn();
    const { rerender, unmount } = render(
      <TurnstileWidget siteKey="site-key" language="ja" resetKey={0} onTokenChange={onTokenChange} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Load Turnstile" }));
    expect(turnstile.render).toHaveBeenCalledWith(expect.any(HTMLElement), expect.objectContaining({
      sitekey: "site-key",
      action: "contact",
      language: "ja",
      size: "flexible",
    }));

    const options = turnstile.render.mock.calls[0][1];
    act(() => options.callback("verified-token"));
    expect(onTokenChange).toHaveBeenCalledWith("verified-token");

    rerender(<TurnstileWidget siteKey="site-key" language="ja" resetKey={1} onTokenChange={onTokenChange} />);
    expect(turnstile.reset).toHaveBeenCalledWith("widget-id");
    expect(onTokenChange).toHaveBeenCalledWith("");

    unmount();
    expect(turnstile.remove).toHaveBeenCalledWith("widget-id");
  });
});
