import Reveal from "@/components/Reveal";
import { HIRE_ENGAGEMENTS, HIRE_STEPS } from "@/data/hire";

/**
 * The two ways to work together and what happens after you write.
 * Shown under the form on /contact (it was the /hire page; /hire now 308s
 * to /contact#how-we-work).
 */
export default function HowWeWork() {
  return (
    <section
      id="how-we-work"
      aria-labelledby="how-we-work-title"
      className="mx-auto max-w-6xl scroll-mt-24 px-6 pb-16 md:px-10 md:pb-24">
      <Reveal>
        <div className="border-t border-white/10 pt-16 dark:border-gray-400/40">
          <p className="text-[13px] text-[var(--accent-text)]">
            How we work
          </p>
          <h2
            id="how-we-work-title"
            className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight [text-wrap:balance] sm:text-3xl dark:text-gray-900">
            A frontend role, or scoped product work
          </h2>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        {HIRE_ENGAGEMENTS.map((engagement, index) => (
          <Reveal key={engagement.id} delay={Math.min(index, 2) * 0.05}>
            <article className="flex h-full flex-col border-t border-white/10 pt-6 dark:border-gray-400/40">
              <p className="text-[13px] text-[var(--accent-text)]">
                {engagement.id}
              </p>
              <h3 className="mt-2 text-xl font-semibold tracking-tight dark:text-gray-900">
                {engagement.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {engagement.summary}
              </p>
              <div className="mt-6">
                <p className="text-[13px] text-[var(--text-muted)]">
                  Good fit when
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                  {engagement.fit.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6">
                <p className="text-[13px] text-[var(--text-muted)]">
                  Send me
                </p>
                <ul className="mt-2 space-y-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                  {engagement.send.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              {engagement.link ? (
                <a
                  href={engagement.link.href}
                  target="_blank"
                  rel="noopener"
 className="mt-6 inline-flex text-[13px] text-[var(--accent-text)] underline-offset-4 hover:underline">
                  {engagement.link.label} →
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : null}
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-20">
        <h3 className="text-2xl font-semibold tracking-tight dark:text-gray-900">
          What happens next
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-gray-300 dark:text-gray-700">
          A simple process — no forms maze, no fake scarcity.
        </p>
        <ol className="mt-10 grid gap-8 sm:grid-cols-3">
          {HIRE_STEPS.map((item) => (
            <li
              key={item.step}
              className="border-t border-white/10 pt-6 dark:border-gray-400/40">
              <p className="text-[13px] text-[var(--accent-text)]">
                Step {item.step}
              </p>
              <h4 className="mt-2 text-lg font-semibold dark:text-gray-900">
                {item.title}
              </h4>
              <p className="mt-2 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {item.detail}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
