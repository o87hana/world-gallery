"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "sending") return;

    setStatus("sending");
    const formData = new FormData(event.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("request failed");
      event.currentTarget.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-10">
      <div className="border border-[#2d3148]">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          <input
            name="firstName"
            placeholder="First Name"
            className="border-b border-[#2d3148] px-6 py-5 text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-1 focus-visible:ring-[#2d3148] sm:border-r"
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            className="border-b border-[#2d3148] px-6 py-5 text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-1 focus-visible:ring-[#2d3148]"
            required
          />
          <input
            name="email"
            placeholder="Email"
            className="border-b border-[#2d3148] px-6 py-5 text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-1 focus-visible:ring-[#2d3148] sm:border-r"
            type="email"
            required
          />
          <input
            name="phone"
            placeholder="Phone"
            className="border-b border-[#2d3148] px-6 py-5 text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-1 focus-visible:ring-[#2d3148]"
          />
        </div>
        <textarea
          name="message"
          placeholder="Type your message here..."
          className="h-56 w-full px-6 py-5 text-sm text-[#2b2f45] outline-none placeholder:text-[#8b8ea5] focus-visible:ring-1 focus-visible:ring-[#2d3148]"
          required
        />
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={status === "sending"}
          className="h-14 w-48 bg-[#2b2f45] text-sm text-white/80 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-70"
        >
          {status === "sending" ? "Sending..." : "Submit"}
        </button>
      </div>

      {status === "sent" && <p className="mt-3 text-sm text-[#2b2f45]">Sent. Thank you!</p>}
      {status === "error" && <p className="mt-3 text-sm text-red-600">Failed. Please try again.</p>}
    </form>
  );
}
