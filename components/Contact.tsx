"use client";
import ContactFormPanel from "@/components/ContactFormPanel";
import { SOCIAL_LINKS } from "@/lib/nav";
import { introBookingHref, site } from "@/lib/site";
import Link from "next/link";

const Contact = ({ resumeHref }: { resumeHref?: string | null }) => {
  const bookingHref = introBookingHref();
  const bookingIsCal = Boolean(site.calUrl);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
      <p className="font-mono-ui text-[11px] uppercase tracking-[0.22em] text-[var(--accent-text)]">
        Contact
      </p>
      <h1 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight [text-wrap:balance] sm:text-4xl md:text-5xl dark:text-gray-900">
        Write if you want to hire, ship, or teach.
      </h1>

      <div className="mt-12 grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="space-y-8">
          <p className="max-w-md text-base leading-relaxed text-gray-300 dark:text-gray-700">
            Frontend roles in the Netherlands or remote, scoped React / Next.js
            work through TemCraft Tech, and teaching. Prefer a short call? Book
            an intro — or send a note with what you need.
          </p>

          <ul className="max-w-md space-y-3 text-sm leading-relaxed text-gray-300 dark:text-gray-700">
            <li>
              <span className="font-medium text-white dark:text-gray-900">
                Hire —
              </span>{" "}
              frontend / Next.js roles (NL, EU, remote).
            </li>
            <li>
              <span className="font-medium text-white dark:text-gray-900">
                Build —
              </span>{" "}
              product UI, MVPs, and ownership through TemCraft.
            </li>
            <li>
              <span className="font-medium text-white dark:text-gray-900">
                Teach —
              </span>{" "}
              React / Next.js workshops and mentoring.
            </li>
          </ul>

          <p className="max-w-md text-sm leading-relaxed text-gray-400 dark:text-gray-600">
            Want the full process first?{" "}
            <Link
              href="/hire"
              className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-[var(--accent-text)]">
              See how we work
            </Link>
            .
          </p>

          <a
            href={bookingHref}
            {...(bookingIsCal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            className="inline-flex min-h-11 items-center rounded-lg bg-[#CA3E47] px-5 py-2.5 text-sm font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            Book a 15-min intro
          </a>

          <dl className="space-y-4">
            <div>
              <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Email
              </dt>
              <dd className="mt-1">
                <a
                  href={`mailto:${site.email}`}
                  className="text-lg hover:text-[var(--accent-text)] transition-colors">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Location
              </dt>
              <dd className="mt-1 text-lg">Netherlands</dd>
            </div>
            {resumeHref ? (
              <div>
                <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                  Résumé
                </dt>
                <dd className="mt-1">
                  <a
                    href={resumeHref}
                    download
                    className="text-lg hover:text-[var(--accent-text)] transition-colors">
                    Download PDF
                  </a>
                </dd>
              </div>
            ) : null}
            <div>
              <dt className="font-mono-ui text-[11px] uppercase tracking-[0.16em] text-gray-400 dark:text-gray-600">
                Social
              </dt>
              <dd className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-sm">
                {SOCIAL_LINKS.map((social) => (
                  <a
                    key={social.url}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[var(--accent-text)] transition-colors">
                    {social.label}
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>

        <ContactFormPanel />
      </div>
    </section>
  );
};

export default Contact;
