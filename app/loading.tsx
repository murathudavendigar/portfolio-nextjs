"use client";

import { motion } from "framer-motion";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink dark:bg-paper">
      <div
        role="status"
        aria-label="Loading"
        className="font-mono-ui text-2xl font-semibold flex items-center"
      >
        <span className="text-gray-500 mr-2 opacity-50">&lt;</span>
        
        <svg
          width="96"
          height="32"
          viewBox="0 0 72 24"
          fill="none"
          stroke="#CA3E47"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="inline-block relative -top-[1px]"
        >
          <motion.path
            d="M4 20 L4 4 L12 12 L20 4 L20 20 M28 4 L28 20 M28 12 L44 12 M44 4 L44 20 M52 12 A 8 8 0 1 1 68 12 A 8 8 0 1 1 52 12"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </svg>

        <motion.span
          className="w-3 h-[24px] bg-[#CA3E47] ml-[10px] inline-block"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{
            duration: 1,
            times: [0, 0.5, 0.5, 1],
            repeat: Infinity,
          }}
        />

        <span className="text-gray-500 ml-2 opacity-50">/&gt;</span>
      </div>
    </div>
  );
}
