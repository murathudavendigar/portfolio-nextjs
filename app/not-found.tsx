import { site } from "@/lib/site";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-[#313131] dark:bg-[#bcc] text-white dark:text-gray-700 text-center px-6">
      <h1 className="text-4xl font-semibold">404 — Page Not Found</h1>
      <p className="text-gray-300 dark:text-gray-700 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist on {site.shortName}&apos;s site.
      </p>
      <Link href="/" className="underline hover:text-[#CA3E47] transition-colors">
        Back to homepage
      </Link>
    </div>
  );
}
