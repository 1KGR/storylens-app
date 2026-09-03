import type { Film } from "../data/films";

export interface Scene {
  timestamp: string;
  title: string;
  purpose: string;
  conflict: string;
  objective: string;
  information: string;
  reversal: string;
  emotionalChange: string;
  visualChoice: string;
  soundChoice: string;
  exitHook: string;
  whyExists: string;
}

const HAND_AUTHORED: Record<string, Scene[]> = {
  whiplash: [
    {
      timestamp: "01:38:00",
      title: "The finale drum solo",
      purpose: "Resolve the entire teacher/student power struggle without a line of reconciliation dialogue.",
      conflict: "Andrew was just publicly humiliated on stage by the man he spent the film trying to earn approval from.",
      objective: "Andrew wants to prove — to Fletcher and himself — that the abuse didn't break what it was aimed at.",
      information: "The audience learns whether Andrew's obsession was self-destruction or the real thing, in real time.",
      reversal: "Andrew turns a walk-off failure into an unsanctioned solo, seizing control of a performance he was never given.",
      emotionalChange: "Humiliation curdles into defiance, then into something closer to communion with Fletcher by the scene's end.",
      visualChoice: "The camera stays tight on hands and face, refusing the wide 'triumphant performance' shot until the very last moment.",
      soundChoice: "Diegetic drumming carries the entire scene — there is no score cushioning the audience from the physical effort.",
      exitHook: "Fletcher's small, private nod is the only acknowledgment the film ever gives — leaving the relationship unresolved on purpose.",
      whyExists: "It's the only scene that could pay off two hours of ambiguous mentorship without collapsing it into a clean moral.",
    },
  ],
  parasite: [
    {
      timestamp: "01:02:00",
      title: "The storm and the stairs",
      purpose: "Physically stage the class gap the film has been arguing all along.",
      conflict: "The Kim family must survive a flood in a home that sits below the water line while the Parks sleep untouched above it.",
      objective: "The Kims need to salvage what little they have left before the water takes it.",
      information: "The audience sees, without being told, exactly how differently a storm affects each household.",
      reversal: "A scene that could have been simple disaster spectacle becomes the film's clearest thesis statement instead.",
      emotionalChange: "Dark comedy curdles into genuine grief as the family's home is destroyed in real time.",
      visualChoice: "Water flows consistently downward across the frame, staging the film's vertical class metaphor as literal geography.",
      soundChoice: "Rain replaces score almost entirely, denying the audience the emotional cue a swelling soundtrack would provide.",
      exitHook: "Ki-taek's blank expression, watching his home flood, sets up the dissociation that drives the film's final act.",
      whyExists: "It's the scene where subtext becomes text without anyone saying the theme out loud.",
    },
  ],
  memento: [
    {
      timestamp: "00:14:00",
      title: "The Polaroid instructions",
      purpose: "Establish the rules of Leonard's condition through action rather than exposition.",
      conflict: "Leonard needs a system he can trust completely, because he can't trust his own continuity.",
      objective: "Leonard is trying to build a version of memory he can carry in his pocket.",
      information: "The audience learns the 'rules' of the film's structure at the same rate Leonard has to re-learn them.",
      reversal: "A scene that looks like simple procedure doubles as the audience's own instruction manual for watching the film.",
      emotionalChange: "Methodical calm masks the horror of the situation, which the film lets the audience feel gradually.",
      visualChoice: "Extreme close-ups on the photographs mirror how narrowly Leonard's entire reality is framed.",
      soundChoice: "A near-silence during the writing beats emphasizes how much concentration each note requires.",
      exitHook: "The instruction 'don't trust him' sets up an accusation the audience won't be able to verify for another hour of screen time.",
      whyExists: "It teaches the audience how to read the rest of the film without a single line of meta-commentary.",
    },
  ],
};

function genericScene(f: Film): Scene {
  return {
    timestamp: "—",
    title: `A key scene in ${f.title}`,
    purpose: `Advance the central conflict introduced in ${f.title}'s first act.`,
    conflict: "The protagonist's stated goal runs directly into an obstacle the film has been building toward.",
    objective: "The protagonist is trying to close the gap between where they are and what they came for.",
    information: "The audience receives a piece of information that recontextualizes an earlier, smaller moment.",
    reversal: "What looked like progress turns out to cost the protagonist something they didn't expect to lose.",
    emotionalChange: "The scene shifts the audience's sympathy without asking them to agree with the character's choice.",
    visualChoice: `Framing keeps the protagonist slightly off-center, consistent with ${f.title}'s visual language elsewhere.`,
    soundChoice: "Score drops out at the turn, letting the moment land without being told how to feel about it.",
    exitHook: "The scene ends one beat before resolution, carrying tension directly into the next scene.",
    whyExists: `Without this scene, the audience would arrive at ${f.title}'s ending without having earned it.`,
  };
}

export function getScenes(f: Film): Scene[] {
  return HAND_AUTHORED[f.slug] ?? [genericScene(f)];
}
