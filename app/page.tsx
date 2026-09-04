import Hero from "@/components/Hero";
import WorkCard from "@/components/WorkCard";
import { getSelectedProjects } from "@/lib/projects";
import { homepageGraph } from "@/lib/schema";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import Link from "next/link";

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

export default function Home() {
  const [lead, ...rest] = getSelectedProjects().slice(0, 3);

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <Hero />

        <section className="max-w-6xl px-6 py-20 mx-auto">
          <p className="font-mono-ui text-center text-[11px] uppercase tracking-[0.22em] text-[#CA3E47]">
            Work
          </p>
          <h2 className="mt-3 text-center text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
            Selected work
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
            {lead && (
              <div className="lg:col-span-2">
                <WorkCard project={lead} lead />
              </div>
            )}
            <div className="flex flex-col gap-6 lg:h-full">
              {rest.map((project) => (
                <WorkCard
                  key={project.slug}
                  project={project}
                  compact
                  className="flex-1"
                />
              ))}
            </div>
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
