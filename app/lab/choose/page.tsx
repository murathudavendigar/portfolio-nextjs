import ChooseLab from "@/components/lab/ChooseLab";
import LabShell from "@/components/lab/LabShell";
import { getLabExperiment } from "@/data/lab";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SLUG = "choose";

export const metadata: Metadata = {
  title: "Lab · CHOOSE",
  description:
    "Play a timed CHOOSE mini — wrong answers score, timers burn lives. Then read the case study.",
  alternates: { canonical: `/lab/${SLUG}` },
  openGraph: {
    title: `Lab · CHOOSE — ${site.shortName}`,
    description:
      "Interactive CHOOSE demo: inverted quiz rule with timer and combos.",
    url: `${site.url}/lab/${SLUG}`,
    type: "website",
  },
};

export default function LabChoosePage() {
  const experiment = getLabExperiment(SLUG);
  if (!experiment) notFound();

  return (
    <LabShell experiment={experiment}>
      <ChooseLab />
    </LabShell>
  );
}
