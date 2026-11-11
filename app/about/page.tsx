import About from "@/components/About";
import Experience from "@/components/Experience";
import Skills from "@/components/Skills";
import { aboutPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import { pageOgImages } from "@/lib/og-pages";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About · Frontend Engineer in the Netherlands",
  description:
    "Murat Hüdavendigâr Öncü is a frontend engineer and co-founder of TemCraft Tech, based in the Netherlands, building web, mobile, and desktop products.",
  alternates: { canonical: "/about" },
  openGraph: {
    images: pageOgImages("about"),
    title: `About · Frontend Engineer in the Netherlands — ${site.shortName}`,
    description:
      "Murat Hüdavendigâr Öncü is a frontend engineer and co-founder of TemCraft Tech, based in the Netherlands, building web, mobile, and desktop products.",
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
