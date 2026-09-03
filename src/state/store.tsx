import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export interface StudyProgress {
  filmSlug: string;
  roleId: string;
  percent: number;
}

export interface Note {
  id: string;
  filmSlug: string;
  text: string;
  tags: string[];
  sceneRef: string;
  createdAt: number;
}

export interface DraftMetrics {
  structure: number;
  character: number;
  pacing: number;
  dialogue: number;
  theme: number;
}

export interface Draft {
  number: number;
  date: string;
  metrics: DraftMetrics;
  deltas: Partial<Record<keyof DraftMetrics, number>>;
  weaknesses: string[];
  strengths: string[];
  questions: string[];
  recommended: string[]; // film slugs
}

export interface StudyPath {
  skillSlug: string;
  completed: string[];
  current: string;
  recommendedNext: string;
}

interface StoreShape {
  progress: StudyProgress[];
  notes: Note[];
  watchlist: string[];
  drafts: Draft[];
  studyPath: StudyPath;
}

const SEED: StoreShape = {
  progress: [
    { filmSlug: "whiplash", roleId: "writer", percent: 72 },
    { filmSlug: "parasite", roleId: "writer", percent: 48 },
    { filmSlug: "mad-max-fury-road", roleId: "writer", percent: 31 },
  ],
  notes: [
    {
      id: "seed-1",
      filmSlug: "parasite",
      text: "The camera stays outside the room during the argument — distance as a choice, not a limitation.",
      tags: ["blocking", "distance", "subtext"],
      sceneRef: "01:14:22",
      createdAt: Date.now() - 86400000 * 3,
    },
  ],
  watchlist: ["get-out", "the-godfather"],
  drafts: [
    {
      number: 3,
      date: "3 weeks ago",
      metrics: { structure: 74, character: 62, pacing: 50, dialogue: 84, theme: 80 },
      deltas: {},
      weaknesses: ["Second act stakes plateau", "Late-introduced antagonist"],
      strengths: ["Strong opening image", "Clear character voice"],
      questions: ["Does your protagonist's want change fast enough?"],
      recommended: ["whiplash", "good-time"],
    },
    {
      number: 4,
      date: "today",
      metrics: { structure: 82, character: 71, pacing: 64, dialogue: 81, theme: 89 },
      deltas: { structure: 8, character: 9, pacing: 14, dialogue: -3, theme: 9 },
      weaknesses: [
        "The middle section contains several scenes that maintain the same dramatic objective without substantially changing the protagonist's situation.",
        "One supporting character's motivation is stated once and never demonstrated again.",
      ],
      strengths: ["The midpoint reversal recontextualizes the opening scene cleanly.", "Dialogue subtext is consistent across drafts."],
      questions: ["Does your protagonist's want and need resolve too close together?", "Which scene could be cut without losing plot information?"],
      recommended: ["whiplash", "good-time", "parasite"],
    },
  ],
  studyPath: {
    skillSlug: "pacing",
    completed: ["whiplash", "mad-max-fury-road"],
    current: "good-time",
    recommendedNext: "uncut-gems",
  },
};

const STORAGE_KEY = "storylens-store-v1";

function load(): StoreShape {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return SEED;
    const parsed = JSON.parse(raw);
    return { ...SEED, ...parsed };
  } catch {
    return SEED;
  }
}

interface StoreContextValue extends StoreShape {
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  toggleWatchlist: (slug: string) => void;
  isWatchlisted: (slug: string) => boolean;
  setProgress: (filmSlug: string, roleId: string, percent: number) => void;
  addDraftFromAnalysis: (fields: {
    metrics: DraftMetrics;
    weaknesses: string[];
    strengths: string[];
    questions: string[];
    recommended: string[];
  }) => Draft;
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<StoreShape>(load);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const addNote: StoreContextValue["addNote"] = (note) => {
    setState((s) => ({
      ...s,
      notes: [{ ...note, id: `note-${Date.now()}`, createdAt: Date.now() }, ...s.notes],
    }));
  };

  const toggleWatchlist = (slug: string) => {
    setState((s) => ({
      ...s,
      watchlist: s.watchlist.includes(slug) ? s.watchlist.filter((x) => x !== slug) : [...s.watchlist, slug],
    }));
  };

  const isWatchlisted = (slug: string) => state.watchlist.includes(slug);

  const setProgress = (filmSlug: string, roleId: string, percent: number) => {
    setState((s) => {
      const existing = s.progress.find((p) => p.filmSlug === filmSlug && p.roleId === roleId);
      if (existing) {
        return {
          ...s,
          progress: s.progress.map((p) => (p.filmSlug === filmSlug && p.roleId === roleId ? { ...p, percent } : p)),
        };
      }
      return { ...s, progress: [{ filmSlug, roleId, percent }, ...s.progress] };
    });
  };

  // Appends a new draft built from a real (or mock-fallback) analysis run,
  // computing deltas against the previous draft so the Tracker reflects
  // actual before/after change rather than fixed demo numbers.
  const addDraftFromAnalysis: StoreContextValue["addDraftFromAnalysis"] = (fields) => {
    const prev = state.drafts[state.drafts.length - 1];
    const deltas: Draft["deltas"] = {};
    if (prev) {
      (Object.keys(fields.metrics) as (keyof DraftMetrics)[]).forEach((k) => {
        deltas[k] = fields.metrics[k] - prev.metrics[k];
      });
    }
    const created: Draft = {
      number: (prev?.number ?? 0) + 1,
      date: "today",
      metrics: fields.metrics,
      deltas,
      weaknesses: fields.weaknesses,
      strengths: fields.strengths,
      questions: fields.questions,
      recommended: fields.recommended,
    };
    setState((s) => ({ ...s, drafts: [...s.drafts, created] }));
    return created;
  };

  return (
    <StoreContext.Provider value={{ ...state, addNote, toggleWatchlist, isWatchlisted, setProgress, addDraftFromAnalysis }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
