import gplay from "google-play-scraper";
import { unstable_cache } from "next/cache";

export type PlayStoreInfo = {
  /** Install bucket as Play shows it, e.g. "10+". */
  installs: string;
  averageRating: number | null;
  ratingCount: number;
};

export function playStoreIdFromUrl(url: string): string | null {
  const match = url.match(/[?&]id=([\w.]+)/);
  return match ? match[1] : null;
}

// Google Play has no public lookup API, so this reads the store page through
// google-play-scraper. It can break if Google changes the page: on any error
// it returns null and the page just hides the line.
export const getPlayStoreInfo = unstable_cache(
  async (appId: string): Promise<PlayStoreInfo | null> => {
    try {
      const app = await gplay.app({ appId });
      return {
        installs: app.installs ?? "",
        averageRating: app.score || null,
        ratingCount: app.ratings ?? 0,
      };
    } catch {
      return null;
    }
  },
  ["play-store-info"],
  { revalidate: 86400 },
);
