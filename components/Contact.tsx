"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SOCIAL_LINKS } from "@/lib/nav";
import { site } from "@/lib/site";
import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID ?? "";
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ?? "";
const TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID ?? "template_4mm0dyn";

const Contact = ({ resumeHref }: { resumeHref?: string | null }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (PUBLIC_KEY) {
      emailjs.init({ publicKey: PUBLIC_KEY });
    }
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!SERVICE_ID || !PUBLIC_KEY) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    setSending(true);
    try {
      await emailjs.send(SERVICE_ID, TEMPLATE_ID, {
        name: data.name,
        from_name: data.name,
        email: data.email,
        from_email: data.email,
        reply_to: data.email,
        subject: data.subject,
        message: data.message,
      });
      reset();
      toast.success("Sent. I will get back to you.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Contact
      </p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl dark:text-gray-900">
        Write if you want to hire, ship, or teach.
      </h1>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-8">
          <p className="max-w-md text-base leading-relaxed text-gray-300 dark:text-gray-700">
            Frontend roles in the Netherlands or remote, scoped React / Next.js
            work through TemCraft Tech, and teaching. No pitch deck — just say
            what you need.
          </p>

          <dl className="space-y-4">
            <div>
              <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.email}`}
                  className="text-lg hover:text-[var(--accent-text)] transition-colors">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Location
              </dt>
              <dd className="mt-1 text-lg">Netherlands</dd>
            </div>
            {resumeHref ? (
              <div>
                <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                  Résumé
                </dt>
                <dd className="mt-1">
                  <a
                    href={resumeHref}
                    download
                    className="text-lg hover:text-[var(--accent-text)] transition-colors">
                    Download PDF
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Social
              </dt>
              <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent-text)] transition-colors">
                    {social.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup className="[&_[aria-invalid=true]]:border-destructive">
            <div className="grid gap-7 sm:grid-cols-2">
              <Field data-invalid={errors.name ? true : undefined}>
                <FieldLabel htmlFor="contact-name">Name</FieldLabel>
                <Input
                  id="contact-name"
                  type="text"
                  autoComplete="name"
                  placeholder="Ada Lovelace"
                  aria-invalid={errors.name ? true : undefined}
                  aria-describedby={
                    errors.name ? "contact-name-error" : undefined
                  }
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name && (
                  <FieldError id="contact-name-error">
                    {errors.name.message}
                  </FieldError>
                )}
              </Field>

              <Field data-invalid={errors.email ? true : undefined}>
                <FieldLabel htmlFor="contact-email">Email</FieldLabel>
                <Input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={errors.email ? true : undefined}
                  aria-describedby={
                    errors.email ? "contact-email-error" : undefined
                  }
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter a valid email",
                    },
                  })}
                />
                {errors.email && (
                  <FieldError id="contact-email-error">
                    {errors.email.message}
                  </FieldError>
                )}
              </Field>
            </div>

            <Field data-invalid={errors.subject ? true : undefined}>
              <FieldLabel htmlFor="contact-subject">Subject</FieldLabel>
              <Input
                id="contact-subject"
                type="text"
                placeholder="What this is about"
                aria-invalid={errors.subject ? true : undefined}
                aria-describedby={
                  errors.subject ? "contact-subject-error" : undefined
                }
                {...register("subject", { required: "Subject is required" })}
              />
              {errors.subject && (
                <FieldError id="contact-subject-error">
                  {errors.subject.message}
                </FieldError>
              )}
            </Field>

            <Field data-invalid={errors.message ? true : undefined}>
              <FieldLabel htmlFor="contact-message">Message</FieldLabel>
              <Textarea
                id="contact-message"
                rows={6}
                placeholder="What do you need?"
                className="resize-none"
                aria-invalid={errors.message ? true : undefined}
                aria-describedby={
                  errors.message ? "contact-message-error" : undefined
                }
                {...register("message", { required: "Message is required" })}
              />
              {errors.message && (
                <FieldError id="contact-message-error">
                  {errors.message.message}
                </FieldError>
              )}
            </Field>

            <Field>
              <Button
                type="submit"
                size="lg"
                disabled={sending}
                className="w-full rounded-full uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background">
                {sending ? "Sending…" : "Send message"}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </div>
    </section>
  );
};

export default Contact;
