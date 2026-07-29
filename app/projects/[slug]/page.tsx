import { getProject, getProjects } from "@/lib/projects";
import { projectSchema } from "@/lib/schema";
import { site, absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

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
  return {
    title: project.name,
    description: project.description,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: {
      title: `${project.name} — ${site.shortName}`,
      description: project.description,
      url: absoluteUrl(`/projects/${slug}`),
      type: "website",
      images: project.img
        ? [{ url: project.img }]
        : [{ url: site.defaultOgImage, width: 1200, height: 630 }],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 px-6 py-16 max-w-3xl mx-auto">
      <Link
        href="/#projects"
        className="underline hover:text-[#CA3E47] transition-colors">
        ← Back to projects
      </Link>
      <h1 className="text-3xl font-semibold mt-6">{project.name}</h1>
      <p className="mt-4 text-gray-300 dark:text-gray-700 leading-relaxed">
        {project.description}
      </p>
      <div className="mt-6 flex gap-4">
        {project.github && (
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-[#CA3E47]">
            GitHub
          </a>
        )}
        <a
          href={project.url}
          target="_blank"
          rel="noreferrer"
          className="underline hover:text-[#CA3E47]">
          {project.language === "NPM" ? "NPM Package" : "Live Demo"}
        </a>
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(projectSchema(project)),
        }}
      />
    </div>
  );
}
