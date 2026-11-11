import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Without a cache OpenNext renders every page, and every link prefetch, on
// each request. On the Free plan (10 ms CPU) that sometimes fails with
// "Worker exceeded CPU time limit" and the site shows the global error page.
// Serve the build's prerendered pages from static assets instead, and let
// cache interception answer them before the Next server loads.
// This cache is read-only: pages must stay fully static (no `revalidate`),
// so store stats and npm data refresh on each deploy.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
  enableCacheInterception: true,
});
