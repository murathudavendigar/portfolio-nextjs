import Reveal from "@/components/Reveal";
import { getProject } from "@/lib/projects";
import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

const LAST_UPDATED = "2026-09-09";
const LAST_UPDATED_LABEL = "September 9, 2026";

export const metadata: Metadata = {
  title: "Now",
  description:
    "A maintained snapshot of the products Murat Hüdavendigâr Öncü ships, teaches, and writes about.",
  alternates: { canonical: "/now" },
  openGraph: {
    title: `Now — ${site.shortName}`,
    description:
      "A maintained snapshot of the products Murat Hüdavendigâr Öncü ships, teaches, and writes about.",
    url: `${site.url}/now`,
    type: "website",
  },
};

const CURRENT_PROJECTS = [
  "daily-skyline",
  "courai",
  "choose-game",
  "autoinvoice-pro",
];

export default function NowPage() {
  const projects = CURRENT_PROJECTS.map((slug) => getProject(slug)).filter(
    (project): project is NonNullable<typeof project> => Boolean(project),
  );

  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main" className="mx-auto max-w-4xl px-6 py-20 sm:py-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebPage",
              "@id": `${site.url}/now#webpage`,
              url: `${site.url}/now`,
              name: `Now — ${site.shortName}`,
              description: metadata.description,
              dateModified: LAST_UPDATED,
              isPartOf: { "@id": `${site.url}/#website` },
              about: { "@id": `${site.url}/#person` },
              inLanguage: "en",
            }),
          }}
        />
        <Reveal>
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
            /now
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl dark:text-gray-900">
            What I&apos;m focused on
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-gray-300 dark:text-gray-700">
            A maintained snapshot of shipped products, teaching, and writing.
            Last updated{" "}
            <time dateTime={LAST_UPDATED}>{LAST_UPDATED_LABEL}</time>.
          </p>
        </Reveal>

        <div className="mt-16 space-y-14">
          <Reveal>
            <section>
              <h2 className="border-b border-white/10 pb-4 text-xl font-semibold dark:border-gray-400/40 dark:text-gray-900">
                Maintaining shipped products
              </h2>
              <ul className="mt-6 space-y-6">
                {projects.map((project) => (
                  <li key={project.slug}>
                    <Link
                      href={`/work/${project.slug}`}
                      className="group block rounded-lg border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-[var(--accent-text)]/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent-text)] dark:border-gray-400/40 dark:bg-gray-200/30">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <h3 className="font-semibold text-white group-hover:text-[var(--accent-text)] dark:text-gray-900">
                          {project.name}
                        </h3>
                        <span className="font-mono-ui text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-600">
                          Shipped · maintaining
                        </span>
                      </div>
                      <p className="mt-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                        {project.description}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal delay={0.1}>
            <section>
              <h2 className="border-b border-white/10 pb-4 text-xl font-semibold dark:border-gray-400/40 dark:text-gray-900">
                Teaching
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                Helping frontend learners build stronger fundamentals through
                practical React, Next.js, and TypeScript projects at TemCraft
                Tech.
              </p>
            </section>
          </Reveal>

          <Reveal delay={0.2}>
            <section>
              <h2 className="border-b border-white/10 pb-4 text-xl font-semibold dark:border-gray-400/40 dark:text-gray-900">
                Writing
              </h2>
              <p className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                Writing clear notes about frontend architecture, JavaScript,
                React, and the lessons that only show up after shipping.
              </p>
              <Link
                href="/writing"
                className="mt-5 inline-block font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--accent-text)] hover:underline">
                Read the writing →
              </Link>
            </section>
          </Reveal>
        </div>
      </main>
    </div>
  );
}
