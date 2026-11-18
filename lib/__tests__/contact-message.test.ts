import { describe, expect, it } from "vitest";
import {
  contactEmailText,
  parseContactMessage,
  renderEmailTemplate,
  senderConfirmationText,
} from "../contact-message";
import { AUTO_REPLY_HTML } from "../email-templates";

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
  it("confirms receipt without echoing anything the sender typed", () => {
    const text = senderConfirmationText();
    expect(text).toContain("I got your message");
    expect(text).not.toContain("Ada");
    expect(text).not.toContain("A short note");
    expect(text).not.toContain("Hello from the form.");
  });
});

describe("AUTO_REPLY_HTML", () => {
  it("has no placeholders for sender input", () => {
    const html = renderEmailTemplate(AUTO_REPLY_HTML, valid);
    expect(html).toContain("I got your message");
    expect(html).not.toContain("Ada");
    expect(html).not.toContain("A short note");
    expect(html).not.toContain("Hello from the form.");
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
