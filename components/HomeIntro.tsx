"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function HomeIntro() {
  const [show, setShow] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [shouldAnimateExit, setShouldAnimateExit] = useState(true);

  useEffect(() => {
    setIsClient(true);
    const hasSeen = sessionStorage.getItem("mho_intro_seen");
    
    if (hasSeen) {
      setShouldAnimateExit(false);
      setShow(false);
    } else {
      // The draw animation takes 2s. We give it an extra 0.4s to pause at completion.
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("mho_intro_seen", "true");
      }, 2400);
      return () => clearTimeout(timer);
    }
  }, []);

  // During Server-Side Rendering (SSR) and before hydration, render a solid block 
  // to prevent the underlying page from flashing before we check sessionStorage.
  if (!isClient) {
    return <div className="fixed inset-0 z-[100] bg-ink" />;
  }

  // If they have already seen it, return null immediately so we don't render 
  // or animate anything.
  if (!show && !shouldAnimateExit) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-screen"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink shadow-2xl"
        >
          <div className="font-mono-ui text-2xl font-semibold flex items-center">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
}
