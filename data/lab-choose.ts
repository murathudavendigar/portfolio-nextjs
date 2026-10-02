export type LabChoice = {
  id: string;
  label: string;
  /** The factually correct answer — picking this costs a life. */
  correct: boolean;
};

export type LabRound = {
  id: string;
  category: string;
  prompt: string;
  choices: LabChoice[];
};

/** CHOOSE lab — pick the wrong answer. Categories echo the bilingual product tone. */
export const CHOOSE_LAB_ROUNDS: LabRound[] = [
  {
    id: "capital",
    category: "Geography",
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
    category: "Dev",
    prompt: "React is…",
    choices: [
      { id: "a", label: "A CSS framework like Tailwind", correct: false },
      { id: "b", label: "A UI library for interfaces", correct: true },
      { id: "c", label: "A PostgreSQL client", correct: false },
      { id: "d", label: "An App Store review tool", correct: false },
    ],
  },
  {
    id: "coffee",
    category: "Culture",
    prompt: "Espresso is typically…",
    choices: [
      { id: "a", label: "A long drip coffee", correct: false },
      { id: "b", label: "A short concentrated shot", correct: true },
      { id: "c", label: "Cold brew only", correct: false },
      { id: "d", label: "Tea with milk foam", correct: false },
    ],
  },
  {
    id: "ts",
    category: "Dev",
    prompt: "TypeScript mainly adds…",
    choices: [
      { id: "a", label: "Static types", correct: true },
      { id: "b", label: "A new JavaScript runtime", correct: false },
      { id: "c", label: "Built-in GraphQL", correct: false },
      { id: "d", label: "Free Vercel hosting", correct: false },
    ],
  },
  {
    id: "pixel",
    category: "Design",
    prompt: "A favicon is usually…",
    choices: [
      { id: "a", label: "A tiny site icon in the tab", correct: true },
      { id: "b", label: "A full-bleed hero image", correct: false },
      { id: "c", label: "An npm package lockfile", correct: false },
      { id: "d", label: "A Cal.com booking slot", correct: false },
    ],
  },
  {
    id: "ios",
    category: "Product",
    prompt: "iOS apps reach users through…",
    choices: [
      { id: "a", label: "Google Play", correct: false },
      { id: "b", label: "the App Store", correct: true },
      { id: "c", label: "the npm registry", correct: false },
      { id: "d", label: "Steam", correct: false },
    ],
  },
  {
    id: "tr",
    category: "TR / EN",
    prompt: "“Teşekkürler” means…",
    choices: [
      { id: "a", label: "Good morning", correct: false },
      { id: "b", label: "Thank you", correct: true },
      { id: "c", label: "See you later", correct: false },
      { id: "d", label: "Wrong answer", correct: false },
    ],
  },
];

export const CHOOSE_LAB_LIVES = 3;
/** Seconds per round before auto life-loss (Timer mode wink). */
export const CHOOSE_LAB_SECONDS = 8;
