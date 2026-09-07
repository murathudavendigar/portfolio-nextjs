"use client";

import WorkCover from "@/components/WorkCover";
import { Badge } from "@/components/ui/badge";
import { MagicCard } from "@/components/ui/magic-card";
import type { AppRating } from "@/lib/appStore";
import type { Projects as ProjectType } from "@/types";
import { useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

type WorkCardProps = {
  project: ProjectType;
  compact?: boolean;
  lead?: boolean;
  className?: string;
  rating?: AppRating;
};

export default function WorkCard({
  project,
  compact = false,
  lead = false,
  className = "",
  rating,
}: WorkCardProps) {
  // `useReducedMotion()` is null on the server, so the branch below can only be
  // taken once the client has mounted or SSR and the first client render differ.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const reduceMotion = useReducedMotion();
  const skipMagic = mounted && Boolean(reduceMotion);

  const coverHeight = lead
    ? "h-64 sm:h-80 lg:h-full lg:min-h-[22rem]"
    : compact
      ? "h-36"
      : "h-52 sm:h-56";

  const body = (
    <>
      <WorkCover
        project={project}
        className={coverHeight}
        priority={lead}
      />
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-center justify-between gap-2">
          <p className="font-mono-ui text-[10px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
            {project.language}
          </p>
          {rating && (
            <p className="font-mono-ui text-[10px] text-gray-400 dark:text-gray-600">
              ★ {rating.average.toFixed(1)}
            </p>
          )}
        </div>
        <h3 className="text-lg font-semibold leading-snug [text-wrap:balance] dark:text-gray-900">
          {project.name}
        </h3>
        <p
          className={`text-sm leading-relaxed text-gray-300 dark:text-gray-700 ${
            compact ? "line-clamp-2" : "line-clamp-3"
          }`}>
          {project.description}
        </p>
        {!compact && project.stack && project.stack.length > 0 && (
          <ul className="mt-auto flex flex-wrap gap-1.5 pt-3">
            {project.stack.slice(0, 3).map((item) => (
              <li key={item}>
                <Badge
                  variant="outline"
                  className="px-2 text-[10px] font-medium text-gray-400 dark:text-gray-600">
                  {item}
                </Badge>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );

  // Reduced motion: no spotlight and no pointer tracking, so the Link stays
  // the outermost element and keeps its own static border.
  if (skipMagic) {
    return (
      <Link
        href={`/work/${project.slug}`}
        className={`group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-[#CA3E47]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:border-gray-300 dark:bg-gray-200/30 ${className}`}>
        {body}
      </Link>
    );
  }

  // MagicCard owns the border, the radius and the clipping here. Its children
  // wrapper (`[&>div:last-child]`) needs `h-full` or the lead card's
  // `lg:h-full` cover collapses, and the Link's focus ring has to be inset
  // because MagicCard clips it. `hover:-translate-y-0.5` belongs on MagicCard
  // rather than the Link so the lift does not slide content inside the clip.
  return (
    <MagicCard
      gradientFrom="#CA3E47"
      gradientTo="#CA3E47"
      gradientColor="hsl(var(--secondary))"
      gradientOpacity={0.45}
      className={`h-full rounded-lg transition-transform duration-300 hover:-translate-y-0.5 [&>div:last-child]:h-full ${className}`}>
      <Link
        href={`/work/${project.slug}`}
        className="group flex h-full flex-col overflow-hidden rounded-lg bg-white/[0.03] transition duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#CA3E47] dark:bg-gray-200/30">
        {body}
      </Link>
    </MagicCard>
  );
}
