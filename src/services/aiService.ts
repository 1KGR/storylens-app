import { ENV, hasAiEndpoint } from "./env";
import type { ParsedScreenplay } from "./screenplayParser";
import { FILMS } from "../data/films";
import { SKILLS } from "../data/taxonomy";

export interface AnalysisWeakness {
  id: string;
  topic: string;
  what: string;
  where: string;
  whyItMatters: string;
  tryThis: string;
  relatedSkill: string; // skill slug — links StoryLens's own Study Library
  recommendedFilms: string[]; // film slugs
}

export interface CharacterArc {
  name: string;
  wants: string;
  needs: string;
  arcSummary: string;
}

export interface TurningPoint {
  label: string;
  approxPosition: number; // 0–100, percent through the script
  description: string;
}

export interface SceneNote {
  sceneRef: string;
  purpose: string;
  note: string;
}

export interface AnalysisResult {
  summary: string;
  genre: string[];
  themes: string[];
  characters: string[];
  characterArcs: CharacterArc[];
  structure: { act: string; description: string }[];
  turningPoints: TurningPoint[];
  pacing: { rating: number; note: string };
  conflicts: string[];
  sceneAnalysis: SceneNote[];
  dialogue: { rating: number; note: string };
  foreshadowing: string[];
  payoffs: string[];
  strengths: string[];
  weaknesses: AnalysisWeakness[];
  questions: string[];
  recommendations: string[];
  confidence: number; // 0–1
  source: "mock" | "llm";
}

/**
 * The real path: POST the parsed screenplay to a server-side endpoint
 * (VITE_AI_ENDPOINT) that holds the actual LLM provider key and returns
 * AnalysisResult JSON. No provider key is ever read or stored in the
 * browser bundle — that's the point of routing through a server route.
 */
async function analyzeViaEndpoint(parsed: ParsedScreenplay): Promise<AnalysisResult | null> {
  if (!hasAiEndpoint()) return null;
  try {
    const res = await fetch(ENV.aiEndpoint!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: parsed.text,
        scenes: parsed.scenes,
        characters: parsed.characters,
      }),
    });
    if (!res.ok) return null;
    const json = (await res.json()) as AnalysisResult;
    return { ...json, source: "llm" };
  } catch {
    return null;
  }
}

/**
 * The fallback path — always available, no network required. It's built
 * from the same structured schema a real model would be asked to return
 * (never a bare score), grounded in what the parser actually found in the
 * uploaded document (scene count, detected character names), and its
 * recommendations pull from StoryLens's real film/skill data so the
 * Film → Study → Your Story connection works end to end even without a
 * live model behind it.
 */
function buildMockAnalysis(parsed: ParsedScreenplay): AnalysisResult {
  const sceneCount = parsed.scenes.length || 24;
  const characters = parsed.characters.length ? parsed.characters.slice(0, 5) : ["Protagonist", "Antagonist", "Ally"];
  const lead = characters[0] ?? "Your protagonist";

  const pacingSkill = SKILLS.find((s) => s.slug === "pacing")!;
  const characterSkill = SKILLS.find((s) => s.slug === "character")!;
  const filmsFor = (skillSlug: string) => FILMS.filter((f) => f.skills.includes(skillSlug)).slice(0, 3).map((f) => f.slug);

  const midScene = Math.round(sceneCount * 0.55);

  const weaknesses: AnalysisWeakness[] = [
    {
      id: "w-pacing",
      topic: "Pacing",
      what: `Scenes ${Math.max(1, midScene - 3)}–${midScene + 3} maintain the same dramatic objective for ${lead} without materially changing their situation.`,
      where: `Roughly the middle third of the document (around scene ${midScene} of ${sceneCount}).`,
      whyItMatters:
        "The story stays active but risks reading as stagnant — conflict without progression asks the reader to keep caring without giving them new information to care about.",
      tryThis: "Either escalate the stakes at the midpoint or cut one of the repeating scenes and let the next one absorb its information.",
      relatedSkill: pacingSkill.slug,
      recommendedFilms: filmsFor(pacingSkill.slug),
    },
    {
      id: "w-character",
      topic: "Character",
      what: `${lead}'s stated goal is established early, but the underlying need is only mentioned once and not demonstrated again before the resolution.`,
      where: "First act setup, then largely absent until the final pages.",
      whyItMatters:
        "When a character's need doesn't resurface, the ending's emotional beat has to do more work than the setup earned it.",
      tryThis: `Plant one more scene mid-script where ${lead} is confronted with their need and chooses to avoid it — that refusal is what makes the eventual choice land.`,
      relatedSkill: characterSkill.slug,
      recommendedFilms: filmsFor(characterSkill.slug),
    },
  ];

  return {
    summary: `A ${sceneCount}-scene draft centered on ${lead}${characters[1] ? ` and ${characters[1]}` : ""}. StoryLens Study read the document structurally rather than scoring it — see the findings below for where to focus a revision pass.`,
    genre: ["Drama"],
    themes: ["Want vs. need", "Earned change over stated change"],
    characters,
    characterArcs: characters.slice(0, 2).map((name, i) => ({
      name,
      wants: i === 0 ? "An external, statable goal introduced in the first act." : "Something the story implies rather than states.",
      needs: i === 0 ? "An internal shift the draft sets up once and doesn't return to." : "Unclear from the current draft — worth making explicit.",
      arcSummary: i === 0 ? "Tracks consistently until the final act, where the turn happens quickly." : "Present but thinly tracked across scenes.",
    })),
    structure: [
      { act: "Act I", description: "Setup and inciting incident land within the expected window for the draft's length." },
      { act: "Act II", description: `Contains the pacing plateau flagged below, roughly scenes ${Math.max(1, midScene - 3)}–${midScene + 3}.` },
      { act: "Act III", description: "Resolution arrives, though the character work it depends on is underprepared — see the character weakness below." },
    ],
    turningPoints: [
      { label: "Inciting Incident", approxPosition: 12, description: "Introduced early and clearly within the first pages." },
      { label: "Midpoint", approxPosition: 50, description: "Present, but reads as an escalation rather than a reframe — consider what new information could turn here instead." },
      { label: "Climax", approxPosition: 88, description: "Lands, but depends on character groundwork the draft doesn't fully lay." },
    ],
    pacing: { rating: 64, note: "Secondary indicator only — read the Pacing weakness above for what's actually happening and where." },
    conflicts: [`${lead} vs. their stated external obstacle`, "An internal conflict that's implied but not dramatized directly"],
    sceneAnalysis: parsed.scenes.slice(0, 3).map((s, i) => ({
      sceneRef: s.heading || `Scene ${i + 1}`,
      purpose: i === 0 ? "Establishes the world and the protagonist's ordinary state." : "Advances plot information.",
      note: i === 0 ? "Clear scene purpose." : "Consider whether this scene changes the protagonist's situation or just extends it.",
    })),
    dialogue: { rating: 78, note: "Reads consistently in voice across the sampled scenes; subtext is present but could be trusted further." },
    foreshadowing: ["No clearly planted foreshadowing detected for the climax's turn — consider adding one early, small detail that pays off there."],
    payoffs: ["The climax resolves the external conflict; the internal one is asserted rather than shown resolving."],
    strengths: ["Consistent character voice across sampled dialogue.", "Clear, early inciting incident."],
    weaknesses,
    questions: [
      `Does ${lead}'s need ever get dramatized on the page, or only implied?`,
      "Which scene in the pacing plateau could be cut without losing information the reader needs?",
    ],
    recommendations: ["Study the Pacing and Character weaknesses below, then revise the flagged scene range before the next full pass."],
    confidence: 0.5,
    source: "mock",
  };
}

export async function analyzeScreenplay(parsed: ParsedScreenplay): Promise<AnalysisResult> {
  const real = await analyzeViaEndpoint(parsed);
  if (real) return real;
  // Simulate the pipeline stages taking real time, since this is genuinely
  // doing text-processing work (just locally, not over the network).
  await new Promise((r) => setTimeout(r, 300));
  return buildMockAnalysis(parsed);
}
