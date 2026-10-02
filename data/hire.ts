export type HireEngagement = {
  id: "hire" | "build" | "teach";
  title: string;
  summary: string;
  fit: string[];
  send: string[];
};

export type HireStep = {
  step: number;
  title: string;
  detail: string;
};

/** Honest engagement types — no scarcity or invented availability claims. */
export const HIRE_ENGAGEMENTS: HireEngagement[] = [
  {
    id: "hire",
    title: "Hire — frontend role",
    summary:
      "Full-time or contract frontend / Next.js roles in the Netherlands, EU, or remote.",
    fit: [
      "Product UI ownership in React, Next.js, and TypeScript",
      "Teams that care about shipping quality, not slide decks",
      "NL / EU timezone overlap preferred",
    ],
    send: [
      "Role title and stack",
      "Location / remote policy",
      "Timeline and a link to the job or brief",
    ],
  },
  {
    id: "build",
    title: "Build — scoped product work",
    summary:
      "Scoped React / Next.js / UI work through TemCraft Tech — MVPs, product UI, and ownership you can hand off.",
    fit: [
      "A clear problem and success criteria",
      "Designs or reference products (Figma optional)",
      "A decision-maker who can reply within a few days",
    ],
    send: [
      "What you are shipping and for whom",
      "Rough scope and deadline",
      "Budget range if you have one",
    ],
  },
  {
    id: "teach",
    title: "Teach — workshops & mentoring",
    summary:
      "React / Next.js workshops, cohort teaching, and 1:1 mentoring — the same stack I ship with.",
    fit: [
      "Students or teams learning by building, not only watching slides",
      "Curriculum that ends in a shipped project",
      "Remote or NL-based sessions",
    ],
    send: [
      "Audience level and size",
      "Topics and format (workshop, cohort, mentoring)",
      "Dates or cadence",
    ],
  },
];

export const HIRE_STEPS: HireStep[] = [
  {
    step: 1,
    title: "Book or write",
    detail:
      "Book a 15-min intro, or send a short note on /contact with the engagement type and what you need.",
  },
  {
    step: 2,
    title: "I reply",
    detail:
      "I usually reply within a couple of days. If it is a fit, we schedule a longer call or I send a short proposal.",
  },
  {
    step: 3,
    title: "Scope together",
    detail:
      "We agree on outcomes, timeline, and how we work — then start. If it is not a fit, I will say so plainly.",
  },
];
