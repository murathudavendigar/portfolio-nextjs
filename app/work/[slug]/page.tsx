import WorkDetail from "@/components/WorkDetail";
import { getProject, getProjects } from "@/lib/projects";
import { workSchema } from "@/lib/schema";
import { site, absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return getProjects().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  const ogImage = project.img?.startsWith("/")
    ? project.img
    : project.img || site.defaultOgImage;
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${project.name} — ${site.shortName}`,
      description: project.description,
      url: absoluteUrl(`/work/${slug}`),
      type: "website",
      images: [{ url: ogImage }],
    },
  };
}

export default async function WorkDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main">
        <WorkDetail project={project} />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(workSchema(project)),
        }}
      />
    </div>
  );
}
