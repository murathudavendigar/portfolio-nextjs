import ImageWithFallback from "@/components/ImageWithFallback";
import { experiencesData } from "@/data/experiencesData";
import { formatExperienceDates } from "@/functions/formatExperienceDates";

export default function Experience() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-8 md:px-10">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Experience
      </p>
      <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
        Teaching, shipping, repeating
      </h2>

      <ol className="mt-10">
        {experiencesData.map((experience) => (
          <li
            key={`${experience.company}-${experience.title}-${experience.startDate}`}
            className="grid gap-4 border-t border-white/10 py-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-10 dark:border-gray-400/40">
            <p className="font-mono-ui text-[11px] uppercase tracking-wider text-gray-400 dark:text-gray-600">
              {formatExperienceDates(experience.startDate, experience.endDate)}
            </p>
            <div>
              <div className="flex items-start gap-3">
                {experience.companyImage ? (
                  <ImageWithFallback
                    src={experience.companyImage}
                    alt={`${experience.company} logo`}
                    width={40}
                    height={40}
                    fallback={experience.company.slice(0, 2)}
                    className="mt-0.5 h-10 w-10 rounded object-cover bg-white"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded bg-white/10 font-mono-ui text-[10px] uppercase tracking-wider text-[var(--accent-text)] dark:bg-gray-300/60">
                    {experience.company.slice(0, 2)}
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold leading-snug flex items-center gap-2 dark:text-gray-900">
                    {experience.title}
                    {experience.title.toLowerCase().includes("instructor") && (
                      <span className="inline-flex items-center rounded-full bg-[var(--accent-text)]/10 px-2 py-0.5 font-mono-ui text-[9px] uppercase tracking-wider text-[var(--accent-text)] dark:bg-[#CA3E47]/10 dark:text-[#CA3E47]">
                        Teaching
                      </span>
                    )}
                  </h3>
                  <p className="text-sm text-gray-300 dark:text-gray-700">
                    {experience.company}
                  </p>
                </div>
              </div>
              <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {experience.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
