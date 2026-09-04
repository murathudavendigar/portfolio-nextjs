"use client";
import { SOCIAL_LINKS } from "@/lib/nav";
import { site } from "@/lib/site";
import emailjs from "@emailjs/browser";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

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
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[#CA3E47]">
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
                  className="text-lg hover:text-[#CA3E47] transition-colors">
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
                    className="text-lg hover:text-[#CA3E47] transition-colors">
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
                    className="hover:text-[#CA3E47] transition-colors">
                    {social.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
          noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex min-w-0 flex-col">
              <label htmlFor="contact-name" className="sr-only">
                Name
              </label>
              <input
                id="contact-name"
                {...register("name", { required: "Name is required" })}
                placeholder="Name"
                className="contactInput w-full"
                type="text"
                autoComplete="name"
              />
              {errors.name && (
                <span className="mt-1 text-xs text-[#CA3E47]">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-col">
              <label htmlFor="contact-email" className="sr-only">
                Email
              </label>
              <input
                id="contact-email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Email"
                className="contactInput w-full"
                type="email"
                autoComplete="email"
              />
              {errors.email && (
                <span className="mt-1 text-xs text-[#CA3E47]">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="contact-subject" className="sr-only">
              Subject
            </label>
            <input
              id="contact-subject"
              {...register("subject", { required: "Subject is required" })}
              placeholder="Subject"
              className="contactInput w-full"
              type="text"
            />
            {errors.subject && (
              <span className="mt-1 text-xs text-[#CA3E47]">
                {errors.subject.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <label htmlFor="contact-message" className="sr-only">
              Message
            </label>
            <textarea
              id="contact-message"
              {...register("message", { required: "Message is required" })}
              placeholder="What do you need?"
              className="contactInput w-full resize-none"
              rows={6}
            />
            {errors.message && (
              <span className="mt-1 text-xs text-[#CA3E47]">
                {errors.message.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="rounded-full bg-[#CA3E47] px-6 py-3 text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "Sending…" : "Send message"}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;
