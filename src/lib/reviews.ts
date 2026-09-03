import type { Film } from "../data/films";

export interface MockReview {
  handle: string;
  quote: string;
}

const PERSONAS = ["reelwatcher_kg", "midnightframe", "12thtake", "solaris.notes", "wide_shot_diaries", "lensflareonly"];

// Deterministic-but-varied picks so the same film always shows the same mock reviews.
function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function mockLetterboxdReviews(f: Film): MockReview[] {
  const seed = f.title.length;
  return [
    { handle: pick(PERSONAS, seed), quote: `Rewatched for the ${f.categories[0]?.replace("-", " ") ?? "craft"} and it holds up scene by scene.` },
    { handle: pick(PERSONAS, seed + 1), quote: `${f.title} is the one I keep recommending to people who say they don't like ${f.genre.split("/")[0].trim().toLowerCase()} films.` },
    { handle: pick(PERSONAS, seed + 2), quote: `${f.director.split(",")[0]} again proving restraint is the harder skill.` },
  ];
}

export const LETTERBOXD_PLACEHOLDER_NOTE =
  "This is a simulated Letterboxd connection for prototype purposes only — no real Letterboxd account or API is linked.";
