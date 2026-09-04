import Projects from "@/components/Projects";
import { getProjects } from "@/lib/projects";
import { workIndexSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Case studies and shipped projects by Murat Hüdavendigâr Öncü — iOS, React, Next.js, and TypeScript.",
  alternates: { canonical: "/work" },
  openGraph: {
    title: `Work — ${site.shortName}`,
    description:
      "Case studies and shipped projects by Murat Hüdavendigâr Öncü — iOS, React, Next.js, and TypeScript.",
    url: `${site.url}/work`,
    type: "website",
  },
};

export default function WorkIndexPage() {
  const projects = getProjects();

  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
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
