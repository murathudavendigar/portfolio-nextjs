import LabShell from "@/components/lab/LabShell";
import { getLabExperiment } from "@/data/lab";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const SLUG = "courai";

export const metadata: Metadata = {
  title: "Lab · Courai",
  description:
    "Courai lab demo coming soon — read the case study in the meantime.",
  alternates: { canonical: `/lab/${SLUG}` },
  openGraph: {
    title: `Lab · Courai — ${site.shortName}`,
    url: `${site.url}/lab/${SLUG}`,
    type: "website",
  },
};

export default function LabCouraiSoonPage() {
  const experiment = getLabExperiment(SLUG);
  if (!experiment) notFound();

  return (
    <LabShell experiment={experiment}>
      <div className="text-center">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          Demo soon
        </p>
        <h2 className="mt-3 text-2xl font-semibold dark:text-gray-900">
          Micro-challenge playground
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-gray-300 dark:text-gray-700">
          A sample daily challenge UI is next. Until then, the case study covers
          the CBT-shaped loop, offline queue, and paywall.
        </p>
        <Link href={`/work/${experiment.workSlug}`} className="btn-primary mt-8 inline-flex">
          Read case study
        </Link>
      </div>
    </LabShell>
  );
}
