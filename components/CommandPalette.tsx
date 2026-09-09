"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const LINKS = [
  { name: "Home", href: "/" },
  { name: "Work", href: "/work" },
  { name: "About", href: "/about" },
  { name: "Writing", href: "/writing" },
  { name: "Uses", href: "/uses" },
  { name: "Contact", href: "/contact" },
];

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredLinks = LINKS.filter((link) =>
    link.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh] px-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full max-w-xl bg-ink dark:bg-paper border border-white/10 dark:border-gray-400/40 rounded-xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col"
            >
              <div className="border-b border-white/10 dark:border-gray-400/40 px-4 py-4 flex items-center">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  autoFocus
                  placeholder="Type a command or search..."
                  className="bg-transparent w-full outline-none text-white dark:text-gray-900 placeholder:text-gray-500 font-mono-ui"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button 
                  onClick={() => setOpen(false)}
                  className="text-[10px] font-mono-ui uppercase tracking-wider text-gray-500 bg-white/5 dark:bg-black/5 px-2 py-1 rounded"
                >
                  ESC
                </button>
              </div>
              
              <div className="max-h-[60vh] overflow-y-auto p-2">
                {filteredLinks.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 font-mono-ui">
                    No results found.
                  </div>
                ) : (
                  <div className="space-y-1">
                    <p className="px-3 py-2 text-[10px] font-mono-ui uppercase tracking-widest text-gray-500">
                      Navigation
                    </p>
                    {filteredLinks.map((link) => (
                      <button
                        key={link.name}
                        onClick={() => {
                          setOpen(false);
                          router.push(link.href);
                        }}
                        className="w-full text-left px-3 py-3 text-sm text-gray-300 dark:text-gray-700 hover:bg-white/5 dark:hover:bg-black/5 hover:text-white dark:hover:text-gray-900 rounded-md transition-colors flex items-center justify-between group"
                      >
                        {link.name}
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-gray-500">
                          ↵
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
