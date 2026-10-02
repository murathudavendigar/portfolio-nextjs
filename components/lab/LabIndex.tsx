"use client";

import type { LabExperiment } from "@/data/lab";
import { navigateWithViewTransition } from "@/lib/navigate-with-view-transition";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;
const SPRING_LETTER = { type: "spring" as const, duration: 0.72, bounce: 0.22 };

const SKYLINE = [18, 42, 28, 70, 36, 54, 24, 82, 40, 60, 32, 74, 22, 48, 16];

function AmbientSkyline({
  reduceMotion,
  ready,
}: {
  reduceMotion: boolean | null;
  ready: boolean;
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 flex h-[42vh] min-h-[14rem] items-end justify-center gap-1 sm:gap-1.5 md:gap-2">
      {SKYLINE.map((h, i) => (
        <motion.span
          key={i}
          className="w-2 origin-bottom rounded-t-[1px] bg-gradient-to-t from-[#CA3E47] via-[#CA3E47]/60 to-transparent sm:w-2.5 md:w-3"
          style={{ height: `${h}%` }}
          initial={
            reduceMotion ? false : { transform: "scaleY(0.08)", opacity: 0 }
          }
          animate={
            ready
              ? reduceMotion
                ? { opacity: 0.55 }
                : {
                    transform: "scaleY(1)",
                    opacity: [0.4, 0.75, 0.5],
                  }
              : { transform: "scaleY(0.08)", opacity: 0 }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : {
                  transform: {
                    duration: 0.85,
                    delay: 0.55 + i * 0.035,
                    ease: EASE,
                  },
                  opacity: {
                    duration: 3.8 + (i % 5) * 0.3,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: 1.2 + i * 0.04,
                  },
                }
          }
        />
      ))}
    </div>
  );
}

function EntranceVeil({
  reduceMotion,
  done,
}: {
  reduceMotion: boolean | null;
  done: boolean;
}) {
  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-20 bg-inkDeep dark:bg-paperDeep"
      initial={{ transform: "translateY(0%)" }}
      animate={
        done
          ? { transform: "translateY(-105%)" }
          : { transform: "translateY(0%)" }
      }
      transition={{ duration: 0.85, ease: EASE, delay: 0.05 }}>
      <div className="absolute inset-x-0 bottom-0 h-px bg-[#CA3E47]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#CA3E47]/40 to-transparent" />
    </motion.div>
  );
}

function FloatingWrong({
  reduceMotion,
  ready,
}: {
  reduceMotion: boolean | null;
  ready: boolean;
}) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute right-[8%] top-[22%] hidden sm:block md:right-[12%] md:top-[18%]"
      initial={
        reduceMotion
          ? false
          : {
              opacity: 0,
              transform: "translateY(24px) rotate(-12deg) scale(0.92)",
            }
      }
      animate={
        ready
          ? {
              opacity: 1,
              transform: "translateY(0px) rotate(-8deg) scale(1)",
            }
          : {
              opacity: 0,
              transform: "translateY(24px) rotate(-12deg) scale(0.92)",
            }
      }
      transition={
        reduceMotion ? { duration: 0 } : { ...SPRING_LETTER, delay: 0.7 }
      }>
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#CA3E47] bg-[#CA3E47]/15 font-mono-ui text-2xl font-semibold text-[#CA3E47] shadow-[0_0_40px_rgba(202,62,71,0.25)] md:h-20 md:w-20 md:text-3xl">
        ✕
      </span>
    </motion.div>
  );
}

function StationMotif({ slug }: { slug: string }) {
  if (slug === "choose") {
    return (
      <div aria-hidden className="flex items-center gap-2">
        {["A", "B", "C"].map((label, i) => (
          <span
            key={label}
            className={`flex h-12 w-12 items-center justify-center rounded-lg border font-mono-ui text-sm tracking-widest sm:h-14 sm:w-14 ${
              i === 1
                ? "border-[#CA3E47] bg-[#CA3E47] text-white"
                : "border-white/20 text-white/40 dark:border-gray-500/50 dark:text-gray-500"
            }`}>
            {i === 1 ? "✕" : label}
          </span>
        ))}
      </div>
    );
  }

  if (slug === "daily-skyline") {
    const heights = [30, 55, 40, 78, 48, 62, 36, 88, 44];
    return (
      <div aria-hidden className="flex h-16 items-end gap-1 sm:h-20">
        {heights.map((h, i) => (
          <span
            key={i}
            className="w-2 rounded-t-[1px] bg-[#CA3E47] sm:w-2.5"
            style={{ height: `${h}%`, opacity: 0.45 + (i % 3) * 0.18 }}
          />
        ))}
      </div>
    );
  }

  if (slug === "courai") {
    return (
      <div aria-hidden className="flex w-40 flex-col gap-2">
        <span className="h-2 w-full rounded-full bg-white/15 dark:bg-gray-400/35" />
        <span className="h-2 w-3/4 rounded-full bg-[#CA3E47]/70" />
        <span className="h-2 w-[85%] rounded-full bg-white/10 dark:bg-gray-400/25" />
      </div>
    );
  }

  return (
    <span
      aria-hidden
      className="font-mono-ui rounded border border-dashed border-white/25 px-3 py-2 text-[10px] uppercase tracking-[0.16em] text-white/50 dark:border-gray-500/50 dark:text-gray-600">
      invoice_q3_final.pdf
    </span>
  );
}

function LiveStation({
  exp,
  index,
  reduceMotion,
}: {
  exp: LabExperiment;
  index: number;
  reduceMotion: boolean | null;
}) {
  const router = useRouter();
  const href = `/lab/${exp.slug}`;

  const enter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateWithViewTransition(href, (url) => router.push(url));
  };

  return (
    <motion.article
      initial={
        reduceMotion ? false : { opacity: 0, transform: "translateY(28px)" }
      }
      whileInView={{ opacity: 1, transform: "translateY(0px)" }}
      viewport={{ once: true, margin: "-8% 0px" }}
      transition={{ duration: 0.55, ease: EASE, delay: index * 0.08 }}
      className={`group relative overflow-hidden border-y border-white/10 dark:border-gray-400/35 ${
        index % 2 === 1 ? "bg-white/[0.02] dark:bg-black/[0.03]" : ""
      }`}>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#CA3E47]/10 blur-3xl transition-opacity group-hover:opacity-100 dark:bg-[#CA3E47]/15"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between sm:gap-12 md:px-10 md:py-16">
        <div className="min-w-0 flex-1">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[#CA3E47]">
            {exp.eyebrow}
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight dark:text-gray-900 sm:text-5xl">
            <a href={href} onClick={enter} className="hover:text-[#CA3E47]">
              {exp.title}
            </a>
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-gray-300 dark:text-gray-700">
            {exp.summary}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={href} onClick={enter} className="btn-primary">
              Play now
            </a>
            <Link
              href={`/work/${exp.workSlug}`}
              className="text-sm text-gray-400 underline decoration-white/20 underline-offset-4 transition-colors hover:text-[#CA3E47] dark:text-gray-600">
              Case study
            </Link>
          </div>
        </div>

        <div className="flex shrink-0 justify-start sm:justify-end">
          <StationMotif slug={exp.slug} />
        </div>
      </div>
    </motion.article>
  );
}

function SoonRow({ exp }: { exp: LabExperiment }) {
  const router = useRouter();
  const href = `/lab/${exp.slug}`;

  const enter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigateWithViewTransition(href, (url) => router.push(url));
  };

  return (
    <li className="flex flex-wrap items-baseline justify-between gap-3 border-t border-white/10 py-5 dark:border-gray-400/30">
      <div>
        <a
          href={href}
          onClick={enter}
          className="text-lg font-semibold tracking-tight transition-colors hover:text-[#CA3E47] dark:text-gray-900">
          {exp.title}
        </a>
        <p className="mt-1 max-w-md text-sm text-gray-400 dark:text-gray-600">
          {exp.summary}
        </p>
      </div>
      <span className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
        Soon
      </span>
    </li>
  );
}

export default function LabIndex({
  live,
  soon,
}: {
  live: LabExperiment[];
  soon: LabExperiment[];
}) {
  const reduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<"boot" | "open">("boot");

  useEffect(() => {
    if (reduceMotion) {
      setPhase("open");
      return;
    }
    const id = window.setTimeout(() => setPhase("open"), 60);
    return () => window.clearTimeout(id);
  }, [reduceMotion]);

  const open = phase === "open";

  return (
    <div className="min-h-screen bg-inkDeep font-custom text-white dark:bg-paperDeep dark:text-gray-700">
      <main id="main" className="relative">
        <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-28 md:pb-28 md:pt-32">
          <EntranceVeil reduceMotion={reduceMotion} done={open} />

          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_120%,_rgba(202,62,71,0.4),_transparent_55%)]"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.35 }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.07] dark:opacity-[0.05]"
            style={{
              backgroundImage:
                "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />
          <AmbientSkyline reduceMotion={reduceMotion} ready={open} />
          <FloatingWrong reduceMotion={reduceMotion} ready={open} />

          <div className="relative z-10 mx-auto w-full max-w-6xl px-6 md:px-10">
            <motion.p
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(14px)" }
              }
              animate={
                open
                  ? { opacity: 1, transform: "translateY(0px)" }
                  : { opacity: 0, transform: "translateY(14px)" }
              }
              transition={{ duration: 0.45, ease: EASE, delay: 0.4 }}
              className="font-mono-ui text-[12px] uppercase tracking-[0.28em] text-[#CA3E47]">
              Leave the résumé voice
            </motion.p>

            <h1 className="mt-5 overflow-hidden">
              <span className="sr-only">Lab</span>
              <span
                aria-hidden
                className="flex flex-wrap gap-x-1 font-mono-ui text-[clamp(4.75rem,19vw,12rem)] font-semibold leading-[0.82] tracking-[-0.05em] text-white dark:text-gray-900 sm:gap-x-2">
                {"LAB".split("").map((letter, i) => (
                  <motion.span
                    key={letter}
                    className="inline-block will-change-transform"
                    initial={
                      reduceMotion
                        ? false
                        : {
                            opacity: 0,
                            transform: "translateY(115%) scale(0.94)",
                          }
                    }
                    animate={
                      open
                        ? {
                            opacity: 1,
                            transform: "translateY(0%) scale(1)",
                          }
                        : {
                            opacity: 0,
                            transform: "translateY(115%) scale(0.94)",
                          }
                    }
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { ...SPRING_LETTER, delay: 0.48 + i * 0.09 }
                    }>
                    {letter}
                  </motion.span>
                ))}
              </span>
            </h1>

            <motion.div
              aria-hidden
              className="mt-5 h-px max-w-[12rem] origin-left bg-gradient-to-r from-[#CA3E47] to-transparent"
              initial={
                reduceMotion
                  ? false
                  : { transform: "scaleX(0)", opacity: 0 }
              }
              animate={
                open
                  ? { transform: "scaleX(1)", opacity: 1 }
                  : { transform: "scaleX(0)", opacity: 0 }
              }
              transition={{ duration: 0.55, ease: EASE, delay: 0.85 }}
            />

            <motion.p
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(18px)" }
              }
              animate={
                open
                  ? { opacity: 1, transform: "translateY(0px)" }
                  : { opacity: 0, transform: "translateY(18px)" }
              }
              transition={{ duration: 0.5, ease: EASE, delay: 0.9 }}
              className="mt-7 max-w-lg text-xl leading-snug text-gray-200 dark:text-gray-800 sm:text-2xl">
              Tap first. Read later.
            </motion.p>
            <motion.p
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: open ? 1 : 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: 1.05 }}
              className="mt-4 max-w-md text-sm leading-relaxed text-gray-400 dark:text-gray-600">
              Compressed loops from shipped products — wrong answers that score,
              skylines you build by hand. Then the case study, if you still want
              it.
            </motion.p>

            <motion.div
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, transform: "translateY(12px)" }
              }
              animate={
                open
                  ? { opacity: 1, transform: "translateY(0px)" }
                  : { opacity: 0, transform: "translateY(12px)" }
              }
              transition={{ duration: 0.45, ease: EASE, delay: 1.15 }}
              className="mt-11 flex flex-wrap items-center gap-4">
              <a
                href="#stations"
                className="group relative inline-flex min-h-12 items-center gap-3 overflow-hidden rounded-lg bg-[#CA3E47] px-7 py-3 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(202,62,71,0.35)] transition-transform hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative z-10">Enter the lab</span>
                <motion.span
                  aria-hidden
                  className="relative z-10 font-mono-ui text-base"
                  animate={
                    reduceMotion
                      ? undefined
                      : {
                          transform: [
                            "translateY(0px)",
                            "translateY(3px)",
                            "translateY(0px)",
                          ],
                        }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1.6,
                  }}>
                  ↓
                </motion.span>
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
              </a>
              <span className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
                {live.length} live · {soon.length} warming up
              </span>
            </motion.div>
          </div>
        </section>

        <section id="stations" aria-label="Playable experiments">
          <AnimatePresence>
            {live.map((exp, i) => (
              <LiveStation
                key={exp.slug}
                exp={exp}
                index={i}
                reduceMotion={reduceMotion}
              />
            ))}
          </AnimatePresence>
        </section>

        {soon.length > 0 ? (
          <section className="relative mx-auto max-w-6xl px-6 py-20 md:px-10 md:py-28">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--text-muted)]">
              Still soldering
            </p>
            <ul className="mt-6">
              {soon.map((exp) => (
                <SoonRow key={exp.slug} exp={exp} />
              ))}
            </ul>
            <p className="mt-12 text-sm text-gray-500 dark:text-gray-600">
              Prefer the write-ups?{" "}
              <Link
                href="/work"
                className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#CA3E47]">
                Back to /work
              </Link>
            </p>
          </section>
        ) : null}
      </main>
    </div>
  );
}
