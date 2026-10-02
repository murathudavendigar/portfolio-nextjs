export type LabChoice = {
  id: string;
  label: string;
  /** The factually correct answer — picking this costs a life. */
  correct: boolean;
};

export type LabRound = {
  id: string;
  prompt: string;
  choices: LabChoice[];
};

/** Tiny CHOOSE demo for /lab — pick the wrong answer to score. */
export const CHOOSE_LAB_ROUNDS: LabRound[] = [
  {
    id: "capital",
    prompt: "What is the capital of the Netherlands?",
    choices: [
      { id: "a", label: "Amsterdam", correct: true },
      { id: "b", label: "Rotterdam", correct: false },
      { id: "c", label: "The Hague", correct: false },
      { id: "d", label: "Utrecht", correct: false },
    ],
  },
  {
    id: "react",
    prompt: "Which library is React?",
    choices: [
      { id: "a", label: "A CSS framework", correct: false },
      { id: "b", label: "A UI library for building interfaces", correct: true },
      { id: "c", label: "A database", correct: false },
      { id: "d", label: "A package manager", correct: false },
    ],
  },
  {
    id: "planet",
    prompt: "Which planet is closest to the Sun?",
    choices: [
      { id: "a", label: "Venus", correct: false },
      { id: "b", label: "Mars", correct: false },
      { id: "c", label: "Mercury", correct: true },
      { id: "d", label: "Earth", correct: false },
    ],
  },
  {
    id: "ts",
    prompt: "What does TypeScript add to JavaScript?",
    choices: [
      { id: "a", label: "Static types", correct: true },
      { id: "b", label: "A new runtime", correct: false },
      { id: "c", label: "Built-in GraphQL", correct: false },
      { id: "d", label: "Serverless hosting", correct: false },
    ],
  },
  {
    id: "ios",
    prompt: "Where do iOS apps ship to users?",
    choices: [
      { id: "a", label: "Play Store", correct: false },
      { id: "b", label: "App Store", correct: true },
      { id: "c", label: "npm registry", correct: false },
      { id: "d", label: "Steam", correct: false },
    ],
  },
];

export const CHOOSE_LAB_LIVES = 3;
