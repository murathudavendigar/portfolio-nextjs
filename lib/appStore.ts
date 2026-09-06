export type AppStoreInfo = {
  ratingCount: number;
  averageRating: number | null;
  version: string;
  lastUpdated: string;
  languageCount: number;
  releaseNotes: string;
};

type LookupResult = {
  averageUserRating?: number;
  userRatingCount?: number;
  version?: string;
  currentVersionReleaseDate?: string;
  languageCodesISO2A?: string[];
  releaseNotes?: string;
};

const STOREFRONTS = [
  "us", "gb", "ca", "au", "nl", "be", "de", "fr", "es", "it", "pt",
  "tr", "se", "no", "dk", "fi", "pl", "ch", "at", "ie", "mx", "br",
  "jp", "kr", "in",
];

async function lookup(
  appId: number,
  country: string,
): Promise<LookupResult | null> {
  try {
    const res = await fetch(
      `https://itunes.apple.com/lookup?id=${appId}&country=${country}`,
      { next: { revalidate: 86400 } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.resultCount ? data.results[0] : null;
  } catch {
    return null;
  }
}

export async function getAppStoreInfo(
  appId: number,
): Promise<AppStoreInfo | null> {
  const results = await Promise.all(
    STOREFRONTS.map((country) => lookup(appId, country)),
  );

  let totalRatings = 0;
  let weightedSum = 0;
  let meta: LookupResult | null = null;

  for (const result of results) {
    if (!result) continue;
    if (!meta) meta = result;
    const count = result.userRatingCount ?? 0;
    if (count > 0) {
      totalRatings += count;
      weightedSum += (result.averageUserRating ?? 0) * count;
    }
  }

  if (!meta) return null;

  return {
    ratingCount: totalRatings,
    averageRating: totalRatings > 0 ? weightedSum / totalRatings : null,
    version: meta.version ?? "",
    lastUpdated: meta.currentVersionReleaseDate ?? "",
    languageCount: meta.languageCodesISO2A?.length ?? 0,
    releaseNotes: meta.releaseNotes ?? "",
  };
}

export function appStoreIdFromUrl(url: string): number | null {
  const match = url.match(/id(\d+)/);
  return match ? Number(match[1]) : null;
}
