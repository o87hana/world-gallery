import { describe, expect, it } from "vitest";
import { CONTACT_LIMITS, validateContactPayload } from "./contact";

const validPayload = {
  firstName: " Hana ",
  lastName: " Murakami ",
  email: " HANA@EXAMPLE.COM ",
  phone: "+61 (0) 400-123-456",
  message: " Hello.\nI would like to discuss a project. ",
};

describe("contact payload validation", () => {
  it("normalizes a valid payload", () => {
    expect(validateContactPayload(validPayload)).toEqual({
      success: true,
      data: {
        firstName: "Hana",
        lastName: "Murakami",
        email: "hana@example.com",
        phone: "+61 (0) 400-123-456",
        message: "Hello.\nI would like to discuss a project.",
      },
    });
  });

  it.each([
    ["non-object input", [], undefined],
    ["missing first name", { ...validPayload, firstName: "" }, "firstName"],
    ["non-string last name", { ...validPayload, lastName: ["Murakami"] }, "lastName"],
    ["invalid email", { ...validPayload, email: "not-an-email" }, "email"],
    ["invalid phone", { ...validPayload, phone: "call me" }, "phone"],
    ["control character", { ...validPayload, message: "hello\u0000world" }, "message"],
    ["long message", { ...validPayload, message: "x".repeat(CONTACT_LIMITS.message + 1) }, "message"],
  ])("rejects %s", (_name, payload, field) => {
    const result = validateContactPayload(payload);

    expect(result.success).toBe(false);
    if (!result.success && field) expect(result.fields).toHaveProperty(field);
  });
});
