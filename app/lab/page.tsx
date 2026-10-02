import ChooseLab from "@/components/lab/ChooseLab";
import Reveal from "@/components/Reveal";
import { labPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Interactive demos from Murat Öncü’s products — play a CHOOSE mini: wrong answers score, timers burn lives, combos stack.",
  alternates: { canonical: "/lab" },
  openGraph: {
    title: `Lab — ${site.shortName}`,
    description:
      "Interactive demos from shipped products. Try a timed CHOOSE mini-round in the browser.",
    url: `${site.url}/lab`,
    type: "website",
  },
};

export default function LabPage() {
  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main" className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[28rem] bg-[radial-gradient(ellipse_at_top,_rgba(202,62,71,0.12),_transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,_rgba(202,62,71,0.08),_transparent_55%)]"
        />

        <div className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <Reveal>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Lab
            </p>
            <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl dark:text-gray-900">
              Play a piece of the product
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-gray-300 dark:text-gray-700">
              Not a UI kit demo — a compressed loop from{" "}
              <Link
                href="/work/choose-game"
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
                CHOOSE
              </Link>
              : inverted answers, a round timer, and combos.
            </p>
          </Reveal>

          <div className="relative mx-auto mt-12 max-w-xl border border-white/10 bg-ink/80 px-5 py-10 backdrop-blur-sm sm:px-10 sm:py-12 dark:border-gray-400/40 dark:bg-paper/90">
            <ChooseLab />
          </div>

          <Reveal className="mx-auto mt-10 max-w-xl text-center">
            <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-600">
              More product slices later. Hiring?{" "}
              <Link
                href="/hire"
                className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
                How we work
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(labPageGraph()),
        }}
      />
    </div>
  );
}
