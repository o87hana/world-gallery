export const CONTACT_LIMITS = {
  requestBytes: 16_384,
  firstName: 80,
  lastName: 80,
  email: 254,
  phone: 40,
  message: 5_000,
} as const;

export type ContactPayload = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
};

export type ContactField = keyof ContactPayload;

type ContactValidationResult =
  | { success: true; data: ContactPayload }
  | { success: false; fields: Partial<Record<ContactField, string>> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const PHONE_PATTERN = /^[0-9+().\-\s]*$/u;
const SINGLE_LINE_CONTROL_PATTERN = /[\u0000-\u001f\u007f]/u;
const MULTILINE_CONTROL_PATTERN = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u;

function readString(value: unknown): string | null {
  return typeof value === "string" ? value.trim() : null;
}

export function validateContactPayload(value: unknown): ContactValidationResult {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return { success: false, fields: {} };
  }

  const input = value as Record<string, unknown>;
  const firstName = readString(input.firstName);
  const lastName = readString(input.lastName);
  const email = readString(input.email);
  const phone = readString(input.phone) ?? "";
  const message = readString(input.message);
  const fields: Partial<Record<ContactField, string>> = {};

  if (!firstName) fields.firstName = "required";
  else if (firstName.length > CONTACT_LIMITS.firstName) fields.firstName = "too_long";
  else if (SINGLE_LINE_CONTROL_PATTERN.test(firstName)) fields.firstName = "invalid";

  if (!lastName) fields.lastName = "required";
  else if (lastName.length > CONTACT_LIMITS.lastName) fields.lastName = "too_long";
  else if (SINGLE_LINE_CONTROL_PATTERN.test(lastName)) fields.lastName = "invalid";

  if (!email) fields.email = "required";
  else if (email.length > CONTACT_LIMITS.email) fields.email = "too_long";
  else if (SINGLE_LINE_CONTROL_PATTERN.test(email) || !EMAIL_PATTERN.test(email)) fields.email = "invalid";

  if (phone.length > CONTACT_LIMITS.phone) fields.phone = "too_long";
  else if (!PHONE_PATTERN.test(phone)) fields.phone = "invalid";

  if (!message) fields.message = "required";
  else if (message.length > CONTACT_LIMITS.message) fields.message = "too_long";
  else if (MULTILINE_CONTROL_PATTERN.test(message)) fields.message = "invalid";

  if (Object.keys(fields).length > 0 || !firstName || !lastName || !email || !message) {
    return { success: false, fields };
  }

  return {
    success: true,
    data: {
      firstName,
      lastName,
      email: email.toLowerCase(),
      phone,
      message,
    },
  };
}
