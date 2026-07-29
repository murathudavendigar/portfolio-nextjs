"use client";
import emailjs from "@emailjs/browser";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
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

const Contact = () => {
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
      toast.success("Your message has been sent! Thank you.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative z-0 flex h-screen flex-col items-center justify-start overflow-y-auto px-4 py-20 md:justify-center md:overflow-hidden md:px-10">
      <h3 className="absolute top-16 uppercase tracking-[12px] text-gray-200 dark:text-gray-700 text-xl md:top-24 md:tracking-[20px] md:text-2xl">
        Contact
      </h3>

      <div className="mt-8 flex w-full max-w-xl flex-col items-center space-y-4 md:mt-0 md:space-y-8">
        <div className="space-y-2 md:space-y-4">
          <div className="flex items-center justify-center space-x-3 md:space-x-5">
            <MapPinIcon className="h-5 w-5 animate-pulse text-[#CA3E47] md:h-7 md:w-7" />
            <p className="text-base md:text-2xl">Netherlands</p>
          </div>
          <div className="flex items-center justify-center space-x-3 md:space-x-5">
            <EnvelopeIcon className="h-5 w-5 animate-pulse text-[#CA3E47] md:h-7 md:w-7" />
            <a
              href="mailto:contact@muratoncu.com"
              className="text-base transition-colors hover:text-[#CA3E47] md:text-2xl">
              contact@muratoncu.com
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 text-sm w-full">
          <div className="rounded-lg border border-white/10 dark:border-gray-300 p-3">
            <p className="font-semibold text-[#CA3E47]">Hiring?</p>
            <p className="text-gray-300 dark:text-gray-700">
              Frontend engineer based in the Netherlands, open to new roles.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 dark:border-gray-300 p-3">
            <p className="font-semibold text-[#CA3E47]">Need a freelance dev?</p>
            <p className="text-gray-300 dark:text-gray-700">
              Co-founder at TemCraft Tech — available for scoped React/Next.js work.
            </p>
          </div>
          <div className="rounded-lg border border-white/10 dark:border-gray-300 p-3">
            <p className="font-semibold text-[#CA3E47]">Want the code?</p>
            <p className="text-gray-300 dark:text-gray-700">
              Check the <a href="https://github.com/murathudavendigar" target="_blank" rel="noreferrer" className="underline">GitHub</a> or open-source npm packages.
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto flex w-full max-w-md flex-col space-y-2"
          noValidate>
          <div className="flex flex-col space-y-2 md:flex-row md:space-x-2 md:space-y-0">
            <div className="flex min-w-0 flex-1 flex-col">
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Name"
                className="contactInput w-full"
                type="text"
                autoComplete="name"
              />
              {errors.name && (
                <span className="mt-1 text-left text-xs text-[#CA3E47]">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <input
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
                <span className="mt-1 text-left text-xs text-[#CA3E47]">
                  {errors.email.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <input
              {...register("subject", { required: "Subject is required" })}
              placeholder="Subject"
              className="contactInput w-full"
              type="text"
            />
            {errors.subject && (
              <span className="mt-1 text-left text-xs text-[#CA3E47]">
                {errors.subject.message}
              </span>
            )}
          </div>

          <div className="flex flex-col">
            <textarea
              {...register("message", { required: "Message is required" })}
              placeholder="Message"
              className="contactInput w-full resize-none"
              rows={3}
            />
            {errors.message && (
              <span className="mt-1 text-left text-xs text-[#CA3E47]">
                {errors.message.message}
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={sending}
            className="rounded-md bg-[#CA3E47] px-4 py-3 text-base font-bold text-white transition-all duration-150 hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-[#414141]/90 md:px-10 md:py-5 md:text-lg">
            {sending ? "Sending…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
