import PortraitTilt from "@/components/PortraitTilt";
import Skyline from "@/components/home/Skyline";
import { getLiveProjects } from "@/lib/projects";
import { site, temcraftUrl } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";

/**
 * First screen: the name at poster size, one statement, two actions, the
 * portrait, and the live products as a Daily Skyline row. Motion lives in
 * styles/globals.css (home-*); everything here is painted on first frame.
 */
export default function HomeHero() {
  const live = getLiveProjects();

  return (
    <section className="mx-auto max-w-6xl px-6 pb-20 pt-14 md:px-10 md:pb-28 md:pt-20">
      <h1 className="text-[clamp(3.5rem,13vw,10.5rem)] font-extrabold leading-[0.9] tracking-[-0.045em] text-white dark:text-gray-900">
        <span className="home-line">
          <span>{site.shortName}</span>
        </span>
      </h1>

      <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[minmax(0,1.25fr)_minmax(0,0.75fr)] md:items-end md:gap-14">
        <div>
          <p
            style={{ ["--i" as string]: 0 }}
            className="home-fade max-w-xl text-[clamp(1.5rem,3vw,2.25rem)] font-semibold leading-[1.15] tracking-tight [text-wrap:balance] text-white dark:text-gray-900">
            I build products people actually use, on the web and in the app
            stores.
          </p>
          <p
            style={{ ["--i" as string]: 1 }}
            className="home-fade mt-5 max-w-lg text-lg leading-relaxed [text-wrap:pretty] text-gray-200 dark:text-gray-800">
            Frontend engineer in the Netherlands and co-founder of{" "}
            <a
              href={temcraftUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47] dark:decoration-gray-400">
              TemCraft Tech
            </a>
            . React, Next.js, TypeScript and React Native.
          </p>
          <div
            style={{ ["--i" as string]: 2 }}
            className="home-fade mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <Link href="/work" className="home-button">
              See the work
            </Link>
            <Link
              href="/contact"
              className="text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47] dark:text-gray-900 dark:decoration-gray-400">
              Hire me
            </Link>
          </div>
          <Skyline projects={live} />
        </div>

        <PortraitTilt>
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[18rem] overflow-hidden rounded-lg bg-inkDeep md:ml-auto md:mr-0 md:max-w-[22rem] dark:bg-paperDeep">
            <Image
              src={site.profileImage}
              alt={`${site.name}, frontend engineer`}
              fill
              priority
              fetchPriority="high"
              sizes="(min-width: 768px) 352px, 288px"
              quality={75}
              className="home-portrait object-cover"
            />
            {/* One sweep of the accent over the portrait on arrival. */}
            <span
              aria-hidden
              className="home-scan pointer-events-none absolute inset-x-0 top-0 h-full opacity-0">
              <span className="absolute inset-x-0 bottom-0 h-[3px] bg-[#CA3E47]" />
              <span className="absolute inset-x-0 bottom-[3px] h-16 bg-[#CA3E47]/15" />
            </span>
          </div>
        </PortraitTilt>
      </div>
    </section>
  );
}
