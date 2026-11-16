"use client";

import Reveal from "@/components/Reveal";
import WorkCover from "@/components/WorkCover";
import type { AppRating } from "@/lib/appStore";
import { navigateWithViewTransition } from "@/lib/navigate-with-view-transition";
import type { Projects as ProjectType } from "@/types";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type MouseEvent } from "react";

type LedgerProject = {
  project: ProjectType;
  rating?: AppRating;
  weeklyDownloads?: number | null;
};

/** The rating line, when the store has ratings. */
function meta({ rating }: LedgerProject): string | null {
  if (rating && rating.count > 0) {
    return `${rating.average.toFixed(1)} from ${rating.count} rating${rating.count === 1 ? "" : "s"}`;
  }
  return null;
}

/**
 * Featured products as a ledger: one row per product, and the selected
 * row's screenshot large beside it. Hover or focus picks the row on desktop;
 * on a phone every row carries its own picture.
 */
export default function WorkLedger({ items }: { items: LedgerProject[] }) {
  const [active, setActive] = useState(0);
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const current = items[active] ?? items[0];

  const go = (href: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigateWithViewTransition(href, (url) => router.push(url));
  };

  return (
    <section
      aria-labelledby="work-title"
      className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-36">
      <Reveal>
        <h2
          id="work-title"
          className="text-[clamp(2rem,3.6vw,3rem)] font-bold leading-[1.05] tracking-tight text-white dark:text-gray-900">
          Shipped apps and tools
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-gray-200 dark:text-gray-800">
          The products I lead with. Every one is live, and each has a case
          study.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] md:gap-16">
        <ul>
          {items.map((item, i) => {
            const { project } = item;
            const href = `/work/${project.slug}`;
            const isActive = i === active;
            const line = meta(item);
            return (
              <Reveal as="li" key={project.slug} delay={Math.min(i, 4) * 0.06}>
                {/* Phone: each product shows its picture above its row. */}
                <Link
                  href={href}
                  onClick={go(href)}
                  tabIndex={-1}
                  aria-hidden
                  className="mb-4 block overflow-hidden rounded-lg md:hidden">
                  <WorkCover project={project} className="aspect-[16/10] h-auto" />
                </Link>
                <Link
                  href={href}
                  onClick={go(href)}
                  onPointerEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group grid grid-cols-[1fr_auto] items-baseline gap-x-6 gap-y-1 rounded-lg px-4 py-5 md:grid-cols-[4.5rem_1fr_auto] md:items-center md:py-4 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] max-md:mb-10 max-md:px-0 ${
                    isActive
                      ? "md:bg-inkDeep md:dark:bg-paperDeep"
                      : "md:hover:bg-inkDeep/60 md:dark:hover:bg-paperDeep/60"
                  }`}>
                  {project.img ? (
                    <span
                      aria-hidden
                      className="relative hidden aspect-[4/3] w-[4.5rem] overflow-hidden rounded-md bg-inkDeep md:row-span-2 md:block dark:bg-paperDeep">
                      <Image
                        src={project.img}
                        alt=""
                        fill
                        sizes="72px"
                        className={`object-cover object-top transition-[transform,filter] duration-300 group-hover:scale-105 ${
                          isActive ? "" : "md:grayscale"
                        }`}
                      />
                    </span>
                  ) : (
                    <span aria-hidden className="hidden md:row-span-2 md:block" />
                  )}
                  <span
                    className={`text-2xl font-semibold tracking-tight transition-colors md:text-[1.75rem] ${
                      isActive
                        ? "text-white dark:text-gray-900"
                        : "text-white dark:text-gray-900 md:text-[var(--text-muted)] md:dark:text-[var(--text-muted)]"
                    }`}>
                    {project.name}
                  </span>
                  <span
                    aria-hidden
                    className={`text-xl transition-transform duration-200 group-hover:translate-x-1 ${
                      isActive ? "text-[var(--accent-text)]" : "text-[var(--text-muted)]"
                    }`}>
                    →
                  </span>
                  <span className="col-span-2 text-[15px] leading-relaxed text-[var(--text-muted)] md:col-span-2 md:col-start-2">
                    {project.category || project.language}
                    {line ? ` · ${line}` : ""}
                  </span>
                </Link>
              </Reveal>
            );
          })}
        </ul>

        {/* Desktop: the selected product, large. */}
        <div className="hidden md:block">
          <div className="sticky top-28">
            <Link
              href={`/work/${current.project.slug}`}
              onClick={go(`/work/${current.project.slug}`)}
              tabIndex={-1}
              aria-hidden
              className="block overflow-hidden rounded-lg bg-inkDeep dark:bg-paperDeep">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={current.project.slug}
                  initial={reduceMotion ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduceMotion ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}>
                  <WorkCover
                    project={current.project}
                    className="aspect-[4/3] h-auto"
                    priority={active === 0}
                  />
                </motion.div>
              </AnimatePresence>
            </Link>
            {/* Every description sits in the same cell so the column keeps
                the height of the longest one; hovering a row with a longer
                text doesn't push the "All work" link down. */}
            <div className="mt-5 grid max-w-lg">
              {items.map(({ project }) => {
                const shown = project.slug === current.project.slug;
                return (
                  <p
                    key={project.slug}
                    aria-hidden={!shown}
                    className={`col-start-1 row-start-1 text-[17px] leading-relaxed text-gray-200 dark:text-gray-800 ${
                      shown ? "" : "invisible"
                    }`}>
                    {project.description}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <Reveal className="mt-12">
        <Link
          href="/work"
          className="text-base font-medium text-white underline decoration-white/30 underline-offset-[6px] transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47] dark:text-gray-900 dark:decoration-gray-400">
          All work, including earlier builds
        </Link>
      </Reveal>
    </section>
  );
}
