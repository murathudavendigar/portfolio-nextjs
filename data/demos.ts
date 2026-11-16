/**
 * Playable demos shown inside a case study (/work/[slug]#try-it).
 * They used to live under /lab; those URLs now 308 to the case studies
 * (next.config.js).
 */
export type WorkDemo = {
  /** projects.json slug of the case study that shows this demo */
  workSlug: string;
  eyebrow: string;
  summary: string;
};

export const WORK_DEMOS: WorkDemo[] = [
  {
    workSlug: "choose-game",
    eyebrow: "Wrong is right",
    summary:
      "A timed mini-run of the game's inverted rule: wrong answers score, correct ones cost a life, and streaks build a combo. Seven questions, eight seconds each, three lives. The full game adds Classic, Endless and Timer modes, two languages and a leaderboard.",
  },
  {
    workSlug: "daily-skyline",
    eyebrow: "Skyscraper logic",
    summary:
      "A 5×5 tutorial board with the same rules as the daily puzzle: each row and column holds every height once, and the clues on the edges say how many buildings you can see from that side. A few cells are filled in to get you started.",
  },
];

export function getWorkDemo(workSlug: string): WorkDemo | undefined {
  return WORK_DEMOS.find((demo) => demo.workSlug === workSlug);
}
