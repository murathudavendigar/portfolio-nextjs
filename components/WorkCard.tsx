import WorkCover from "@/components/WorkCover";
import type { AppRating } from "@/lib/appStore";
import type { Projects as ProjectType } from "@/types";
import Link from "next/link";

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
  const coverHeight = lead
    ? "h-64 sm:h-80 lg:h-full lg:min-h-[22rem]"
    : compact
      ? "h-36"
      : "h-52 sm:h-56";

  return (
    <Link
      href={`/work/${project.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.03] transition duration-300 hover:-translate-y-0.5 hover:border-[#CA3E47]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:border-gray-300 dark:bg-gray-200/30 ${className}`}>
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
              <li
                key={item}
                className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] font-medium text-gray-400 dark:border-gray-300 dark:text-gray-600">
                {item}
              </li>
            ))}
          </ul>
        )}
      </div>
    </Link>
  );
}
