import { appStoreIdFromUrl, getAppStoreInfo } from "@/lib/appStore";
import { getNpmInfo, npmPackageFromUrl } from "@/lib/npm";
import { getProjects, getSelectedProjects } from "@/lib/projects";
import { formatPostDate } from "@/lib/utils";

export type Stat = { value: string; label: string };

export type AppData = {
  name: string;
  averageRating: number | null;
  ratingCount: number;
  version: string;
  lastUpdated: string;
};

export type PackageData = {
  name: string;
  version: string;
  publishedAt: string;
  totalDownloads: number | null;
};

export function formatCompact(n: number): string {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k >= 10 ? Math.round(k) : k.toFixed(1).replace(/\.0$/, "")}k`;
}

/**
 * The homepage strip, built only from numbers the App Store and npm report.
 * Each cell falls back to a plain fact when its data is missing.
 */
export function buildLiveStats({
  apps,
  packages,
  liveProducts,
}: {
  apps: AppData[];
  packages: PackageData[];
  liveProducts: number;
}): { stats: Stat[]; isLive: boolean } {
  let isLive = false;

  const rated = apps.filter((a) => a.averageRating && a.ratingCount > 0);
  const ratingCount = rated.reduce((sum, a) => sum + a.ratingCount, 0);
  let rating: Stat;
  if (ratingCount > 0) {
    isLive = true;
    const avg =
      rated.reduce((sum, a) => sum + (a.averageRating ?? 0) * a.ratingCount, 0) /
      ratingCount;
    rating = {
      value: `${avg.toFixed(1)}★`,
      label: `App Store rating · ${ratingCount} ${ratingCount === 1 ? "rating" : "ratings"}`,
    };
  } else {
    rating = { value: String(apps.length), label: "Mobile apps in the stores" };
  }

  const downloads = packages.reduce((sum, p) => sum + (p.totalDownloads ?? 0), 0);
  let npm: Stat;
  if (downloads > 0) {
    isLive = true;
    npm = { value: formatCompact(downloads), label: "npm downloads, all time" };
  } else {
    npm = { value: String(packages.length), label: "npm packages published" };
  }

  const releases = [
    ...apps.map((a) => ({ name: a.name, version: a.version, date: a.lastUpdated })),
    ...packages.map((p) => ({ name: p.name, version: p.version, date: p.publishedAt })),
  ]
    .filter((r) => r.date && !Number.isNaN(new Date(r.date).getTime()))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  let latest: Stat;
  if (releases[0]) {
    isLive = true;
    const r = releases[0];
    latest = {
      value: formatPostDate(r.date).replace(/ \d{4}$/, ""),
      label: `Last release · ${r.name}${r.version ? ` ${r.version}` : ""}`,
    };
  } else {
    latest = { value: "2022", label: "Shipping to production since" };
  }

  return {
    stats: [
      { value: String(liveProducts), label: "Products live today" },
      rating,
      npm,
      latest,
    ],
    isLive,
  };
}

export async function getLiveStats() {
  const projects = getProjects();

  const apps = await Promise.all(
    projects
      .filter((p) => p.appStoreUrl)
      .map(async (p): Promise<AppData> => {
        const id = appStoreIdFromUrl(p.appStoreUrl!);
        const info = id ? await getAppStoreInfo(id) : null;
        return {
          name: p.name,
          averageRating: info?.averageRating ?? null,
          ratingCount: info?.ratingCount ?? 0,
          version: info?.version ?? "",
          lastUpdated: info?.lastUpdated ?? "",
        };
      }),
  );

  const packages = await Promise.all(
    projects
      .map((p) => npmPackageFromUrl(p.url))
      .filter((name): name is string => Boolean(name))
      .map(async (name): Promise<PackageData> => {
        const info = await getNpmInfo(name);
        return {
          name,
          version: info?.version ?? "",
          publishedAt: info?.publishedAt ?? "",
          totalDownloads: info?.totalDownloads ?? null,
        };
      }),
  );

  return buildLiveStats({
    apps,
    packages,
    liveProducts: getSelectedProjects().length,
  });
}
