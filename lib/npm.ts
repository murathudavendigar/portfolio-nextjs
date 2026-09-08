export type NpmInfo = {
  name: string;
  version: string;
  publishedAt: string;
  dependencyCount: number;
  unpackedSize: number | null;
  weeklyDownloads: number | null;
  monthlyDownloads: number | null;
  totalDownloads: number | null;
};

type NpmVersion = {
  dependencies?: Record<string, string>;
  dist?: { unpackedSize?: number };
};

export type NpmRegistryDoc = {
  name?: string;
  "dist-tags"?: { latest?: string };
  time?: Record<string, string>;
  versions?: Record<string, NpmVersion>;
};

const REVALIDATE = { next: { revalidate: 86400 } } as const;

export function npmPackageFromUrl(url: string): string | null {
  const match = url.match(/npmjs\.com\/package\/([^/?#]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function parseNpmRegistry(doc: NpmRegistryDoc): NpmInfo | null {
  const version = doc["dist-tags"]?.latest;
  if (!version) return null;
  const latest = doc.versions?.[version];
  const publishedAt = doc.time?.[version] ?? "";
  const deps = latest?.dependencies ?? {};
  return {
    name: doc.name ?? "",
    version,
    publishedAt,
    dependencyCount: Object.keys(deps).length,
    unpackedSize:
      typeof latest?.dist?.unpackedSize === "number"
        ? latest.dist.unpackedSize
        : null,
    weeklyDownloads: null,
    monthlyDownloads: null,
    totalDownloads: null,
  };
}

export function formatByteSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} KB`;
}

function formatPublished(iso: string): string | null {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function npmStatsLine(info: NpmInfo): string[] {
  const depsLabel =
    info.dependencyCount === 1
      ? "1 dep"
      : `${info.dependencyCount} deps`;
  const published = formatPublished(info.publishedAt);
  const weekly = info.weeklyDownloads ?? 0;
  const monthly = info.monthlyDownloads ?? 0;
  const total = info.totalDownloads ?? 0;

  return [
    info.version ? `v${info.version}` : null,
    depsLabel,
    info.unpackedSize != null ? formatByteSize(info.unpackedSize) : null,
    published ? `published ${published}` : null,
    weekly > 0 ? `${weekly} weekly downloads` : null,
    weekly <= 0 && monthly > 0 ? `${monthly} downloads last month` : null,
    total > 0 ? `${total} total downloads` : null,
  ].filter((part): part is string => Boolean(part));
}

async function downloadsPoint(
  name: string,
  period: string,
): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(name)}`,
      REVALIDATE,
    );
    if (!res.ok) return null;
    const data = (await res.json()) as { downloads?: number };
    return typeof data.downloads === "number" ? data.downloads : null;
  } catch {
    return null;
  }
}

export async function getNpmInfo(name: string): Promise<NpmInfo | null> {
  try {
    const res = await fetch(
      `https://registry.npmjs.org/${encodeURIComponent(name)}`,
      REVALIDATE,
    );
    if (!res.ok) return null;
    const doc = (await res.json()) as NpmRegistryDoc;
    const parsed = parseNpmRegistry(doc);
    if (!parsed) return null;

    const today = new Date().toISOString().slice(0, 10);
    const [weekly, monthly, total] = await Promise.all([
      downloadsPoint(name, "last-week"),
      downloadsPoint(name, "last-month"),
      downloadsPoint(name, `2015-01-01:${today}`),
    ]);

    return {
      ...parsed,
      weeklyDownloads: weekly,
      monthlyDownloads: monthly,
      totalDownloads: total,
    };
  } catch {
    return null;
  }
}
