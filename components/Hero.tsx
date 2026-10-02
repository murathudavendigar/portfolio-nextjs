import { site } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import BackgroundCircles from "./BackgroundCircles";

const Hero = () => {
  return (
    <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 sm:py-24 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16 lg:py-28">
      <div>
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          Frontend engineer · Netherlands
        </p>
        <h1 className="mt-4 text-5xl font-bold leading-[0.98] tracking-tight [text-wrap:balance] sm:text-6xl lg:text-7xl dark:text-gray-900">
          {site.shortName}
        </h1>
        <p className="mt-5 max-w-md text-xl font-semibold leading-snug tracking-tight [text-wrap:balance] text-gray-200 dark:text-gray-800 sm:text-2xl">
          Building web &amp; mobile products — and teaching the same craft.
        </p>
        <p className="mt-5 max-w-lg text-base leading-relaxed text-gray-300 [text-wrap:pretty] dark:text-gray-700">
          Co-founder of{" "}
          <a
            href="https://temcrafttech.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47]">
            TemCraft Tech
          </a>
          . React, Next.js, TypeScript, and React Native — shipped on the App
          Store, npm, and the web.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-4">
          <Link href="/work" className="btn-primary">
            View my work
          </Link>
          <Link href="/hire" className="btn-secondary">
            Hire / work with me
          </Link>
        </div>
      </div>

      {/* overflow-hidden clips decorative rings so they cannot expand scrollWidth */}
      <div className="relative mx-auto flex w-full max-w-xs items-center justify-center overflow-hidden lg:max-w-none">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <BackgroundCircles />
        </div>
        <Image
          src={site.profileImage}
          alt={`${site.name} — frontend engineer portrait`}
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
