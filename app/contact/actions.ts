"use server";

import {
  contactEmailText,
  parseContactMessage,
  renderEmailTemplate,
  senderConfirmationText,
} from "@/lib/contact-message";
import { AUTO_REPLY_HTML, NOTIFY_ME_HTML } from "@/lib/email-templates";
import { site } from "@/lib/site";
import { Resend } from "resend";

export type SendContactResult = { ok: true } | { ok: false };

export async function sendContactMessage(
  input: unknown,
): Promise<SendContactResult> {
  try {
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
      html: renderEmailTemplate(NOTIFY_ME_HTML, message),
      text: contactEmailText(message),
    });
    if (error) {
      console.error("[contact] notify failed", error);
      return { ok: false };
    }

    if (message.email.toLowerCase() === inbox.toLowerCase()) {
      return { ok: true };
    }

    const { error: confirmationError } = await resend.emails.send({
      from,
      to: [message.email],
      replyTo: site.email,
      subject: "Thanks for reaching out",
      html: renderEmailTemplate(AUTO_REPLY_HTML, message),
      text: senderConfirmationText(message),
    });

    if (confirmationError) {
      console.error("[contact] auto-reply failed", confirmationError);
      return { ok: false };
    }

    return { ok: true };
  } catch (error) {
    console.error("[contact] unexpected failure", error);
    return { ok: false };
  }
}
