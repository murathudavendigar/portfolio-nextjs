import Projects from "@/components/Projects";
import { getProjects } from "@/lib/projects";
import { workIndexSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { pageOgImages } from "@/lib/og-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work · Web, Mobile and Desktop Case Studies",
  description:
    "Case studies and shipped projects by Murat Hüdavendigâr Öncü: iOS and Android apps, desktop tools, npm packages, and web products in React and Next.js.",
  alternates: { canonical: "/work" },
  openGraph: {
    images: pageOgImages("work"),
    title: `Work · Web, Mobile and Desktop Case Studies — ${site.shortName}`,
    description:
      "Case studies and shipped projects by Murat Hüdavendigâr Öncü: iOS and Android apps, desktop tools, npm packages, and web products in React and Next.js.",
    url: `${site.url}/work`,
    type: "website",
  },
};

export default function WorkIndexPage() {
  const projects = getProjects();

  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <Projects />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workIndexSchema(projects)),
        }}
      />
    </div>
  );
}
