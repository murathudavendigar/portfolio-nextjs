import LabShell from "@/components/lab/LabShell";
import SkylineLab from "@/components/lab/SkylineLab";
import { getLabExperiment } from "@/data/lab";
import { site } from "@/lib/site";
import { pageOgImages } from "@/lib/og-pages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const SLUG = "daily-skyline";

export const metadata: Metadata = {
  title: "Lab · Play a Daily Skyline Puzzle",
  description:
    "Play a full 5×5 Daily Skyline tutorial board in your browser. Learn the skyscraper puzzle rules, then open the case study or the App Store listing.",
  alternates: { canonical: `/lab/${SLUG}` },
  openGraph: {
    images: pageOgImages("lab-daily-skyline"),
    title: `Lab · Play a Daily Skyline Puzzle — ${site.shortName}`,
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
