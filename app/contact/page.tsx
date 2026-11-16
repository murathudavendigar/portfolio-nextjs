import Contact from "@/components/Contact";
import HowWeWork from "@/components/HowWeWork";
import { getResumeHref } from "@/lib/resume";
import { contactPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import { pageOgImages } from "@/lib/og-pages";
import type { Metadata } from "next";

const DESCRIPTION =
  "Contact Murat Hüdavendigâr Öncü, frontend engineer in the Netherlands, about frontend roles or scoped React and Next.js work through TemCraft Tech.";

export const metadata: Metadata = {
  title: "Contact · Hire Me or Start a Project",
  description: DESCRIPTION,
  alternates: { canonical: "/contact" },
  openGraph: {
    images: pageOgImages("contact"),
    title: `Contact · Hire Me or Start a Project — ${site.shortName}`,
    description: DESCRIPTION,
    url: `${site.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-ink dark:bg-paper text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <Contact resumeHref={getResumeHref()} />
        <HowWeWork />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactPageGraph()),
        }}
      />
    </div>
  );
}
