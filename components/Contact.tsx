"use client";
import emailjs from "@emailjs/browser";
import { EnvelopeIcon, MapPinIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
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

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!SERVICE_ID || !PUBLIC_KEY) {
      toast.error("Something went wrong. Please try again.");
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: data.name,
          from_name: data.name,
          email: data.email,
          from_email: data.email,
          reply_to: data.email,
          subject: data.subject,
          message: data.message,
        },
        { publicKey: PUBLIC_KEY },
      );
      reset();
      toast.success("Your message has been sent! Thank you.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="h-screen relative flex flex-col text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 dark:text-gray-700 text-2xl ">
        Contact
      </h3>
      <div className="flex flex-col xl:flex-row xl:items-center xl:gap-10 2xl:flex-col space-y-3 md:space-y-8 ">
        <h4 className="text-2xl hidden 3xl:text-white 2xl:inline-block md:text-4xl font-semibold text-center">
          Contact Me
        </h4>

        <div className="space-y-2 md:space-y-10">
          <div className="flex items-center space-x-5 justify-center">
            <MapPinIcon className="text-[#CA3E47] h-7 w-7 animate-pulse" />
            <p className="text-xl md:text-2xl">Netherlands</p>
          </div>

          <div className="flex items-center space-x-5 justify-center">
            <EnvelopeIcon className="text-[#CA3E47] h-7 w-7 animate-pulse" />
            <a
              href="mailto:contact@muratoncu.com"
              className="text-xl md:text-2xl hover:text-[#CA3E47] transition-colors">
              contact@muratoncu.com
            </a>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2 w-fit mx-auto"
          noValidate>
          <div className="flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0">
            <div className="flex flex-col">
              <input
                {...register("name", { required: "Name is required" })}
                placeholder="Name"
                className="contactInput"
                type="text"
                autoComplete="name"
              />
              {errors.name && (
                <span className="mt-1 text-left text-xs text-[#CA3E47]">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                placeholder="Email"
                className="contactInput"
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
              className="contactInput"
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
              className="contactInput resize-none"
              rows={4}
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
            className="bg-[#CA3E47] dark:bg-[#414141]/90 py-2 px-4 md:py-5 md:px-10 rounded-md text-white font-bold text-md md:text-lg hover:opacity-70 transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50">
            {sending ? "Sending…" : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
