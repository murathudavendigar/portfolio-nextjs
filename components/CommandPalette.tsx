"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { site } from "@/lib/site";

type Command = {
  name: string;
  category: "Navigation" | "Actions" | "Social";
  action: () => void;
};

export default function CommandPalette({ resumeHref }: { resumeHref: string | null }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const COMMANDS: Command[] = [
    // Navigation
    { name: "Go to Home", category: "Navigation", action: () => router.push("/") },
    { name: "Go to Work", category: "Navigation", action: () => router.push("/work") },
    { name: "Go to About", category: "Navigation", action: () => router.push("/about") },
    { name: "Go to Writing", category: "Navigation", action: () => router.push("/writing") },
    { name: "Go to Uses", category: "Navigation", action: () => router.push("/uses") },
    
    // Actions
    { 
      name: "Toggle Theme", 
      category: "Actions", 
      action: () => {
        setTheme(theme === "dark" ? "light" : "dark");
        toast.success(`Theme set to ${theme === "dark" ? "light" : "dark"} mode`);
      } 
    },
    { 
      name: "Copy Email Address", 
      category: "Actions", 
      action: () => {
        if (typeof navigator !== "undefined") {
          navigator.clipboard.writeText(site.email);
          toast.success("Email copied to clipboard!");
        }
      } 
    },
    ...(resumeHref ? [{
      name: "Download Résumé",
      category: "Actions" as const,
      action: () => {
        const a = document.createElement("a");
        a.href = resumeHref;
        a.download = "";
        a.click();
        toast.success("Downloading Résumé...");
      }
    }] : []),
    
    // Social
    { name: "Open GitHub", category: "Social", action: () => window.open(site.socials.github, "_blank") },
    { name: "Open X / Twitter", category: "Social", action: () => window.open(site.socials.x, "_blank") },
    { name: "Open LinkedIn", category: "Social", action: () => window.open(site.socials.linkedin, "_blank") },
  ];

  const filteredCommands = COMMANDS.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase())
  );

  // Reset index when search changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [search]);

  // Handle Global open/close and keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      
      if (!open) return;

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (filteredCommands.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === "Enter") {
        e.preventDefault();
        const selected = filteredCommands[selectedIndex];
        if (selected) {
          setOpen(false);
          selected.action();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filteredCommands, selectedIndex]);

  // Auto-scroll the selected item into view
  useEffect(() => {
    if (open) {
      const el = document.getElementById(`cmd-${selectedIndex}`);
      if (el) {
        el.scrollIntoView({ block: "nearest" });
      }
    }
  }, [selectedIndex, open]);

  let currentCategory = "";

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
                {filteredCommands.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500 font-mono-ui">
                    No results found.
                  </div>
                ) : (
                  <div className="space-y-1 py-2">
                    {filteredCommands.map((cmd, index) => {
                      const isNewCategory = cmd.category !== currentCategory;
                      if (isNewCategory) {
                        currentCategory = cmd.category;
                      }

                      const isSelected = selectedIndex === index;

                      return (
                        <React.Fragment key={cmd.name}>
                          {isNewCategory && (
                            <p className="px-3 py-1.5 mt-2 text-[10px] font-mono-ui uppercase tracking-widest text-gray-500">
                              {cmd.category}
                            </p>
                          )}
                          <button
                            id={`cmd-${index}`}
                            onClick={() => {
                              setOpen(false);
                              cmd.action();
                            }}
                            onMouseMove={() => setSelectedIndex(index)}
                            className={`w-full text-left px-3 py-3 text-sm rounded-md transition-colors flex items-center justify-between group ${
                              isSelected
                                ? "bg-white/10 dark:bg-black/10 text-white dark:text-gray-900"
                                : "text-gray-300 dark:text-gray-700 hover:bg-white/5 dark:hover:bg-black/5"
                            }`}
                          >
                            {cmd.name}
                            <span 
                              className={`text-[10px] font-mono-ui transition-opacity ${
                                isSelected ? "opacity-100 text-gray-400" : "opacity-0 group-hover:opacity-100 text-gray-500"
                              }`}
                            >
                              RUN ↵
                            </span>
                          </button>
                        </React.Fragment>
                      );
                    })}
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
