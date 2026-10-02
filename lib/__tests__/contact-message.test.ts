import { describe, expect, it } from "vitest";
import {
  contactEmailText,
  parseContactMessage,
  renderEmailTemplate,
  senderConfirmationText,
} from "../contact-message";

const valid = {
  name: "Ada Lovelace",
  email: "ada@example.com",
  subject: "A short note",
  message: "Hello from the form.",
};

describe("parseContactMessage", () => {
  it("accepts a trimmed contact payload", () => {
    expect(
      parseContactMessage({
        name: "  Ada Lovelace  ",
        email: " ada@example.com ",
        subject: " A short note ",
        message: " Hello from the form. ",
      }),
    ).toEqual(valid);
  });

  it("rejects a missing or invalid email", () => {
    expect(parseContactMessage({ ...valid, email: "not-an-email" })).toBeNull();
    expect(parseContactMessage({ ...valid, email: "" })).toBeNull();
  });

  it("rejects empty required fields and oversized text", () => {
    expect(parseContactMessage({ ...valid, name: "   " })).toBeNull();
    expect(parseContactMessage({ ...valid, subject: "" })).toBeNull();
    expect(parseContactMessage({ ...valid, message: "" })).toBeNull();
    expect(parseContactMessage({ ...valid, message: "x".repeat(5001) })).toBeNull();
    expect(parseContactMessage(null)).toBeNull();
  });
});

describe("contactEmailText", () => {
  it("includes the sender and the message body", () => {
    expect(contactEmailText(valid)).toBe(
      "Name: Ada Lovelace\nEmail: ada@example.com\n\nHello from the form.",
    );
  });
});

describe("senderConfirmationText", () => {
  it("uses the EmailJS auto-reply copy", () => {
    const text = senderConfirmationText(valid);
    expect(text).toContain("Hi Ada Lovelace,");
    expect(text).toContain("I got your message");
    expect(text).toContain("Subject: A short note");
    expect(text).toContain("Hello from the form.");
  });
});

describe("renderEmailTemplate", () => {
  it("fills the EmailJS placeholders and escapes HTML", () => {
    const html = renderEmailTemplate(
      "<p>Hi {{name}}</p><p>{{email}}</p><p>{{subject}}</p><p>{{message}}</p>",
      { ...valid, name: "Ada <script>" },
    );
    expect(html).toContain("Hi Ada &lt;script&gt;");
    expect(html).toContain("ada@example.com");
    expect(html).toContain("A short note");
    expect(html).toContain("Hello from the form.");
    expect(html).not.toContain("<script>");
  });
});
