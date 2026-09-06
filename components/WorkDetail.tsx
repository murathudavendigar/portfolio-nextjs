import WorkCover from "@/components/WorkCover";
import { getRelatedPosts } from "@/lib/blog";
import type { AppStoreInfo } from "@/lib/appStore";
import {
  getAdjacentProjects,
  hasCaseStudy,
  projectPrimaryCta,
} from "@/lib/projects";
import type { Projects as ProjectType } from "@/types";
import Link from "next/link";

type WorkDetailProps = {
  project: ProjectType;
  appStoreInfo?: AppStoreInfo | null;
};

const CASE_SECTIONS = [
  ["Problem", "problem"],
  ["Approach", "approach"],
  ["Tradeoffs", "tradeoffs"],
  ["Outcome", "outcome"],
] as const;

function formatUpdatedDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function WorkDetail({ project, appStoreInfo }: WorkDetailProps) {
  const primary = projectPrimaryCta(project);
  const sections = CASE_SECTIONS.filter(([, key]) => Boolean(project[key]));
  const caseStudy = hasCaseStudy(project);
  const secondaryLabel =
    project.appStoreUrl && project.url ? "Website" : null;
  const hasImage = Boolean(project.img?.trim());
  const isIos = project.language === "iOS";
  const { prev, next } = getAdjacentProjects(project.slug);
  const relatedPosts = getRelatedPosts(project.stack);
  const npmPackage =
    project.language === "NPM"
      ? project.url.match(/npmjs\.com\/package\/([^/?#]+)/)?.[1]
      : undefined;

  const appStoreStats = appStoreInfo
    ? [
        appStoreInfo.ratingCount > 0 && appStoreInfo.averageRating
          ? `${appStoreInfo.averageRating.toFixed(1)}★ (${appStoreInfo.ratingCount} rating${appStoreInfo.ratingCount === 1 ? "" : "s"})`
          : null,
        appStoreInfo.version ? `v${appStoreInfo.version}` : null,
        formatUpdatedDate(appStoreInfo.lastUpdated) &&
          `updated ${formatUpdatedDate(appStoreInfo.lastUpdated)}`,
        appStoreInfo.languageCount > 1
          ? `${appStoreInfo.languageCount} languages`
          : null,
      ].filter(Boolean)
    : [];

  return (
    <article className="mx-auto max-w-3xl px-6 py-16 md:px-10 md:py-24">
      <Link
        href="/work"
        className="font-mono-ui text-xs uppercase tracking-[0.16em] text-gray-400 transition-colors hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA3E47] dark:text-gray-600">
        ← Work
      </Link>

      <header className="mt-10">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          {project.language}
          {project.tier === "selected" ? " · Selected work" : " · Earlier build"}
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight [text-wrap:balance] sm:text-5xl dark:text-gray-900">
          {project.name}
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
          {project.description}
        </p>

        {project.stack && project.stack.length > 0 && (
          <ul className="mt-6 flex flex-wrap gap-2">
            {project.stack.map((item) => (
              <li
                key={item}
                className="font-mono-ui rounded-full border border-white/15 px-3 py-1 text-[11px] uppercase tracking-wider text-gray-300 dark:border-gray-400 dark:text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        )}

        {npmPackage && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.shields.io/npm/dw/${npmPackage}?style=flat-square&label=weekly%20downloads&color=CA3E47&labelColor=211d1a`}
              alt={`${npmPackage} weekly npm downloads`}
              height={20}
              className="h-5 w-auto"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://img.shields.io/npm/dt/${npmPackage}?style=flat-square&label=total%20downloads&color=CA3E47&labelColor=211d1a`}
              alt={`${npmPackage} total npm downloads`}
              height={20}
              className="h-5 w-auto"
            />
          </div>
        )}

        {appStoreStats.length > 0 && (
          <p className="mt-4 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-gray-400 dark:text-gray-600">
            {appStoreStats.join(" · ")}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          {primary && (
            <a
              href={primary.href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center rounded-full bg-[#CA3E47] px-5 py-2.5 text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
              {primary.label}
            </a>
          )}
          {secondaryLabel && (
            <a
              href={project.url}
              target="_blank"
              rel="noreferrer"
              className="heroButton">
              {secondaryLabel}
            </a>
          )}
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="heroButton">
              GitHub
            </a>
          )}
        </div>
      </header>

      {hasImage && (
        <figure className="mt-14 overflow-hidden rounded-lg border border-white/10 bg-black/40 dark:border-gray-300 dark:bg-gray-200/40">
          <WorkCover
            project={project}
            priority
            decorative={false}
            variant="detail"
            className={
              isIos && !project.coverFit
                ? "mx-auto aspect-[9/19.5] w-full max-w-[280px] sm:max-w-[320px]"
                : project.coverFit === "contain"
                  ? "mx-auto aspect-square w-full max-w-[240px]"
                  : "min-h-[220px] sm:min-h-[320px] lg:min-h-[380px]"
            }
          />
        </figure>
      )}

      {caseStudy && (
        <div className="mt-16 space-y-12">
          {sections.map(([label, key]) => (
            <section key={key}>
              <h2 className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
                {label}
              </h2>
              <p className="mt-3 max-w-2xl text-[17px] leading-relaxed [text-wrap:pretty] text-gray-200 dark:text-gray-800">
                {project[key]}
              </p>
            </section>
          ))}
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-16 border-t border-white/10 pt-10 dark:border-gray-300">
          <h2 className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600">
            Related writing
          </h2>
          <ul className="mt-4 space-y-3">
            {relatedPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/writing/${post.slug}`}
                  className="text-base font-medium underline decoration-white/30 underline-offset-4 transition-colors hover:text-[var(--accent-text)] hover:decoration-[var(--accent-text)] dark:text-gray-900">
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      {(prev || next) && (
        <nav
          aria-label="More work"
          className="mt-20 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-2 dark:border-gray-300">
          {prev ? (
            <Link
              href={`/work/${prev.slug}`}
              className="group block hover:text-[var(--accent-text)] transition-colors">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Previous
              </p>
              <p className="mt-1 text-lg font-semibold group-hover:text-[var(--accent-text)] dark:text-gray-900">
                {prev.name}
              </p>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link
              href={`/work/${next.slug}`}
              className="group block text-left sm:text-right hover:text-[var(--accent-text)] transition-colors">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Next
              </p>
              <p className="mt-1 text-lg font-semibold group-hover:text-[var(--accent-text)] dark:text-gray-900">
                {next.name}
              </p>
            </Link>
          )}
        </nav>
      )}
    </article>
  );
}
