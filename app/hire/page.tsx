import Hire from "@/components/Hire";
import { hirePageGraph } from "@/lib/schema";
import { site } from "@/lib/site";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hire",
  description:
    "How to work with Murat Hüdavendigâr Öncü — frontend roles, scoped React/Next.js work through TemCraft, and teaching. What to send and what happens next.",
  alternates: { canonical: "/hire" },
  openGraph: {
    title: `Hire — ${site.shortName}`,
    description:
      "How to work with Murat Hüdavendigâr Öncü — frontend roles, scoped product work, and teaching.",
    url: `${site.url}/hire`,
    type: "website",
  },
};

export default function HirePage() {
  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main">
        <Hire />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(hirePageGraph()),
        }}
      />
    </div>
  );
}
