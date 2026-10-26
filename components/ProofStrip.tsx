"use client";

import Reveal from "@/components/Reveal";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Stat = { value: string; label: string };

function StatValue({ value }: { value: string }) {
  const isNumeric = /^\d+$/.test(value);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px" });
  const [mounted, setMounted] = useState(false);

  // Always start with the real value for SSR — never render "0" on the server.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !isNumeric || reduceMotion || !inView) return;
    const target = parseInt(value, 10);
    if (target === 0) return;
    // Reset to 0 then animate up
    setDisplay("0");
    const controls = animate(0, target, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [mounted, inView, isNumeric, reduceMotion, value]);

  return (
    <p
      ref={ref}
      className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
      {display}
    </p>
  );
}

export default function ProofStrip({
  stats,
  isLive = false,
}: {
  stats: Stat[];
  isLive?: boolean;
}) {
  return (
    <section
      aria-label="At a glance"
      className="border-y border-white/10 dark:border-gray-300">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.08}>
            <StatValue value={stat.value} />
            <p className="mt-1 font-mono-ui text-[11px] uppercase leading-relaxed tracking-[0.12em] text-[var(--text-muted)]">
              {stat.label}
            </p>
          </Reveal>
        ))}
      </div>
      {isLive && (
        <p className="mx-auto max-w-6xl px-6 pb-6 font-mono-ui text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
          <span aria-hidden="true" className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 align-middle" />
          Live from the App Store and npm · refreshed daily
        </p>
      )}
    </section>
  );
}
