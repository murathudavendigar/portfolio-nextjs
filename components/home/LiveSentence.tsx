import Reveal from "@/components/Reveal";
import type { LiveFacts } from "@/lib/liveStats";
import { formatPostDate } from "@/lib/utils";
import type { ReactNode } from "react";

/** A figure in full ink inside the softer sentence. */
function Fig({ children }: { children: ReactNode }) {
  return (
    <span className="whitespace-nowrap font-semibold text-white dark:text-gray-900">
      {children}
    </span>
  );
}

/**
 * The at-a-glance numbers written as one sentence instead of a stat strip.
 * Every figure comes from the App Store or npm (lib/liveStats.ts); a clause
 * is dropped when its number is missing.
 */
export default function LiveSentence({
  facts,
  isLive,
}: {
  facts: LiveFacts;
  isLive: boolean;
}) {
  const { liveProducts, rating, downloads, latest } = facts;

  const clauses: ((first: boolean) => ReactNode)[] = [];
  const the = (first: boolean) => (first ? "The" : "the");
  if (rating) {
    clauses.push((first) => (
      <>
        {the(first)} App Store apps average <Fig>{rating.average.toFixed(1)}</Fig> from{" "}
        <Fig>
          {rating.count}&nbsp;{rating.count === 1 ? "rating" : "ratings"}
        </Fig>
      </>
    ));
  }
  if (downloads) {
    clauses.push((first) => (
      <>
        {the(first)} npm tools have <Fig>{downloads.toLocaleString("en-US")}&nbsp;downloads</Fig>
      </>
    ));
  }
  if (latest) {
    clauses.push((first) => (
      <>
        {the(first)} latest release,{" "}
        <Fig>
          {latest.name}
          {latest.version ? ` ${latest.version}` : ""}
        </Fig>
        , shipped on{" "}
        <Fig>{formatPostDate(latest.date).replace(/ \d{4}$/, "")}</Fig>
      </>
    ));
  }

  return (
    <section
      aria-labelledby="at-a-glance"
      className="bg-inkDeep dark:bg-paperDeep">
      <div className="mx-auto max-w-6xl px-6 py-24 md:px-10 md:py-32">
        <h2 id="at-a-glance" className="sr-only">
          At a glance
        </h2>
        <Reveal>
          <p className="max-w-5xl text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.3] tracking-tight [text-wrap:pretty] text-[var(--text-muted)]">
            <Fig>{liveProducts}&nbsp;products</Fig> are live today
            {clauses.length > 0 ? ". " : "."}
            {clauses.map((clause, i) => (
              <span key={i}>
                {clause(i === 0)}
                {i < clauses.length - 2
                  ? ", "
                  : i === clauses.length - 2
                    ? ", and "
                    : "."}
              </span>
            ))}
          </p>
        </Reveal>
        {isLive ? (
          <Reveal delay={0.1}>
            <p className="mt-8 flex items-center gap-2.5 text-[15px] text-[var(--text-muted)]">
              <span
                aria-hidden
                className="home-live-dot inline-block h-2 w-2 rounded-full bg-emerald-500"
              />
              Read from the App Store and npm, refreshed every day.
            </p>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
