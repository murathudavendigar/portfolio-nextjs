"use client";

import { site } from "@/lib/site";
import { ArrowPathIcon, BugAntIcon, HomeIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#313131] px-6 py-20 text-center text-white dark:bg-[#bcc] dark:text-gray-700">
      <BugAntIcon className="h-16 w-16 text-[#CA3E47]" />

      <div className="max-w-md space-y-2">
        <h1 className="text-2xl font-semibold md:text-3xl">
          Something broke.
        </h1>
        <p className="text-gray-300 dark:text-gray-700">
          An unexpected error happened while rendering this page on{" "}
          {site.shortName}&apos;s site. It&apos;s been logged — try again, or
          head back home.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => reset()}
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#CA3E47] hover:bg-[#CA3E47] hover:text-white dark:border-gray-300 dark:bg-gray-200/50 dark:text-gray-800">
          <ArrowPathIcon className="h-4 w-4" />
          Try again
        </button>
        <Link
          href="/"
          className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium transition-all duration-200 hover:border-[#CA3E47] hover:bg-[#CA3E47] hover:text-white dark:border-gray-300 dark:bg-gray-200/50 dark:text-gray-800">
          <HomeIcon className="h-4 w-4" />
          Back to homepage
        </Link>
      </div>
    </div>
  );
}
