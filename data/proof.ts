/**
 * Third-party and teaching proof that is verifiable from this site / public listings.
 * Do NOT invent testimonials here. When you have written permission, add entries to
 * `testimonials` with name, role, and quote.
 */

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  /** Optional link to LinkedIn recommendation or source */
  href?: string;
};

export type ProofSignal = {
  label: string;
  detail: string;
};

/** Permission-based quotes only. Leave empty until real ones exist. */
export const testimonials: Testimonial[] = [];

/**
 * Honest proof lines — teaching employers and shipped products already on the site.
 * Ratings / download counts stay live on Work cards; these are contextual labels.
 */
export const PROOF_SIGNALS: ProofSignal[] = [
  {
    label: "Teaching",
    detail:
      "Frontend instructor at euroTech Study GmbH and Wise Quarter — React, Next.js, and project-based curricula.",
  },
  {
    label: "App Store",
    detail:
      "Daily Skyline and Courai shipped on the App Store; ratings on case studies come from the live listing.",
  },
  {
    label: "Open source",
    detail:
      "codebrief and skillbrief published on npm and used on this site before asking anyone else to try them.",
  },
  {
    label: "Company",
    detail:
      "Co-founder of TemCraft Tech — client and product frontend work in React and Next.js.",
  },
];
