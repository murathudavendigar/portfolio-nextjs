import LabShell from "@/components/lab/LabShell";
import SkylineLab from "@/components/lab/SkylineLab";
import { getLabExperiment } from "@/data/lab";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SLUG = "daily-skyline";

export const metadata: Metadata = {
  title: "Lab · Daily Skyline",
  description:
    "Play a full 5×5 Daily Skyline tutorial board — then open the case study or App Store listing.",
  alternates: { canonical: `/lab/${SLUG}` },
  openGraph: {
    title: `Lab · Daily Skyline — ${site.shortName}`,
    description:
      "Interactive 5×5 skyscraper tutorial board tied to the Daily Skyline case study.",
    url: `${site.url}/lab/${SLUG}`,
    type: "website",
  },
};

export default function LabDailySkylinePage() {
  const experiment = getLabExperiment(SLUG);
  if (!experiment) notFound();

  return (
    <LabShell experiment={experiment} wide>
      <SkylineLab />
    </LabShell>
  );
}
