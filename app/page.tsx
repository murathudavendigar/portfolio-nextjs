import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
import Capabilities from "@/components/Capabilities";
import ExperiencePreview from "@/components/ExperiencePreview";
import WritingPreview from "@/components/WritingPreview";
import ContactCta from "@/components/ContactCta";
import { getRatingsBySlug } from "@/lib/appStore";
import { getNpmInfo, npmPackageFromUrl } from "@/lib/npm";
import { getSelectedProjects, getPublishedNpmCount, getShippedIosCount } from "@/lib/projects";
import { homepageGraph } from "@/lib/schema";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import Link from "next/link";

export const revalidate = 86400;

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  description: site.description,
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    type: "profile",
    images: [{ url: site.defaultOgImage, width: 1200, height: 630 }],
  },
};

const PROOF_STATS = (selectedCount: number, iosCount: number, npmCount: number) => [
  { value: String(selectedCount), label: "Shipped products & tools" },
  { value: String(iosCount), label: "iOS apps on the App Store" },
  { value: String(npmCount), label: "npm packages published" },
  { value: "NL", label: "Frontend instructor & co-founder, TemCraft Tech" },
];

export default async function Home() {
  const selected = getSelectedProjects();
  const [lead, ...rest] = selected.slice(0, 5);
  
  const stats = PROOF_STATS(
    selected.length,
    getShippedIosCount(),
    getPublishedNpmCount(),
  );

  const projectsToFetch = [lead, ...rest].filter(Boolean);
  
  // Fetch App Store ratings and NPM stats in parallel
  const [ratings, npmStatsArray] = await Promise.all([
    getRatingsBySlug(projectsToFetch),
    Promise.all(
      projectsToFetch.map(async (p) => {
        const pkgName = npmPackageFromUrl(p.url);
        if (!pkgName) return { slug: p.slug, stats: null };
        const stats = await getNpmInfo(pkgName);
        return { slug: p.slug, stats };
      })
    )
  ]);

  const npmStats = Object.fromEntries(
    npmStatsArray.filter((x) => x.stats).map((x) => [x.slug, x.stats])
  );

  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <Hero />

        <ProofStrip stats={stats} />

        <Capabilities />

        <section className="max-w-6xl px-6 py-20 mx-auto">
          <Reveal className="text-center">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Work
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
              Selected projects
            </h2>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {lead && (
              <Reveal delay={0.1} className="lg:col-span-2">
                <WorkCard project={lead} lead rating={ratings[lead.slug]} npmStats={npmStats[lead.slug] || undefined} />
              </Reveal>
            )}
            {rest.map((project, i) => (
              <Reveal key={project.slug} delay={0.1 * (i + 1)}>
                <WorkCard
                  project={project}
                  rating={ratings[project.slug]}
                  npmStats={npmStats[project.slug] || undefined}
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="mt-12 flex justify-center">
              <Link href="/work" className="btn-secondary">
                View all work
              </Link>
            </div>
          </Reveal>
        </section>

        <ExperiencePreview />
        
        <WritingPreview />

        <ContactCta />
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
