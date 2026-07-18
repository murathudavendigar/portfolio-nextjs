"use client";
import { motion } from "framer-motion";
import Image from "next/image";

const faqs = [
  {
    q: "Who is Murat Öncü?",
    a: "A frontend-focused full-stack developer, co-founder of TemCraft Tech, and instructor based in the Netherlands.",
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
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
      className="flex flex-col relative min-h-screen py-24 text-center md:text-left md:flex-row max-w-7xl px-10 justify-evenly mx-auto items-center overflow-y-auto">
      <h3 className="absolute top-24 uppercase tracking-[20px] text-gray-200 dark:text-gray-700 text-2xl ">
        About
      </h3>
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        transition={{ duration: 1.2 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className="-mb-20 md:mb-0 flex-shrink-0">
        <Image
          src="/img/MHO.jpg"
          alt="Murat Hüdavendigâr Öncü at work"
          width={500}
          height={500}
          className="w-48 h-48 rounded-full object-cover md:rounded-lg md:h-96 md:w-96 2xl:w-[500px] 2xl:h-[500px]"
          loading="lazy"
        />
      </motion.div>

      <div className="space-y-6 px-0 md:px-10 max-w-xl">
        <h4 className="text-4xl font-semibold dark:text-gray-900">
          A Bit About Me
        </h4>
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            I&apos;m Murat Hüdavendigâr Öncü — a Computer Engineering graduate
            from Kocaeli University, co-founder of{" "}
            <a
              href="https://temcrafttech.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#CA3E47] transition-colors">
              TemCraft Tech
            </a>
            , and a frontend instructor. I build polished web products with a
            strong React and Next.js focus, backed by earlier full-stack work in
            Django and .NET.
          </p>
          <p>
            Since early 2024 I&apos;ve taught frontend development while shipping
            products at TemCraft Tech — mentoring students through HTML, CSS,
            JavaScript, React, and Next.js, then applying the same craft in
            production. I care about fast interfaces, clear architecture, and
            tools that help other developers learn faster.
          </p>
          <p>
            Based in the Netherlands and open to new opportunities. If you need
            a frontend engineer who can also teach, ship, and own product
            outcomes, let&apos;s talk.
          </p>
        </div>

        <dl className="space-y-3 text-left text-sm border-t border-white/10 dark:border-gray-400/40 pt-4">
          {faqs.map((item) => (
            <div key={item.q}>
              <dt className="font-semibold text-[#CA3E47]">{item.q}</dt>
              <dd className="mt-1 text-gray-200 dark:text-gray-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </div>
    </motion.div>
  );
};

export default About;
