import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "./BackgroundCircles";

const HERO_HEADLINE =
  "Frontend engineer building web & mobile products.";

const Hero = () => {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-32">
      <div>
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Frontend Engineer · Netherlands
        </p>
        <h1 className="mt-4 text-4xl font-bold leading-[1.05] tracking-tight [text-wrap:balance] sm:text-5xl lg:text-6xl">
          {HERO_HEADLINE}
        </h1>
        <p className="mt-6 max-w-lg text-base leading-relaxed text-gray-300 [text-wrap:pretty] dark:text-gray-700 sm:text-lg">
          Murat Hüdavendigâr Öncü — co-founder of{" "}
          <a
            href="https://temcrafttech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47]"
          >
            TemCraft Tech
          </a>{" "}
          and a frontend instructor. I ship React, Next.js, TypeScript, and React
          Native products — and teach the same stack I build with.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/work" className="btn-primary">
            View my work
          </Link>
          <Link href="/contact" className="btn-secondary">
            Get in touch
          </Link>
        </div>

        <p className="mt-8 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
          React · Next.js · TypeScript · React Native
        </p>

        <p className="mt-3 font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
          Open to frontend roles (NL / EU / remote) · freelance · teaching
        </p>
      </div>

      <div className="relative mx-auto flex w-full max-w-xs items-center justify-center lg:max-w-none">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <BackgroundCircles />
        </div>
        <Image
          src={site.profileImage}
          alt="Murat Hüdavendigâr Öncü — frontend developer portrait"
          width={480}
          height={600}
          priority
          className="relative w-full max-w-[280px] rounded-2xl object-cover shadow-2xl shadow-black/40 lg:max-w-sm"
        />
      </div>
    </div>
  );
};

export default Hero;
