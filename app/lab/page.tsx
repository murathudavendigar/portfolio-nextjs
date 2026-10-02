import ChooseLab from "@/components/lab/ChooseLab";
import Reveal from "@/components/Reveal";
import { labPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Interactive demos from Murat Öncü’s products — start with a CHOOSE mini: pick the wrong answer to score.",
  alternates: { canonical: "/lab" },
  openGraph: {
    title: `Lab — ${site.shortName}`,
    description:
      "Interactive demos from shipped products. Try a CHOOSE mini-round in the browser.",
    url: `${site.url}/lab`,
    type: "website",
  },
};

export default function LabPage() {
  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main" className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <Reveal>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
            Lab
          </p>
          <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl dark:text-gray-900">
            Try a piece of the product
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-300 dark:text-gray-700">
            Small interactive demos tied to work I actually shipped — not
            generic UI toys. First up: the inverted quiz rule from{" "}
            <Link
              href="/work/choose-game"
              className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
              CHOOSE
            </Link>
            .
          </p>
        </Reveal>

        <div className="mt-14 rounded-2xl border border-white/10 bg-white/[0.02] px-5 py-10 sm:px-10 sm:py-12 dark:border-gray-400/40 dark:bg-gray-200/20">
          <ChooseLab />
        </div>

        <Reveal className="mt-12 max-w-xl">
          <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-600">
            More experiments may land here. Prefer a quick intro?{" "}
            <Link
              href="/hire"
              className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
              How we work
            </Link>
            .
          </p>
        </Reveal>
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
