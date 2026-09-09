import { CAPABILITIES } from "@/data/capabilitiesData";
import Reveal from "./Reveal";

export default function Capabilities() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="text-center">
        <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
          What I do
        </p>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl dark:text-gray-900">
          Capabilities
        </h2>
      </Reveal>
      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {CAPABILITIES.map((cap, i) => (
          <Reveal key={cap.label} delay={0.08 * i}>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 dark:border-gray-400/40 dark:bg-gray-200/30 dark:hover:border-gray-400/60">
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
