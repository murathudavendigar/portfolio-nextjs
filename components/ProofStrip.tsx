"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Stat = { value: string; label: string };

function StatValue({ value }: { value: string }) {
  const isNumeric = /^\d+$/.test(value);
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const [display, setDisplay] = useState(
    isNumeric && !reduceMotion ? "0" : value,
  );

  useEffect(() => {
    if (!isNumeric || reduceMotion || !inView) return;
    const target = parseInt(value, 10);
    const controls = animate(0, target, {
      duration: 1.1,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, isNumeric, reduceMotion, value]);

  return (
    <p
      ref={ref}
      className="text-3xl font-bold tracking-tight tabular-nums sm:text-4xl">
      {display}
    </p>
  );
}

export default function ProofStrip({ stats }: { stats: Stat[] }) {
  return (
    <section
      aria-label="At a glance"
      className="border-y border-white/10 dark:border-gray-300">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: "easeOut" }}>
            <StatValue value={stat.value} />
            <p className="mt-1 font-mono-ui text-[11px] uppercase leading-relaxed tracking-[0.12em] text-gray-400 dark:text-gray-600">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
