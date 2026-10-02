import LabIndex from "@/components/lab/LabIndex";
import { getLabExperiments } from "@/data/lab";
import { labPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "Tap first, read later — interactive slices of Murat Öncü’s shipped products.",
  alternates: { canonical: "/lab" },
  openGraph: {
    title: `Lab — ${site.shortName}`,
    description:
      "Compressed loops from real products. Play the rule, then open the case study.",
    url: `${site.url}/lab`,
    type: "website",
  },
};

export default function LabIndexPage() {
  const experiments = getLabExperiments();
  const live = experiments.filter((e) => e.status === "live");
  const soon = experiments.filter((e) => e.status === "soon");

  return (
    <>
      <LabIndex live={live} soon={soon} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(labPageGraph()),
        }}
      />
    </>
  );
}
