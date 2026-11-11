"use client";

import { useEffect, useState } from "react";

type Props = {
  url: string;
  title: string;
};

const buttonClass =
  "inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-gray-200 transition-colors hover:border-[#CA3E47]/60 hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] dark:border-gray-300 dark:text-gray-700";

/**
 * Share row for a post. Uses the phone's own share sheet when the browser has
 * one, plus copy link, X and LinkedIn. No third-party scripts or tracking.
 */
export default function ShareButtons({ url, title }: Props) {
  const [canShare, setCanShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCanShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const nativeShare = async () => {
    try {
      await navigator.share({ title, url });
    } catch {
      // The reader closed the share sheet. Nothing to do.
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      window.prompt("Copy this link:", url);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const xHref = `https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encodedUrl}`;
  const linkedInHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;

  return (
    <section
      aria-labelledby="share-heading"
      className="border-t border-white/20 pt-8 dark:border-gray-300">
      <h2
        id="share-heading"
        className="font-mono-ui text-[11px] uppercase tracking-[0.2em] text-[var(--text-muted)]">
        Share this post
      </h2>
      <div className="mt-4 flex flex-wrap gap-3">
        {canShare ? (
          <button type="button" onClick={nativeShare} className={buttonClass}>
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true">
              <path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v14" />
            </svg>
            Share
          </button>
        ) : null}
        <button type="button" onClick={copyLink} className={buttonClass}>
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          <span aria-live="polite">{copied ? "Link copied" : "Copy link"}</span>
        </button>
        <a
          href={xHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          X<span className="sr-only"> (opens in a new tab)</span>
        </a>
        <a
          href={linkedInHref}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}>
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
          </svg>
          LinkedIn<span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </section>
  );
}
