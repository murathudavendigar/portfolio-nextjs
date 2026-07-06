import Link from "next/link";

interface BlogCardProps {
  title: string;
  date: string;
  slug: string;
  description: string;
  imageUrl?: string;
  readTime?: number;
  tags?: string[];
  author?: string;
}

export default function BlogCard({
  title,
  date,
  slug,
  description,
  imageUrl,
  readTime,
  tags = [],
  author,
}: BlogCardProps) {
  return (
    <Link href={`/blogs/${slug}`}>
      <article className="h-full flex flex-col overflow-hidden transition-all duration-300 border rounded-xl cursor-pointer bg-white/5 dark:bg-white/90 backdrop-blur-sm hover:bg-white/10 dark:hover:bg-white hover:shadow-2xl hover:shadow-[#CA3E47]/20 border-white/10 dark:border-gray-200 hover:border-[#CA3E47]/50 dark:hover:border-[#CA3E47] group">
        {imageUrl && (
          <div className="relative w-full overflow-hidden h-52">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-100" />
          </div>
        )}

        <div className="flex flex-col flex-1 p-6 space-y-4">
          <div className="flex-1 space-y-3">
            <h4 className="text-xl md:text-2xl font-bold text-white dark:text-gray-900 group-hover:text-[#CA3E47] transition-colors duration-300 line-clamp-2 leading-tight">
              {title}
            </h4>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 dark:text-gray-600">
              <time className="font-medium">{date}</time>
              {readTime && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>{readTime} min</span>
                  </div>
                </>
              )}
              {author && (
                <>
                  <span className="text-gray-500 dark:text-gray-400">•</span>
                  <span className="font-medium">{author}</span>
                </>
              )}
            </div>

            <p className="text-sm leading-relaxed text-gray-300 md:text-base dark:text-gray-700 line-clamp-3">
              {description}
            </p>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-[#CA3E47]/10 text-[#CA3E47] dark:bg-[#CA3E47]/20 dark:text-[#CA3E47] border border-[#CA3E47]/20 dark:border-[#CA3E47]/30">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Footer with read more */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10 dark:border-gray-200">
            <div className="flex items-center text-[#CA3E47] dark:text-[#CA3E47] text-sm font-semibold group-hover:gap-2 gap-1 transition-all">
              Read more
              <svg
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
