"use client";

import ChooseDemo from "@/components/demos/ChooseDemo";
import SkylineDemo from "@/components/demos/SkylineDemo";
import type { WorkDemo as WorkDemoData } from "@/data/demos";

const DEMOS: Record<string, () => React.JSX.Element> = {
  "choose-game": ChooseDemo,
  "daily-skyline": SkylineDemo,
};

/** Playable slice of a product, shown inside its case study. */
export default function WorkDemo({ demo }: { demo: WorkDemoData }) {
  const Demo = DEMOS[demo.workSlug];
  if (!Demo) return null;

  return (
    <section
      id="try-it"
      aria-labelledby="try-it-title"
      className="mt-16 scroll-mt-24 border-t border-white/10 pt-10 dark:border-gray-300">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
        Try it · {demo.eyebrow}
      </p>
      <h2
        id="try-it-title"
        className="mt-3 text-2xl font-semibold tracking-tight dark:text-gray-900">
        Play the core loop
      </h2>
      <p className="mt-3 max-w-2xl text-base leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
        {demo.summary}
      </p>
      <div className="relative mx-auto mt-10 max-w-2xl border border-white/15 bg-inkDeep/60 px-4 py-8 sm:px-10 sm:py-12 dark:border-gray-400/40 dark:bg-paperDeep/80">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-[#CA3E47] to-transparent"
        />
        <Demo />
      </div>
    </section>
  );
}
