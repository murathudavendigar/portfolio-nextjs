import { site } from "@/lib/site";
import {
  CodeBracketIcon,
  HomeIcon,
  NewspaperIcon,
} from "@heroicons/react/24/solid";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main
      id="main"
      className="flex min-h-screen flex-col items-center justify-center gap-6 bg-ink px-6 py-20 text-center text-white dark:bg-paper dark:text-gray-700">
      <p className="font-mono text-sm uppercase tracking-[6px] text-[var(--accent-text)]">
        Error 404
      </p>

      <h1 className="text-6xl font-bold tracking-tight md:text-8xl">
        404
      </h1>

      <div className="max-w-md space-y-2">
        <h2 className="text-xl font-semibold md:text-2xl">
          This route doesn&apos;t exist.
        </h2>
        <p className="text-gray-300 dark:text-gray-700">
          Whatever you were looking for on {site.shortName}&apos;s site isn&apos;t
          here — the link may be broken, or the page may have moved.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#CA3E47] hover:bg-[#CA3E47] hover:text-white dark:border-gray-300 dark:bg-gray-200/50 dark:text-gray-800">
          <HomeIcon className="h-4 w-4" />
          Back to homepage
        </Link>
        <Link
          href="/writing"
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#CA3E47] hover:bg-[#CA3E47] hover:text-white dark:border-gray-300 dark:bg-gray-200/50 dark:text-gray-800">
          <NewspaperIcon className="h-4 w-4" />
          Read the writing
        </Link>
        <Link
          href="/work"
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#CA3E47] hover:bg-[#CA3E47] hover:text-white dark:border-gray-300 dark:bg-gray-200/50 dark:text-gray-800">
          <CodeBracketIcon className="h-4 w-4" />
          See the projects
        </Link>
      </div>
    </main>
  );
}
