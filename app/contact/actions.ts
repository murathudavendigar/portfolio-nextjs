"use server";

import {
  contactEmailText,
  parseContactMessage,
  renderEmailTemplate,
  senderConfirmationText,
} from "@/lib/contact-message";
import { site } from "@/lib/site";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { Resend } from "resend";

const notifyTemplate = readFileSync(
  join(process.cwd(), "emailjs/notify-me.html"),
  "utf8",
);
const autoReplyTemplate = readFileSync(
  join(process.cwd(), "emailjs/auto-reply.html"),
  "utf8",
);

export type SendContactResult = { ok: true } | { ok: false };

export async function sendContactMessage(
  input: unknown,
): Promise<SendContactResult> {
  const message = parseContactMessage(input);
  const apiKey = process.env.RESEND_API_KEY;
  if (!message || !apiKey) return { ok: false };

  const inbox = process.env.CONTACT_INBOX?.trim() || site.email;
  const from = `${site.shortName} <${site.email}>`;
  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from,
    to: [inbox],
    replyTo: message.email,
    subject: message.subject,
    html: renderEmailTemplate(notifyTemplate, message),
    text: contactEmailText(message),
  });
  if (error) return { ok: false };

  if (message.email.toLowerCase() === inbox.toLowerCase()) return { ok: true };

  const { error: confirmationError } = await resend.emails.send({
    from,
    to: [message.email],
    replyTo: site.email,
    subject: "Thanks for reaching out",
    html: renderEmailTemplate(autoReplyTemplate, message),
    text: senderConfirmationText(message),
  });

  return confirmationError ? { ok: false } : { ok: true };
}
