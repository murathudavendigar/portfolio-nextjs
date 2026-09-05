export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink dark:bg-paper">
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-white/10 border-t-[#CA3E47] dark:border-gray-300 dark:border-t-[#CA3E47]"
        role="status"
        aria-label="Loading"
      />
    </div>
  );
}
