import { formatExperienceDates } from "@/functions/formatExperienceDates";
import { experiencesData } from "@/data/experiencesData";
import Link from "next/link";
import Reveal from "./Reveal";

export default function ExperiencePreview() {
  const topExperiences = experiencesData.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal>
        <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-6 dark:border-gray-400/40">
          <div>
            <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
              Background
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
              Experience
            </h2>
          </div>
          <Link
            href="/about"
            className="group hidden font-mono-ui text-xs uppercase tracking-wider text-[var(--accent-text)] transition-colors hover:text-white dark:hover:text-gray-900 sm:inline-flex">
            See full experience <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </Reveal>

      <ul className="mt-8 space-y-6">
        {topExperiences.map((experience, i) => (
          <Reveal key={`${experience.company}-${experience.startDate}`} delay={i * 0.05}>
            <li className="grid gap-3 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-10">
              <p className="font-mono-ui text-[11px] uppercase tracking-wider text-gray-400 sm:pt-1 dark:text-gray-600">
                {formatExperienceDates(experience.startDate, experience.endDate)}
              </p>
              <div>
                <h3 className="text-base font-medium leading-snug dark:text-gray-900">
                  {experience.title}
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-600">
                  {experience.company}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.2}>
        <div className="mt-10 sm:hidden">
          <Link
            href="/about"
            className="btn-secondary w-full justify-center">
            See full experience
          </Link>
        </div>
      </Reveal>
    </section>
  );
}
