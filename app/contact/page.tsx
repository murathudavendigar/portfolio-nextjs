import Contact from "@/components/Contact";
import { getResumeHref } from "@/lib/resume";
import { contactPageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Murat Hüdavendigâr Öncü — frontend engineer based in the Netherlands, open to roles, freelance React/Next.js work, and teaching.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: `Contact — ${site.shortName}`,
    description:
      "Get in touch with Murat Hüdavendigâr Öncü — frontend engineer based in the Netherlands, open to roles, freelance React/Next.js work, and teaching.",
    url: `${site.url}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <div className="bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 min-h-screen font-custom">
      <main id="main">
        <Contact resumeHref={getResumeHref()} />
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
