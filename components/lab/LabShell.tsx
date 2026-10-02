"use client";

import type { LabExperiment } from "@/data/lab";
import LabGameStage from "@/components/lab/LabGameStage";
import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.65, bounce: 0.2 };

export default function LabShell({
  experiment,
  children,
  wide = false,
}: {
  experiment: LabExperiment;
  children: ReactNode;
  /** Wider play surface for boards like Daily Skyline */
  wide?: boolean;
}) {
  const live = experiment.status === "live";
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      setOpen(true);
      return;
    }
    const id = window.setTimeout(() => setOpen(true), 40);
    return () => window.clearTimeout(id);
  }, [reduceMotion, experiment.slug]);

  return (
    <div className="min-h-screen bg-inkDeep font-custom text-white dark:bg-paperDeep dark:text-gray-700">
      <main id="main" className="relative overflow-hidden">
        {!reduceMotion ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30 bg-inkDeep dark:bg-paperDeep"
            initial={{ transform: "translateY(0%)" }}
            animate={
              open
                ? { transform: "translateY(-105%)" }
                : { transform: "translateY(0%)" }
            }
            transition={{ duration: 0.7, ease: EASE }}>
            <div className="absolute inset-x-0 bottom-0 h-px bg-[#CA3E47]" />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#CA3E47]/45 to-transparent" />
          </motion.div>
        ) : null}

        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(202,62,71,0.22),_transparent_55%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-28 flex h-48 items-end gap-1.5 opacity-35 sm:right-10 sm:opacity-45 dark:opacity-50">
          {[18, 34, 26, 48, 22, 40, 30, 56, 20].map((h, i) => (
            <motion.span
              key={i}
              className="w-2.5 origin-bottom rounded-t-sm bg-gradient-to-t from-[#CA3E47]/90 to-[#CA3E47]/25 sm:w-3"
              style={{ height: `${h}%` }}
              initial={
                reduceMotion ? false : { transform: "scaleY(0.2)", opacity: 0 }
              }
              animate={
                open
                  ? { transform: "scaleY(1)", opacity: 1 }
                  : { transform: "scaleY(0.2)", opacity: 0 }
              }
              transition={{
                duration: 0.6,
                ease: EASE,
                delay: reduceMotion ? 0 : 0.35 + i * 0.03,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <motion.nav
            aria-label="Lab breadcrumb"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, transform: "translateY(10px)" }
            }
            animate={
              open
                ? { opacity: 1, transform: "translateY(0px)" }
                : { opacity: 0, transform: "translateY(10px)" }
            }
            transition={{ duration: 0.4, ease: EASE, delay: 0.25 }}
            className="font-mono-ui flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
            <Link
              href="/lab"
              className="transition-colors hover:text-[#CA3E47]">
              Lab
            </Link>
            <span aria-hidden>/</span>
            <span className="text-gray-300 dark:text-gray-700">
              {experiment.title}
            </span>
          </motion.nav>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-2xl overflow-hidden">
              <motion.p
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
                transition={{ duration: 0.4, ease: EASE, delay: 0.32 }}
                className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[#CA3E47]">
                {experiment.eyebrow}
              </motion.p>
              <h1 className="mt-3 overflow-hidden font-mono-ui text-4xl font-semibold tracking-tight [text-wrap:balance] sm:text-5xl md:text-6xl dark:text-gray-900">
                <motion.span
                  className="inline-block"
                  initial={
                    reduceMotion
                      ? false
                      : {
                          opacity: 0,
                          transform: "translateY(110%) scale(0.96)",
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
                          transform: "translateY(110%) scale(0.96)",
                        }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { ...SPRING, delay: 0.38 }
                  }>
                  {experiment.title}
                </motion.span>
              </h1>
              <motion.p
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: open ? 1 : 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.55 }}
                className="mt-4 max-w-xl text-base leading-relaxed text-gray-300 dark:text-gray-700">
                {experiment.summary}
              </motion.p>
            </div>
            <motion.span
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, transform: "scale(0.94)" }
              }
              animate={
                open
                  ? { opacity: 1, transform: "scale(1)" }
                  : { opacity: 0, transform: "scale(0.94)" }
              }
              transition={{ duration: 0.35, ease: EASE, delay: 0.5 }}
              className={`font-mono-ui shrink-0 border px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] ${
                live
                  ? "border-[#CA3E47] bg-[#CA3E47]/15 text-[#CA3E47]"
                  : "border-white/20 text-[var(--text-muted)] dark:border-gray-400/40"
              }`}>
              {live ? "Live" : "Soon"}
            </motion.span>
          </div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE, delay: 0.6 }}
            className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            <Link
              href={`/work/${experiment.workSlug}`}
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#CA3E47] hover:decoration-[#CA3E47]">
              Case study →
            </Link>
            {experiment.productUrl ? (
              <a
                href={experiment.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[#CA3E47] hover:decoration-[#CA3E47]">
                {experiment.productLabel ?? "Live product"} →
              </a>
            ) : null}
          </motion.div>

          <motion.div
            initial={
              reduceMotion
                ? false
                : {
                    opacity: 0,
                    transform: "translateY(28px) scale(0.97)",
                  }
            }
            animate={
              open
                ? {
                    opacity: 1,
                    transform: "translateY(0px) scale(1)",
                  }
                : {
                    opacity: 0,
                    transform: "translateY(28px) scale(0.97)",
                  }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : { ...SPRING, delay: 0.58 }
            }
            className={`relative mx-auto mt-14 border border-white/15 bg-ink/60 px-4 py-8 backdrop-blur-sm sm:px-10 sm:py-12 dark:border-gray-400/40 dark:bg-paper/80 ${
              wide ? "max-w-2xl" : "max-w-xl"
            }`}>
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#CA3E47] to-transparent"
            />
            <LabGameStage slug={experiment.slug}>{children}</LabGameStage>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: open ? 1 : 0 }}
            transition={{ duration: 0.35, ease: EASE, delay: 0.75 }}
            className="mx-auto mt-10 max-w-xl text-center text-sm text-gray-400 dark:text-gray-600">
            <Link
              href="/lab"
              className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[#CA3E47]">
              ← Back to Lab
            </Link>
          </motion.p>
        </div>
      </main>
    </div>
  );
}
