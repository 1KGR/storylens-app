export interface Collection {
  slug: string;
  name: string;
  description: string;
}

export const COLLECTIONS: Collection[] = [
  { slug: "structure-masters", name: "Structure Masters", description: "Films whose architecture is the lesson." },
  { slug: "character-studies", name: "Character Studies", description: "Change tracked scene by scene, not announced." },
  { slug: "twist-engineering", name: "Twist Engineering", description: "Reveals built on fair-play clues, not tricks." },
  { slug: "pacing-masters", name: "Pacing Masters", description: "Momentum built from cause and consequence." },
  { slug: "emotional-payoff", name: "Emotional Payoff", description: "Setups that earn interest over the runtime." },
  { slug: "foreshadowing-collection", name: "Foreshadowing", description: "Clues hidden in plain, ordinary sight." },
  { slug: "visual-storytelling", name: "Visual Storytelling", description: "Story told through frame, not line." },
  { slug: "unexpected-hits", name: "Unexpected Hits", description: "Small scope, outsized craft." },
  { slug: "beautiful-failures", name: "Beautiful Failures", description: "Where even the breakdowns teach something." },
  { slug: "films-that-teach", name: "Films That Teach", description: "The recommended starting shelf." },
  { slug: "theme-collection", name: "Theme", description: "Films argued in images, not speeches." },
];

export interface Role {
  id: string;
  label: string;
  blurb: string;
  topics: string[];
}

export const ROLES: Role[] = [
  {
    id: "writer",
    label: "Writer",
    blurb: "Structure, turning points, dialogue, subtext, theme.",
    topics: ["Structure", "Turning points", "Character goals", "Conflict", "Dialogue", "Subtext", "Theme", "Foreshadowing", "Payoff", "Pacing", "Scene construction"],
  },
  {
    id: "director",
    label: "Director",
    blurb: "Blocking, coverage, performance direction, staging.",
    topics: ["Blocking", "Coverage", "Performance direction", "Visual motifs", "Transitions", "Scene staging", "Information control"],
  },
  {
    id: "cinematographer",
    label: "Cinematographer",
    blurb: "Framing, lens choice, lighting, composition, colour.",
    topics: ["Framing", "Lens choice", "Lighting", "Camera movement", "Composition", "Colour", "Aspect ratio"],
  },
  {
    id: "actor",
    label: "Actor",
    blurb: "Objective, subtext, physical performance, transformation.",
    topics: ["Character objective", "Subtext", "Physical performance", "Emotional beats", "Character transformation"],
  },
  {
    id: "editor",
    label: "Editor",
    blurb: "Rhythm, cut patterns, montage, information release.",
    topics: ["Rhythm", "Cut patterns", "Montage", "Scene transitions", "Information release", "Temporal manipulation"],
  },
  {
    id: "sound-designer",
    label: "Sound Designer",
    blurb: "Silence, diegetic sound, sound bridges, music placement.",
    topics: ["Silence", "Diegetic sound", "Sound bridges", "Music placement", "Audio perspective"],
  },
  {
    id: "production-designer",
    label: "Production Designer",
    blurb: "Sets, props, colour world, spatial storytelling.",
    topics: ["Sets", "Props", "Colour world", "Symbolism", "Spatial storytelling"],
  },
  {
    id: "producer",
    label: "Producer",
    blurb: "Budget, scale, constraints, risk, audience.",
    topics: ["Budget", "Scale", "Constraints", "Risk", "Production decisions", "Audience"],
  },
  {
    id: "marketing",
    label: "Marketing",
    blurb: "Positioning, trailer, poster, campaign strategy.",
    topics: ["Positioning", "Trailer", "Poster", "Audience promise", "Campaign strategy"],
  },
  {
    id: "cinephile",
    label: "Cinephile",
    blurb: "Themes, film language, references, personal notes.",
    topics: ["Themes", "Film language", "References", "Cultural context", "Recurring motifs", "Personal notes"],
  },
];

export interface Skill {
  slug: string;
  label: string;
  description: string;
}

export const SKILLS: Skill[] = [
  { slug: "pacing", label: "Pacing", description: "Keeping momentum without losing meaning." },
  { slug: "twists", label: "Twists", description: "Reveals that recontextualize instead of shock." },
  { slug: "structure", label: "Structure", description: "The architecture underneath the scenes." },
  { slug: "character", label: "Character", description: "Change the audience can track, not just hear about." },
  { slug: "theme", label: "Theme", description: "An argument made through story, not statement." },
  { slug: "foreshadowing", label: "Foreshadowing", description: "Clues that reward a second viewing." },
  { slug: "dialogue", label: "Dialogue", description: "What's said versus what's actually meant." },
  { slug: "visual-storytelling", label: "Visual Storytelling", description: "Telling it through the frame." },
  { slug: "conflict", label: "Conflict", description: "Pressure that never fully resolves too early." },
];
