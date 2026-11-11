/**
 * German client sites from TemCraft Tech's projects page
 * (https://www.temcrafttech.com/en/references). The full list stays on that
 * page; /work shows only these and links there for the rest.
 */
export type TemcraftClient = {
  name: string;
  url: string;
  sector: string;
  /** Murat worked on this one himself, not only the wider team. */
  contributed?: boolean;
  /** Only set when verified from the live site. */
  stack?: string;
};

export const temcraftClients: TemcraftClient[] = [
  { name: "ERN GmbH", url: "https://www.erngmbh.de/", sector: "Engineering" },
  { name: "AFR Security", url: "https://www.afrsecurity.de/", sector: "Security", contributed: true, stack: "Next.js" },
];

/** Projects Murat worked on come first. */
export function getTemcraftClients(): TemcraftClient[] {
  return [...temcraftClients].sort(
    (a, b) => Number(Boolean(b.contributed)) - Number(Boolean(a.contributed)),
  );
}
