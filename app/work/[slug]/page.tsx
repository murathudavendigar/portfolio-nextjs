import WorkDetail from "@/components/WorkDetail";
import { appStoreIdFromUrl, getAppStoreInfo } from "@/lib/appStore";
import { getPlayStoreInfo, playStoreIdFromUrl } from "@/lib/playStore";
import { getNpmInfo, npmPackageFromUrl } from "@/lib/npm";
import { getProject, getProjects } from "@/lib/projects";
import { workSchema } from "@/lib/schema";
import { site, absoluteUrl, metaDescription } from "@/lib/site";
import { workOgImages } from "@/lib/og-pages";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 86400;

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
  const title = `${project.name} · ${project.category ?? "Case Study"}`;
  const description = metaDescription(project.description);
  return {
    title,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title: `${title} — ${site.shortName}`,
      description,
      url: absoluteUrl(`/work/${slug}`),
      type: "website",
      images: workOgImages(slug, project.name),
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

  const appStoreId = project.appStoreUrl
    ? appStoreIdFromUrl(project.appStoreUrl)
    : null;
  const appStoreInfo = appStoreId ? await getAppStoreInfo(appStoreId) : null;
  const playStoreId = project.playStoreUrl
    ? playStoreIdFromUrl(project.playStoreUrl)
    : null;
  const playStoreInfo = playStoreId ? await getPlayStoreInfo(playStoreId) : null;
  const npmName =
    project.language === "NPM" ? npmPackageFromUrl(project.url) : null;
  const npmInfo = npmName ? await getNpmInfo(npmName) : null;

  return (
    <div className="min-h-screen bg-ink font-custom text-white dark:bg-paper dark:text-gray-700">
      <main id="main">
        <WorkDetail
          project={project}
          appStoreInfo={appStoreInfo}
          playStoreInfo={playStoreInfo}
          npmInfo={npmInfo}
        />
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
