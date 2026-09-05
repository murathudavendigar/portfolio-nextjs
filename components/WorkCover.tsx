import type { Projects as ProjectType } from "@/types";
import Image from "next/image";

type WorkCoverProps = {
  project: ProjectType;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
  variant?: "card" | "detail";
};

export default function WorkCover({
  project,
  className = "",
  priority = false,
  decorative = true,
  variant = "card",
}: WorkCoverProps) {
  const src = project.img?.trim();
  const isIos = project.language === "iOS";
  const isLocal = Boolean(src?.startsWith("/"));
  const alt = decorative ? "" : `${project.name} screenshot`;
  const contain =
    project.coverFit === "contain" ||
    (variant === "detail" && isIos && !project.coverFit);

  if (!src) {
    return (
      <div
        className={`flex flex-col justify-end gap-2 bg-inkDeep px-5 py-4 dark:bg-gray-200/50 ${className}`}>
        <span className="font-mono-ui text-[10px] uppercase tracking-[0.2em] text-[var(--accent-text)]">
          {project.language}
        </span>
        <span className="text-lg font-semibold leading-tight [text-wrap:balance] dark:text-gray-900">
          {project.name}
        </span>
      </div>
    );
  }

  const imageClass = `transition-transform duration-500 group-hover:scale-[1.04] ${
    contain ? "object-contain object-center p-4 sm:p-6" : "object-cover"
  }`;

  return (
    <div
      className={`relative overflow-hidden ${
        contain
          ? "bg-inkDeep"
          : "bg-black/25 dark:bg-gray-200/40"
      } ${className}`}>
      {isLocal ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={
            variant === "detail"
              ? "(max-width: 1024px) 90vw, 420px"
              : "(max-width: 1024px) 100vw, 40vw"
          }
          className={imageClass}
          priority={priority}
        />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`h-full w-full ${imageClass}`}
          loading={priority ? "eager" : "lazy"}
        />
      )}
    </div>
  );
}
