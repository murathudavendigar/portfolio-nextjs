"use client";

import { site } from "@/lib/site";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function EmailCopyLink() {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(site.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative inline-block">
      <AnimatePresence mode="wait">
        {!copied ? (
          <motion.a
            key="email"
            href={`mailto:${site.email}`}
            onClick={handleCopy}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="mt-8 inline-block cursor-copy text-2xl font-semibold tracking-tight transition-colors duration-300 hover:text-[var(--accent-text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#CA3E47] active:scale-[0.98] sm:text-3xl"
          >
            {site.email}
          </motion.a>
        ) : (
          <motion.button
            key="copied"
            initial={{ opacity: 0, y: 5, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className="mt-8 inline-flex items-center gap-3 text-2xl font-semibold tracking-tight text-[#CA3E47] sm:text-3xl"
          >
            <span>Copied to clipboard</span>
            <motion.span
              initial={{ rotate: -90, opacity: 0, scale: 0 }}
              animate={{ rotate: 0, opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10, delay: 0.1 }}
            >
              ✅
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
