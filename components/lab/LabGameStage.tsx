"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

const EASE = [0.23, 1, 0.32, 1] as const;
const SPRING = { type: "spring" as const, duration: 0.7, bounce: 0.28 };

type StageKind = "choose" | "skyline" | "default";

function stageKind(slug: string): StageKind {
  if (slug === "choose") return "choose";
  if (slug === "daily-skyline") return "skyline";
  return "default";
}

/**
 * Own entrance for the playable game block — separate from LabShell chrome.
 */
export default function LabGameStage({
  slug,
  children,
}: {
  slug: string;
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState(false);
  const kind = stageKind(slug);

  useEffect(() => {
    if (reduceMotion) {
      setReady(true);
      return;
    }
    // Sit behind the shell veil, then punch the stage in.
    const id = window.setTimeout(() => setReady(true), 520);
    return () => window.clearTimeout(id);
  }, [reduceMotion, slug]);

  return (
    <div className="relative overflow-hidden">
      {/* Stage curtain — lifts after shell, game-specific heat */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className={`pointer-events-none absolute inset-0 z-20 ${
            kind === "choose"
              ? "bg-[#CA3E47]"
              : kind === "skyline"
                ? "bg-inkDeep dark:bg-paperDeep"
                : "bg-inkDeep dark:bg-paperDeep"
          }`}
          initial={{ transform: "translateY(0%)" }}
          animate={
            ready
              ? { transform: "translateY(-110%)" }
              : { transform: "translateY(0%)" }
          }
          transition={{ duration: 0.55, ease: EASE }}>
          {kind === "choose" ? (
            <span className="absolute inset-0 flex items-center justify-center font-mono-ui text-4xl font-semibold text-white/90">
              ✕
            </span>
          ) : null}
          {kind === "skyline" ? (
            <div className="absolute inset-x-8 bottom-6 flex h-16 items-end justify-center gap-1">
              {[40, 70, 50, 90, 55, 75, 45].map((h, i) => (
                <span
                  key={i}
                  className="w-2 bg-[#CA3E47]"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          ) : null}
          <div
            className={`absolute inset-x-0 bottom-0 h-px ${
              kind === "choose" ? "bg-white/50" : "bg-[#CA3E47]"
            }`}
          />
        </motion.div>
      ) : null}

      {/* Heat ring flash on open */}
      {!reduceMotion ? (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-10 rounded-[inherit]"
          initial={{ opacity: 0 }}
          animate={
            ready
              ? { opacity: [0, 0.55, 0] }
              : { opacity: 0 }
          }
          transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
          style={{
            boxShadow:
              kind === "choose"
                ? "inset 0 0 0 2px rgba(202,62,71,0.9)"
                : "inset 0 0 60px rgba(202,62,71,0.35)",
          }}
        />
      ) : null}

      <motion.div
        initial={
          reduceMotion
            ? false
            : {
                opacity: 0,
                transform:
                  kind === "skyline"
                    ? "translateY(20px) scale(0.94)"
                    : kind === "choose"
                      ? "translateY(16px) scale(0.96) rotate(-1deg)"
                      : "translateY(18px) scale(0.96)",
              }
        }
        animate={
          ready
            ? {
                opacity: 1,
                transform: "translateY(0px) scale(1) rotate(0deg)",
              }
            : {
                opacity: 0,
                transform:
                  kind === "skyline"
                    ? "translateY(20px) scale(0.94)"
                    : kind === "choose"
                      ? "translateY(16px) scale(0.96) rotate(-1deg)"
                      : "translateY(18px) scale(0.96)",
              }
        }
        transition={
          reduceMotion
            ? { duration: 0 }
            : { ...SPRING, delay: 0.08 }
        }>
        {children}
      </motion.div>
    </div>
  );
}
