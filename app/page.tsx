import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import Reveal from "@/components/Reveal";
import SocialProof from "@/components/SocialProof";
import WorkCard from "@/components/WorkCard";
import Capabilities from "@/components/Capabilities";
import ExperiencePreview from "@/components/ExperiencePreview";
import WritingPreview from "@/components/WritingPreview";
import ContactCta from "@/components/ContactCta";
import { getRatingsBySlug } from "@/lib/appStore";
import { getNpmInfo, npmPackageFromUrl } from "@/lib/npm";
import {
  getHomepageFeaturedProjects,
  getPublishedNpmCount,
  getSelectedProjects,
  getShippedIosCount,
} from "@/lib/projects";
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

const PROOF_STATS = (
  selectedCount: number,
  iosCount: number,
  npmCount: number,
) => [
  { value: String(selectedCount), label: "Shipped products & tools" },
  { value: String(iosCount), label: "iOS apps on the App Store" },
  { value: String(npmCount), label: "npm packages published" },
  { value: "NL", label: "Frontend instructor & co-founder, TemCraft Tech" },
];

export default async function Home() {
  // Explicit Featured spine — not “all selected”; HaberAI / Money Guardian stay /work-only.
  const featured = getHomepageFeaturedProjects();
  const [lead, ...rest] = featured;

  const stats = PROOF_STATS(
    getSelectedProjects().length,
    getShippedIosCount(),
    getPublishedNpmCount(),
  );

  const projectsToFetch = featured;

  const [ratings, npmStatsArray] = await Promise.all([
    getRatingsBySlug(projectsToFetch),
    Promise.all(
      projectsToFetch.map(async (p) => {
        const pkgName = npmPackageFromUrl(p.url);
        if (!pkgName) return { slug: p.slug, stats: null };
        const pkgStats = await getNpmInfo(pkgName);
        return { slug: p.slug, stats: pkgStats };
      }),
    ),
  ]);

  const npmStats = Object.fromEntries(
    npmStatsArray.filter((x) => x.stats).map((x) => [x.slug, x.stats]),
  );

  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main">
        <Hero />

        <ProofStrip stats={stats} />

        {/* Product proof before capability grid — brand → evidence → skills */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <Reveal>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Featured
            </p>
            <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
              Shipped apps and tools
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 dark:text-gray-700">
              The products I lead with. Full index — including earlier builds —
              on{" "}
              <Link
                href="/work"
                className="underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-[#CA3E47]">
                Work
              </Link>
              .
            </p>
          </Reveal>
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
            {lead && (
              <Reveal delay={0.08} className="lg:col-span-2">
                <WorkCard
                  project={lead}
                  lead
                  quiet
                  rating={ratings[lead.slug]}
                  npmStats={npmStats[lead.slug] || undefined}
                />
              </Reveal>
            )}
            {rest.map((project, i) => (
              <Reveal key={project.slug} delay={0.06 * (i + 1)}>
                <WorkCard
                  project={project}
                  quiet
                  rating={ratings[project.slug]}
                  npmStats={npmStats[project.slug] || undefined}
                />
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.12}>
            <div className="mt-10">
              <Link href="/work" className="btn-secondary">
                View all work
              </Link>
            </div>
          </Reveal>
        </section>

        <SocialProof />

        <Capabilities />

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
