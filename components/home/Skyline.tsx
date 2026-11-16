import type { Projects as ProjectType } from "@/types";
import Link from "next/link";

/**
 * The live products drawn as a Daily Skyline row: one building per product,
 * each a link to its case study. Heights only shape the skyline; they don't
 * rank anything.
 */

/** Heights 1–5, like a row of the puzzle. Cycles if there are more products. */
const HEIGHTS = [3, 5, 2, 4, 1, 4, 2, 5];

/** One row of two windows per floor, some lit (deterministic). */
function windows(height: number, index: number) {
  return Array.from({ length: height * 2 }, (_, w) => ({
    lit: (w * 7 + index * 3) % 5 === 0,
    // each lit window gets its own slow clock
    duration: 6 + ((w + index) % 5) * 1.3,
    delay: -((w * 13 + index * 7) % 9),
  }));
}

export default function Skyline({ projects }: { projects: ProjectType[] }) {
  const heights = projects.map((_, i) => HEIGHTS[i % HEIGHTS.length]);

  return (
    <nav aria-labelledby="skyline-title" className="mt-14 md:mt-16">
      <p id="skyline-title" className="text-[15px] text-[var(--text-muted)]">
        <span className="font-semibold text-white dark:text-gray-900">
          {projects.length} products live today.
        </span>{" "}
        Pick a building.
      </p>
      <ul className="mt-5 flex items-end gap-2 sm:gap-3">
          {projects.map((project, i) => {
            const h = heights[i];
            return (
              <li key={project.slug} className="min-w-0 flex-1">
                <Link
                  href={`/work/${project.slug}`}
                  className="group block focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#CA3E47]">
                  <span
                    aria-hidden
                    style={{
                      height: `calc(${h} * var(--floor))`,
                      gridTemplateRows: `repeat(${h}, minmax(0, 1fr))`,
                      ["--i" as string]: i,
                    }}
                    className="skyline-building grid grid-cols-2 gap-x-[24%] gap-y-[calc(var(--floor)*0.38)] overflow-hidden bg-gray-200 px-[20%] py-[calc(var(--floor)*0.22)] transition-[transform,background-color] duration-300 [--floor:1.25rem] group-hover:-translate-y-1.5 group-hover:bg-[#CA3E47] group-focus-visible:bg-[#CA3E47] sm:[--floor:1.5rem] lg:[--floor:1.75rem] dark:bg-gray-800 dark:group-hover:bg-[#CA3E47]">
                    {windows(h, i).map((win, w) => (
                      <span
                        key={w}
                        data-lit={win.lit ? "" : undefined}
                        style={
                          win.lit
                            ? {
                                ["--d" as string]: `${win.duration}s`,
                                ["--w" as string]: `${win.delay}s`,
                              }
                            : undefined
                        }
                        className={`skyline-window block ${
                          win.lit
                            ? "bg-[#f6d27a]"
                            : "bg-ink/80 dark:bg-paper/85"
                        }`}
                      />
                    ))}
                  </span>
                  <span className="mt-2.5 hidden h-[2.5em] text-[13px] leading-tight sm:block text-[var(--text-muted)] transition-colors group-hover:text-white dark:group-hover:text-gray-900">
                    {project.name}
                  </span>
                  <span className="sr-only sm:hidden">{project.name}</span>
                </Link>
              </li>
            );
          })}
      </ul>
      {/* Phones: names in skyline order; the buildings above are the links. */}
      <p
        aria-hidden
        className="mt-3 text-[13px] leading-relaxed text-[var(--text-muted)] sm:hidden">
        {projects.map((p) => p.name).join(" · ")}
      </p>
    </nav>
  );
}
