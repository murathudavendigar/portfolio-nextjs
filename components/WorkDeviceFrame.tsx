import WorkCover from "@/components/WorkCover";
import { Iphone } from "@/components/ui/iphone";
import { Safari } from "@/components/ui/safari";
import { getWorkMockupKind, hasWorkMedia } from "@/lib/projects";
import type { Projects as ProjectType } from "@/types";

function displayHost(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url.replace(/^https?:\/\//, "").split("/")[0];
  }
}

export default function WorkDeviceFrame({
  project,
}: {
  project: ProjectType;
}) {
  if (!hasWorkMedia(project)) return null;

  const kind = getWorkMockupKind(project);
  const isIos = project.language === "iOS";

  // Iphone and Safari render their own decorative <img>, so the accessible name
  // has to come from the figcaption instead of an alt attribute.
  if (kind === "iphone") {
    return (
      <figure className="mt-14">
        <Iphone
          src={project.img}
          className="mx-auto w-full max-w-[280px] sm:max-w-[320px]"
        />
        <figcaption className="sr-only">{project.name} screenshot</figcaption>
      </figure>
    );
  }

  if (kind === "safari") {
    return (
      <figure className="mt-14">
        <Safari
          imageSrc={project.img}
          url={displayHost(project.url)}
          className="w-full"
        />
        <figcaption className="sr-only">{project.name} screenshot</figcaption>
      </figure>
    );
  }

  return (
    <figure className="mt-14 overflow-hidden rounded-lg border border-white/10 bg-black/40 dark:border-gray-300 dark:bg-gray-200/40">
      <WorkCover
        project={project}
        priority
        decorative={false}
        variant="detail"
        className={
          isIos
            ? "mx-auto aspect-[9/19.5] w-full max-w-[280px] sm:max-w-[320px]"
            : project.coverFit === "contain"
              ? "mx-auto aspect-square w-full max-w-[240px]"
              : "min-h-[220px] sm:min-h-[320px] lg:min-h-[380px]"
        }
      />
    </figure>
  );
}
