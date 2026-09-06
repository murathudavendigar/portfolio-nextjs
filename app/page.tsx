import Hero from "@/components/Hero";
import ProofStrip from "@/components/ProofStrip";
import Reveal from "@/components/Reveal";
import WorkCard from "@/components/WorkCard";
import { getRatingsBySlug } from "@/lib/appStore";
import { getSelectedProjects } from "@/lib/projects";
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
  const [lead, ...rest] = selected.slice(0, 3);
  const iosCount = selected.filter((p) => p.language === "iOS").length;
  const npmCount = selected.filter((p) => p.language === "NPM").length;
  const stats = PROOF_STATS(selected.length, iosCount, npmCount);
  const ratings = await getRatingsBySlug([lead, ...rest].filter(Boolean));

  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <Hero />

        <ProofStrip stats={stats} />

        <section className="max-w-6xl px-6 py-20 mx-auto">
          <Reveal className="text-center">
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Work
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
              Selected work
            </h2>
          </Reveal>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
            {lead && (
              <Reveal delay={0.1} className="lg:col-span-2">
                <WorkCard project={lead} lead rating={ratings[lead.slug]} />
              </Reveal>
            )}
            <Reveal delay={0.2} className="flex flex-col gap-6 lg:h-full">
              {rest.map((project) => (
                <WorkCard
                  key={project.slug}
                  project={project}
                  compact
                  className="flex-1"
                  rating={ratings[project.slug]}
                />
              ))}
            </Reveal>
          </div>
          <div className="flex justify-center mt-10">
            <Link href="/work" className="heroButton">
              See all work
            </Link>
          </div>
        </section>
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
