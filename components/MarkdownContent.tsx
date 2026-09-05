"use client";

import "highlight.js/styles/github-dark.css";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        h1: ({ node, ...props }) => (
          <h1
            className="mt-6 mb-4 text-2xl font-bold text-white sm:mt-8 sm:text-3xl dark:text-gray-900"
            {...props}
          />
        ),
        h2: ({ node, ...props }) => (
          <h2
            className="mt-5 mb-3 text-xl font-bold text-white sm:mt-6 sm:text-2xl dark:text-gray-900"
            {...props}
          />
        ),
        h3: ({ node, ...props }) => (
          <h3
            className="mt-4 mb-2 text-lg font-bold text-white sm:text-xl dark:text-gray-900"
            {...props}
          />
        ),
        p: ({ node, ...props }) => (
          <p
            className="mb-4 text-sm leading-relaxed text-gray-200 sm:text-base dark:text-gray-700"
            {...props}
          />
        ),
        ul: ({ node, ...props }) => (
          <ul
            className="mb-4 space-y-2 text-gray-200 list-disc list-inside dark:text-gray-700"
            {...props}
          />
        ),
        ol: ({ node, ...props }) => (
          <ol
            className="mb-4 space-y-2 text-gray-200 list-decimal list-inside dark:text-gray-700"
            {...props}
          />
        ),
        li: ({ node, ...props }) => <li className="ml-4" {...props} />,
        blockquote: ({ node, ...props }) => (
          <blockquote
            className="border-l-4 border-[#CA3E47] pl-4 italic my-4 text-gray-300"
            {...props}
          />
        ),
        code: ({ node, inline, ...props }: any) =>
          inline ? (
            <code
              className="bg-gray-800 dark:bg-gray-200 text-[var(--accent-text)] px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono"
              {...props}
            />
          ) : (
            <code
              className="block p-3 my-4 overflow-x-auto font-mono text-xs text-gray-300 bg-gray-900 rounded-lg sm:p-4 sm:text-sm dark:bg-gray-200 dark:text-gray-800"
              {...props}
            />
          ),
        pre: ({ node, ...props }) => (
          <pre
            className="p-3 my-4 overflow-x-auto font-mono text-xs text-gray-300 bg-gray-900 rounded-lg sm:p-4 sm:text-sm dark:bg-gray-200 dark:text-gray-800"
            {...props}
          />
        ),
        a: ({ node, ...props }) => (
          <a
            className="text-[var(--accent-text)] hover:underline"
            {...props}
            target="_blank"
            rel="noopener noreferrer"
          />
        ),
        img: ({ node, ...props }) => (
          <img
            className="w-full my-4 rounded-lg"
            alt="Blog content image"
            loading="lazy"
            decoding="async"
            {...props}
          />
        ),
        hr: ({ node, ...props }) => (
          <hr
            className="my-8 border-white/20 dark:border-gray-300"
            {...props}
          />
        ),
        table: ({ node, ...props }) => (
          <div className="my-4 overflow-x-auto">
            <table
              className="min-w-full border border-gray-700 dark:border-gray-300"
              {...props}
            />
          </div>
        ),
        th: ({ node, ...props }) => (
          <th
            className="px-4 py-2 font-bold bg-gray-800 border border-gray-700 dark:border-gray-300 dark:bg-gray-200"
            {...props}
          />
        ),
        td: ({ node, ...props }) => (
          <td
            className="px-4 py-2 border border-gray-700 dark:border-gray-300"
            {...props}
          />
        ),
      }}>
      {content}
    </ReactMarkdown>
  );
}
