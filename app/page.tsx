import HomeHero from "@/components/home/HomeHero";
import LiveSentence from "@/components/home/LiveSentence";
import ProofTable from "@/components/home/ProofTable";
import WorkLedger from "@/components/home/WorkLedger";
import WriteBand from "@/components/home/WriteBand";
import WritingList from "@/components/home/WritingList";
import { getRatingsBySlug } from "@/lib/appStore";
import { getNpmInfo, npmPackageFromUrl } from "@/lib/npm";
import { getLiveStats } from "@/lib/liveStats";
import { getHomepageFeaturedProjects } from "@/lib/projects";
import { homepageGraph } from "@/lib/schema";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { homeOgImages } from "@/lib/og-pages";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    type: "profile",
    images: homeOgImages,
  },
};

export default async function Home() {
  // Explicit Featured spine — not “all selected”; HaberAI / Money Guardian stay /work-only.
  const featured = getHomepageFeaturedProjects();

  const [live, ratings, npmInfos] = await Promise.all([
    getLiveStats(),
    getRatingsBySlug(featured),
    Promise.all(
      featured.map(async (p) => {
        const pkgName = npmPackageFromUrl(p.url);
        return pkgName ? getNpmInfo(pkgName) : null;
      }),
    ),
  ]);

  const ledger = featured.map((project, i) => ({
    project,
    rating: ratings[project.slug],
    weeklyDownloads: npmInfos[i]?.weeklyDownloads ?? null,
  }));

  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main">
        <HomeHero />
        <LiveSentence facts={live.facts} isLive={live.isLive} />
        <WorkLedger items={ledger} />
        <ProofTable />
        <WritingList />
        <WriteBand />
      </main>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homepageGraph()),
        }}
      />
    </div>
  );
}
