import WorkDeviceFrame from "@/components/WorkDeviceFrame";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getRelatedPosts } from "@/lib/blog";
import type { AppStoreInfo } from "@/lib/appStore";
import { npmStatsLine, type NpmInfo } from "@/lib/npm";
import {
  getAdjacentProjects,
  hasCaseStudy,
  hasWorkMedia,
  projectPrimaryCta,
} from "@/lib/projects";
import type { Projects as ProjectType } from "@/types";
import Link from "next/link";

type WorkDetailProps = {
  project: ProjectType;
  appStoreInfo?: AppStoreInfo | null;
  npmInfo?: NpmInfo | null;
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

function formatRatingLine(info: AppStoreInfo): string | null {
  if (!(info.ratingCount > 0 && info.averageRating)) return null;
  return `${info.averageRating.toFixed(1)} · ${info.ratingCount} rating${
    info.ratingCount === 1 ? "" : "s"
  }`;
}

export default function WorkDetail({
  project,
  appStoreInfo,
  npmInfo,
}: WorkDetailProps) {
  const primary = projectPrimaryCta(project);
  const sections = CASE_SECTIONS.filter(([, key]) => Boolean(project[key]));
  const caseStudy = hasCaseStudy(project);
  const secondaryLabel =
    project.appStoreUrl && project.url ? "Website" : null;
  const { prev, next } = getAdjacentProjects(project.slug);
  const relatedPosts = getRelatedPosts(project.stack);
  const npmStats = npmInfo ? npmStatsLine(npmInfo) : [];
  const showMedia = hasWorkMedia(project);

  const ratingLine = appStoreInfo ? formatRatingLine(appStoreInfo) : null;
  const appStoreMeta = appStoreInfo
    ? [
        appStoreInfo.version ? `v${appStoreInfo.version}` : null,
        formatUpdatedDate(appStoreInfo.lastUpdated) &&
          `updated ${formatUpdatedDate(appStoreInfo.lastUpdated)}`,
        appStoreInfo.languageCount > 1
          ? `${appStoreInfo.languageCount} languages`
          : null,
      ].filter(Boolean)
    : [];

  return (
    <article className="mx-auto max-w-5xl px-6 py-16 md:px-10 md:py-24">
      <Breadcrumb>
        <BreadcrumbList className="font-mono-ui gap-1.5 text-xs uppercase tracking-[0.16em] text-[var(--text-muted)] sm:gap-1.5">
          <BreadcrumbItem>
            <BreadcrumbLink
              asChild
              className="hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA3E47]">
              <Link href="/work">Work</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-gray-200 dark:text-gray-800">
              {project.name}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div
        className={`mt-10 grid gap-10 ${
          showMedia
            ? "lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start"
            : ""
        }`}>
        <header className="min-w-0">
          <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
            {project.language}
            {project.tier === "selected"
              ? " · Selected work"
              : " · Earlier build"}
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight [text-wrap:balance] sm:text-5xl dark:text-gray-900">
            {project.name}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed [text-wrap:pretty] text-gray-300 dark:text-gray-700">
            {project.description}
          </p>

          {ratingLine && (
            <p className="mt-4 font-mono-ui text-sm tabular-nums text-gray-200 dark:text-gray-800">
              <span aria-hidden>★ </span>
              {ratingLine}
            </p>
          )}

          {project.stack && project.stack.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li key={item}>
                  <Badge
                    variant="outline"
                    className="font-mono-ui border-white/15 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gray-300 dark:border-gray-400 dark:text-gray-700">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          )}

          {npmStats.length > 0 && (
            <p className="mt-4 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {npmStats.join(" · ")}
            </p>
          )}

          {appStoreMeta.length > 0 && (
            <p className="mt-2 font-mono-ui text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {appStoreMeta.join(" · ")}
            </p>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            {primary && (
              <a
                href={primary.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center rounded-lg bg-[#CA3E47] px-5 py-2.5 text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                {primary.label}
              </a>
            )}
            {secondaryLabel && (
              <a
                href={project.url}
                target="_blank"
                rel="noreferrer"
                className="heroButton min-h-11">
                {secondaryLabel}
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noreferrer"
                className="heroButton min-h-11">
                GitHub
              </a>
            )}
          </div>
        </header>

        {showMedia && (
          <div className="min-w-0 lg:sticky lg:top-24">
            <WorkDeviceFrame project={project} />
          </div>
        )}
      </div>

      {caseStudy && (
        <div className="mt-16 grid max-w-3xl gap-12">
          {sections.map(([label, key]) => (
            <section key={key}>
              <h2 className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
                {label}
              </h2>
              <p className="mt-3 text-[17px] leading-relaxed [text-wrap:pretty] text-gray-200 dark:text-gray-800">
                {project[key]}
              </p>
            </section>
          ))}
        </div>
      )}

      {relatedPosts.length > 0 && (
        <div className="mt-16 max-w-3xl border-t border-white/10 pt-10 dark:border-gray-300">
          <h2 className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
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
              className="group block min-h-11 hover:text-[var(--accent-text)] transition-colors">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
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
              className="group block min-h-11 text-left sm:text-right hover:text-[var(--accent-text)] transition-colors">
              <p className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
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
