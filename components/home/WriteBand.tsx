import Link from "next/link";

/**
 * The closing call to action: the whole accent band is one link to
 * /contact, with the action itself as the word.
 */
export default function WriteBand() {
  return (
    <section aria-labelledby="write-title">
      <Link
        href="/contact"
        className="group relative block overflow-hidden bg-[#CA3E47] text-white transition-colors duration-150 hover:bg-white hover:text-[#CA3E47] focus-visible:outline focus-visible:outline-4 focus-visible:-outline-offset-8 focus-visible:outline-white dark:hover:bg-gray-900 dark:hover:text-white">
        <div className="mx-auto flex min-h-[46svh] max-w-6xl flex-col justify-between px-6 pb-4 pt-8 md:min-h-[60svh] md:px-10 md:pt-12">
          <div className="flex items-start justify-between gap-6">
            <p className="max-w-md text-2xl font-semibold leading-snug [text-wrap:balance]">
              Frontend roles or scoped product work. I usually reply within a
              couple of days.
            </p>
            <svg
              aria-hidden
              viewBox="0 0 48 48"
              className="h-8 w-8 shrink-0 transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 md:h-12 md:w-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="square">
              <path d="M12 36 L36 12 M16 12 H36 V32" />
            </svg>
          </div>
          <h2
            id="write-title"
            className="text-[clamp(6rem,24vw,21rem)] font-extrabold leading-[0.78] tracking-[-0.06em] transition-colors duration-150 dark:group-hover:text-[#eb7d85]">
            Write
          </h2>
        </div>
      </Link>
    </section>
  );
}
