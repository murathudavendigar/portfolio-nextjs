export type ContactMessage = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const LIMITS = {
  name: 80,
  email: 254,
  subject: 140,
  message: 5000,
} as const;

function trimmedString(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export function parseContactMessage(input: unknown): ContactMessage | null {
  if (!input || typeof input !== "object") return null;

  const data = input as Record<string, unknown>;
  const name = trimmedString(data.name);
  const email = trimmedString(data.email);
  const subject = trimmedString(data.subject);
  const message = trimmedString(data.message);

  if (name.length < 1 || name.length > LIMITS.name) return null;
  if (!EMAIL.test(email) || email.length > LIMITS.email) return null;
  if (subject.length < 1 || subject.length > LIMITS.subject) return null;
  if (message.length < 1 || message.length > LIMITS.message) return null;

  return { name, email, subject, message };
}

export function contactEmailText(message: ContactMessage): string {
  return [`Name: ${message.name}`, `Email: ${message.email}`, "", message.message].join(
    "\n",
  );
}

export function senderConfirmationText(message: ContactMessage): string {
  return [
    `Hi ${message.name},`,
    "",
    "I got your message and will get back to you soon. In the meantime, feel free to browse my work or reply to this email if you want to add anything.",
    "",
    "Your message",
    `Subject: ${message.subject}`,
    "",
    message.message,
    "",
    "Murat Hüdavendigâr Öncü",
    "Frontend engineer · Netherlands",
    "contact@muratoncu.com",
    "https://www.muratoncu.com/",
  ].join("\n");
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function renderEmailTemplate(html: string, message: ContactMessage): string {
  const values: Record<string, string> = {
    name: escapeHtml(message.name),
    email: escapeHtml(message.email),
    subject: escapeHtml(message.subject),
    message: escapeHtml(message.message),
  };

  return html.replace(
    /\{\{(name|email|subject|message)\}\}/g,
    (_, key: string) => values[key] ?? "",
  );
}
