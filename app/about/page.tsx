import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import { aboutPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Murat Hüdavendigâr Öncü — frontend developer, co-founder of TemCraft Tech, and frontend instructor based in the Netherlands.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About — ${site.shortName}`,
    description:
      "Murat Hüdavendigâr Öncü — frontend developer, co-founder of TemCraft Tech, and frontend instructor based in the Netherlands.",
    url: `${site.url}/about`,
    type: "profile",
  },
};

export default function AboutPage() {
  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <About />
        <Experience />
        <Skills />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(aboutPageGraph()),
        }}
      />
    </div>
  );
}
