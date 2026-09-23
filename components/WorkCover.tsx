import { Iphone } from "@/components/ui/iphone";
import { Safari } from "@/components/ui/safari";
import { getWorkMockupKind } from "@/lib/projects";
import type { Projects as ProjectType } from "@/types";
import Image from "next/image";

type WorkCoverProps = {
  project: ProjectType;
  className?: string;
  priority?: boolean;
  decorative?: boolean;
  variant?: "card" | "detail";
};

function displayHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

/**
 * Unified card media language:
 * - iOS → phone bezel (or contain screenshot if already device-shaped)
 * - Web/PWA → Safari chrome with product UI
 * - Desktop / npm → inset product art on inkDeep (never third-party OG alone)
 * Same aspect well, radius, and background for every featured card.
 */
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
  const kind = getWorkMockupKind(project);
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

  // Card variant: one media well + frame language per project type
  if (variant === "card") {
    const well = `relative overflow-hidden bg-inkDeep dark:bg-gray-200/40 ${className}`;

    if (kind === "iphone") {
      return (
        <div className={`${well} flex items-end justify-center px-5 pt-5 sm:px-6 sm:pt-6`}>
          <Iphone
            src={src}
            className="w-[58%] max-w-[190px] transition-transform duration-500 group-hover:scale-[1.03] sm:max-w-[210px]"
          />
        </div>
      );
    }

    if (kind === "safari") {
      return (
        <div className={`${well} flex items-center justify-center p-4 sm:p-5`}>
          <Safari
            imageSrc={src}
            url={displayHost(project.url)}
            className="w-full max-w-md transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      );
    }

    // Desktop window / terminal / already-framed phone art
    const imageClass =
      contain || project.language === "NPM" || project.language === "Electron"
        ? "object-contain object-center p-5 sm:p-6"
        : isIos
          ? "object-contain object-bottom p-4 sm:p-5"
          : "object-cover object-top";

    return (
      <div className={well}>
        {isLocal ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className={`transition-transform duration-500 group-hover:scale-[1.03] ${imageClass}`}
            priority={priority}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt}
            className={`h-full w-full transition-transform duration-500 group-hover:scale-[1.03] ${imageClass}`}
            loading={priority ? "eager" : "lazy"}
          />
        )}
      </div>
    );
  }

  // Detail variant — flat media (device chrome lives in WorkDeviceFrame)
  const imageClass = `transition-transform duration-500 group-hover:scale-[1.04] ${
    contain ? "object-contain object-center p-4 sm:p-6" : "object-cover"
  }`;

  return (
    <div
      className={`relative overflow-hidden ${
        contain ? "bg-inkDeep" : "bg-black/25 dark:bg-gray-200/40"
      } ${className}`}>
      {isLocal ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 90vw, 420px"
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
