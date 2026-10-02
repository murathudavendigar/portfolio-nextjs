"use client";

import WorkCover from "@/components/WorkCover";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import type { AppRating } from "@/lib/appStore";
import type { NpmInfo } from "@/lib/npm";
import { navigateWithViewTransition } from "@/lib/navigate-with-view-transition";
import type { Projects as ProjectType } from "@/types";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";

type WorkCardProps = {
  project: ProjectType;
  compact?: boolean;
  lead?: boolean;
  className?: string;
  rating?: AppRating;
  npmStats?: NpmInfo;
};

export default function WorkCard({
  project,
  compact = false,
  lead = false,
  className = "",
  rating,
  npmStats,
}: WorkCardProps) {
  // `useReducedMotion()` is null on the server, so the branch below can only be
  // taken once the client has mounted or SSR and the first client render differ.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduceMotion = useReducedMotion();
  const skipMagic = mounted && Boolean(reduceMotion);
  const router = useRouter();
  const href = `/work/${project.slug}`;

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }
    event.preventDefault();
    navigateWithViewTransition(href, (url) => router.push(url));
  };

  const coverHeight = lead
    ? "h-64 sm:h-72 lg:h-full lg:min-h-[20rem]"
    : compact
      ? "h-36"
      : "h-52 sm:h-56";

  const linkLayout = lead
    ? "group grid h-full overflow-hidden rounded-lg lg:grid-cols-2"
    : "group flex h-full flex-col overflow-hidden rounded-lg";

  const body = (
    <>
      <WorkCover project={project} className={coverHeight} priority={lead} />
      <div className="flex flex-1 flex-col gap-2 p-5 lg:justify-center">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono-ui flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
            {project.category || project.language}
            {npmStats?.weeklyDownloads && (
              <span className="lowercase tracking-normal text-[var(--text-muted)]">
                • {npmStats.weeklyDownloads.toLocaleString()} weekly dl
              </span>
            )}
          </p>
          {rating && (
            <p className="shrink-0 font-mono-ui text-[10px] tabular-nums text-[var(--text-muted)]">
              <span aria-hidden>★</span>{" "}
              <span className="sr-only">Rated </span>
              {rating.average.toFixed(1)}
              {rating.count > 0 && (
                <span>
                  {" "}
                  · {rating.count} rating{rating.count === 1 ? "" : "s"}
                </span>
              )}
            </p>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug [text-wrap:balance] transition-colors group-hover:text-[var(--accent-text)] dark:text-gray-900 sm:text-xl">
          {project.name}
        </h3>
        <p
          className={`text-sm leading-relaxed text-gray-300 dark:text-gray-700 ${
            compact ? "line-clamp-2" : "line-clamp-3"
          }`}>
          {project.description}
        </p>

        <div className="mt-auto pt-3 lg:mt-4">
          {!compact && project.stack && project.stack.length > 0 && (
            <ul className="mb-4 flex flex-wrap gap-1.5">
              {project.stack.slice(0, 4).map((item) => (
                <li key={item}>
                  <Badge
                    variant="outline"
                    className="px-2 text-[10px] font-medium text-[var(--text-muted)]">
                    {item}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
          <div className="font-mono-ui text-[10px] uppercase tracking-wider text-[var(--text-muted)] transition-colors group-hover:text-white dark:group-hover:text-gray-900">
            {project.tier === "selected"
              ? "View case study →"
              : "View project →"}
          </div>
        </div>
      </div>
    </>
  );

  if (skipMagic) {
    return (
      <Link
        href={href}
        onClick={onNavigate}
        className={`${linkLayout} border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-[#CA3E47]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:border-gray-300 dark:bg-gray-200/30 ${className}`}>
        {body}
      </Link>
    );
  }

  return (
    <MagicCard
      gradientFrom="#CA3E47"
      gradientTo="#CA3E47"
      gradientColor="hsl(var(--secondary))"
      gradientOpacity={0.45}
      className={`h-full rounded-lg transition-transform duration-300 hover:-translate-y-0.5 [&>div:last-child]:h-full ${className}`}>
      <Link
        href={href}
        onClick={onNavigate}
        className={`${linkLayout} bg-white/[0.03] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#CA3E47] dark:bg-gray-200/30`}>
        {body}
      </Link>
    </MagicCard>
  );
}
