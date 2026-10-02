import { CAPABILITIES } from "@/data/capabilitiesData";
import Reveal from "./Reveal";

export default function Capabilities() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:py-20">
      <Reveal>
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          What I do
        </p>
        <h2 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
          Product UI, mobile, and the backend it needs
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-10 sm:grid-cols-2">
        {CAPABILITIES.map((cap, i) => (
          <Reveal key={cap.label} delay={0.06 * i}>
            <div className="border-t border-white/10 pt-5 dark:border-gray-400/40">
              <h3 className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[var(--accent-text)]">
                {cap.label}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
                {cap.description}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
