"use client";
import { site } from "@/lib/site";
import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";

const faqs = [
  {
    q: "Who is Murat Öncü?",
    a: "Murat Hüdavendigâr Öncü is a frontend-focused full-stack developer, co-founder of TemCraft Tech, and a frontend instructor, based in the Netherlands. He builds with React, Next.js, and TypeScript, and teaches modern web development to students across Europe.",
  },
  {
    q: "What does he build with?",
    a: "React, Next.js, and TypeScript on the frontend, with Django and .NET on the backend when products need it.",
  },
  {
    q: "Where is he based?",
    a: "The Netherlands, working remotely with teams and students across Europe.",
  },
] as const;

const About = () => {
  const [faqOpen, setFaqOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="relative flex flex-col items-center justify-start h-screen max-w-7xl px-6 md:px-10 mx-auto text-center md:text-left md:flex-row md:justify-evenly overflow-y-auto md:overflow-hidden">
      <h3 className="absolute top-16 md:top-24 uppercase tracking-[12px] md:tracking-[20px] text-gray-200 dark:text-gray-700 text-xl md:text-2xl">
        About
      </h3>

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        transition={{ duration: 1.2 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="mt-20 md:mt-0 flex-shrink-0">
        <Image
          src={site.profileImage}
          alt="Murat Hüdavendigâr Öncü at work"
          width={500}
          height={500}
          className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover md:rounded-lg md:h-80 md:w-80 lg:h-96 lg:w-96"
          loading="lazy"
        />
      </motion.div>

      <div className="mt-4 mb-8 md:mb-0 md:mt-0 space-y-3 md:space-y-6 px-0 md:px-10 max-w-xl w-full">
        <h4 className="text-2xl sm:text-3xl md:text-4xl font-semibold dark:text-gray-900">
          A Bit About Me
        </h4>
        <div className="space-y-2 md:space-y-4 text-xs sm:text-sm leading-relaxed">
          <p>
            I&apos;m Murat Hüdavendigâr Öncü — Computer Engineering graduate
            from Kocaeli University, co-founder of{" "}
            <a
              href="https://temcrafttech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#CA3E47] transition-colors">
              TemCraft Tech
            </a>
            , and a frontend instructor. I build with React and Next.js, with
            Django and .NET when products need it.
          </p>
          <p>
            Since early 2024 I&apos;ve taught frontend development while shipping
            products at TemCraft Tech — mentoring students through HTML, CSS,
            JavaScript, React, and Next.js, then applying the same craft in
            production.
          </p>
          <p>
            Based in the Netherlands and open to new opportunities. If you need
            a frontend engineer who can also teach, ship, and own product
            outcomes, let&apos;s talk.
          </p>
        </div>

        <div className="border-t border-white/10 dark:border-gray-400/40 pt-3 text-left">
          <button
            type="button"
            onClick={() => setFaqOpen((open) => !open)}
            aria-expanded={faqOpen}
            className="flex w-full items-center justify-between gap-3 text-sm font-semibold uppercase tracking-wider text-[#CA3E47] hover:opacity-80 transition-opacity">
            <span>Quick facts</span>
            <span
              aria-hidden="true"
              className={`text-lg leading-none transition-transform duration-200 ${
                faqOpen ? "rotate-45" : ""
              }`}>
              +
            </span>
          </button>

          <dl
            className={`space-y-3 text-sm overflow-hidden transition-[max-height,opacity,margin] duration-300 ${
              faqOpen ? "mt-3 max-h-[600px] opacity-100" : "mt-0 max-h-0 opacity-0"
            }`}>
            {faqs.map((item) => (
              <div key={item.q}>
                <dt className="font-semibold text-gray-100 dark:text-gray-900">
                  {item.q}
                </dt>
                <dd className="mt-1 text-gray-300 dark:text-gray-700">
                  {item.a}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </motion.div>
  );
};

export default About;
