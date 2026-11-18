// A tab opened before a deploy still points at the old build's chunk hashes.
// Cloudflare only serves the new build's static files, so the old chunks 404
// and the client router throws. React's reset() re-renders with the same
// missing chunks, so the only fix is a full page load.

const RELOAD_KEY = "chunk-reload-at";
const RELOAD_WINDOW_MS = 10_000;

export function isChunkLoadError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  if (error.name === "ChunkLoadError") return true;
  return /loading (css )?chunk|failed to fetch dynamically imported module|importing a module script failed/i.test(
    error.message,
  );
}

/**
 * Reloads the page once for a chunk error. Returns false when a reload already
 * happened in the last few seconds, so a broken deploy can't loop forever.
 */
export function reloadOnceForChunkError(): boolean {
  try {
    const last = Number(sessionStorage.getItem(RELOAD_KEY) ?? 0);
    if (Date.now() - last < RELOAD_WINDOW_MS) return false;
    sessionStorage.setItem(RELOAD_KEY, String(Date.now()));
  } catch {
    // Storage blocked: still reload, the browser's own cache can't loop us.
  }
  window.location.reload();
  return true;
}
