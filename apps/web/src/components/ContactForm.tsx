"use client";

import { useCallback, useState } from "react";
import { TurnstileWidget } from "@/components/TurnstileWidget";
import { CONTACT_LIMITS, validateContactPayload, type ContactField } from "@/lib/contact";
import { getDictionary, type Lang } from "@/lib/i18n";

type Status = "idle" | "sending" | "sent" | "error";
type FieldErrors = Partial<Record<ContactField, string>>;

const FIELD_ORDER: ContactField[] = ["firstName", "lastName", "email", "phone", "message"];

function focusFirstInvalidField(form: HTMLFormElement, errors: FieldErrors) {
  const field = FIELD_ORDER.find((name) => errors[name]);
  if (!field) return;
  const element = form.elements.namedItem(field);
  if (element instanceof HTMLElement) element.focus();
}

export function ContactForm({ siteKey, lang }: { siteKey: string; lang: Lang }) {
  const [status, setStatus] = useState<Status>("idle");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetKey, setTurnstileResetKey] = useState(0);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);
  const copy = getDictionary(lang).contact;

  function errorMessage(field: ContactField) {
    const code = fieldErrors[field];
    return code ? copy.errors[code as keyof typeof copy.errors] ?? copy.errors.invalid : undefined;
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    const validation = validateContactPayload(payload);
    if (!validation.success) {
      setFieldErrors(validation.fields);
      setStatus("idle");
      focusFirstInvalidField(form, validation.fields);
      return;
    }

    setFieldErrors({});
    setStatus("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json().catch(() => null) as { fields?: FieldErrors } | null;
      if (!res.ok) {
        if (result?.fields && Object.keys(result.fields).length > 0) {
          setFieldErrors(result.fields);
          setStatus("idle");
          focusFirstInvalidField(form, result.fields);
          return;
        }
        throw new Error("request failed");
      }
      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    } finally {
      setTurnstileResetKey((value) => value + 1);
    }
  }

  return (
    <form onSubmit={onSubmit} className="relative mt-10" noValidate aria-busy={status === "sending"}>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="border border-[#2d3148]">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {([
            ["firstName", "text", "given-name", "sm:border-r"],
            ["lastName", "text", "family-name", ""],
            ["email", "email", "email", "sm:border-r"],
            ["phone", "tel", "tel", ""],
          ] as const).map(([name, type, autoComplete, responsiveBorder]) => {
            const error = errorMessage(name);
            return (
              <div key={name} className={`border-b border-[#2d3148] px-6 py-4 ${responsiveBorder}`}>
                <label htmlFor={`contact-${name}`} className="block text-xs font-semibold text-[#2b2f45]">
                  {copy.fields[name]}
                </label>
                <input
                  id={`contact-${name}`}
                  name={name}
                  type={type}
                  autoComplete={autoComplete}
                  placeholder={copy.placeholders[name]}
                  maxLength={CONTACT_LIMITS[name]}
                  required={name !== "phone"}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? `contact-${name}-error` : undefined}
                  className="mt-1 w-full text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-2 focus-visible:ring-[#2d3148]"
                />
                {error && <p id={`contact-${name}-error`} className="mt-1 text-xs text-red-700">{error}</p>}
              </div>
            );
          })}
        </div>
        <div className="px-6 py-4">
          <label htmlFor="contact-message" className="block text-xs font-semibold text-[#2b2f45]">{copy.fields.message}</label>
          <textarea
            id="contact-message"
            name="message"
            placeholder={copy.placeholders.message}
            maxLength={CONTACT_LIMITS.message}
            aria-invalid={Boolean(errorMessage("message"))}
            aria-describedby={errorMessage("message") ? "contact-message-error" : undefined}
            className="mt-1 h-48 w-full resize-y text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-2 focus-visible:ring-[#2d3148]"
            required
          />
          {errorMessage("message") && <p id="contact-message-error" className="mt-1 text-xs text-red-700">{errorMessage("message")}</p>}
        </div>
      </div>

      {siteKey ? (
        <div className="mt-6">
          <TurnstileWidget
            siteKey={siteKey}
            language={lang}
            resetKey={turnstileResetKey}
            onTokenChange={handleTurnstileToken}
          />
          <input type="hidden" name="turnstileToken" value={turnstileToken} />
        </div>
      ) : (
        <p className="mt-6 text-sm text-red-600" role="alert">
          {copy.verificationUnavailable}
        </p>
      )}

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={status === "sending" || !siteKey || !turnstileToken}
          className="h-14 w-48 bg-[#2b2f45] text-sm text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? copy.sending : copy.submit}
        </button>
      </div>

      <div className="mt-3 min-h-5" aria-live="polite" aria-atomic="true">
        {status === "sent" && <p className="text-sm text-[#2b2f45]" role="status">{copy.sent}</p>}
        {status === "error" && <p className="text-sm text-red-700" role="alert">{copy.failed}</p>}
      </div>
    </form>
  );
}
