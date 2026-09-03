import type { Film } from "../data/films";
import type { Role } from "../data/taxonomy";

export interface Finding {
  topic: string;
  where: string;
  what: string;
  why: string;
  impact: string;
  learn: string;
  apply: string;
  principle: string; // "steal the principle" / "don't copy" framing
}

// Role-flavored sentence templates. Kept short and reusable across films so every
// role produces real, differentiated content rather than an empty placeholder.
const ROLE_TEMPLATES: Record<string, (f: Film, topic: string) => Omit<Finding, "topic">> = {
  director: (f, topic) => ({
    where: `Across the film's key ${topic.toLowerCase()} choices`,
    what: `${f.director} uses ${topic.toLowerCase()} to control what the audience is allowed to know at any given moment, rather than relying on dialogue to explain it.`,
    why: `Directing decisions here are doing narrative work that a script page can only gesture toward.`,
    impact: `The audience receives information through staging before they'd get it through exposition, which keeps scenes from feeling explained rather than experienced.`,
    learn: `Notice where a director chooses to withhold or reveal through camera and blocking rather than a line of dialogue.`,
    apply: `Storyboard one of your own scenes without new dialogue — see what staging alone can carry.`,
    principle: `Steal the instinct to let staging carry information. Don't copy the specific blocking — it belongs to this film's geography.`,
  }),
  cinematographer: (f, topic) => ({
    where: `Throughout ${f.title}'s visual language`,
    what: `${topic} is used consistently enough to become a readable pattern rather than a one-off choice — the audience learns to interpret it before the film ever explains it.`,
    why: `A visual grammar repeated with discipline lets meaning build without narration.`,
    impact: `By the film's second half, the audience is reading ${topic.toLowerCase()} as information, not just atmosphere.`,
    learn: `Look for one visual choice repeated with variation, not just once for effect.`,
    apply: `Pick one visual technique and use it at least three times in your own project, each time with a slightly different meaning.`,
    principle: `Steal the discipline of repetition-with-variation. Don't copy the specific palette or lens choice — build your own vocabulary.`,
  }),
  actor: (f, topic) => ({
    where: `In ${f.title}'s lead performance`,
    what: `${topic} is used to communicate what the character won't say out loud, which is often the opposite of their stated line.`,
    why: `The gap between what's spoken and what's performed is where the character's real throughline lives.`,
    impact: `Viewers track the character's true feelings through performance, even while the dialogue argues something else.`,
    learn: `Watch for moments where the performance visibly disagrees with the dialogue.`,
    apply: `Rehearse a scene of your own script by first playing the opposite of the written intention, then find the middle.`,
    principle: `Steal the idea of performing against the line. Don't copy a specific performer's choices — build from your own actor's instincts.`,
  }),
  editor: (f, topic) => ({
    where: `In ${f.title}'s cutting pattern`,
    what: `${topic} shapes how much time the audience spends inside a moment before the film moves on, which directly controls how much weight that moment carries.`,
    why: `Editing is pacing's most literal tool — the same scene reads differently depending on how long the cut holds.`,
    impact: `Scenes that could read as filler instead carry tension, purely from how they're trimmed and placed.`,
    learn: `Time how long the film holds on reactions versus actions — that ratio is a deliberate choice.`,
    apply: `Recut a scene from your own footage or outline holding two seconds longer on a reaction than feels natural, and see what changes.`,
    principle: `Steal the awareness that a hold is a choice. Don't copy exact cut timings — match them to your own scene's rhythm.`,
  }),
  "sound-designer": (f, topic) => ({
    where: `In ${f.title}'s sound design`,
    what: `${topic} is used deliberately, including the choice of when to remove sound entirely rather than only when to add it.`,
    why: `Silence and selective sound placement direct attention as precisely as a cut or a camera move.`,
    impact: `The absence of a expected sound cue creates unease or focus more efficiently than adding music would.`,
    learn: `Notice a moment where the film goes quiet right before or after something important.`,
    apply: `Try removing your planned score from one key scene entirely and see what the silence does instead.`,
    principle: `Steal the instinct to treat silence as a choice, not an absence. Don't copy specific cues — build your own sound logic.`,
  }),
  "production-designer": (f, topic) => ({
    where: `In ${f.title}'s spaces and objects`,
    what: `${topic} is used to communicate character and theme without a line of dialogue pointing at it.`,
    why: `A space designed with intention tells the audience who lives in it before anyone speaks.`,
    impact: `Environment becomes evidence — viewers draw conclusions about character from the world around them.`,
    learn: `Look at one recurring object or space and track how its meaning shifts across the film.`,
    apply: `Choose one prop or location in your own story and make sure it means something different by the end than it did at the start.`,
    principle: `Steal the idea that spaces can carry theme. Don't copy specific set dressing — build symbols from your own world.`,
  }),
  producer: (f, topic) => ({
    where: `In ${f.title}'s overall shape and scope`,
    what: `${topic} visibly shaped what kind of story could be told here — constraints that show up as craft decisions, not compromises.`,
    why: `Budget and scale decisions are storytelling decisions in disguise; understanding them explains why the film looks the way it does.`,
    impact: `The film's limitations became some of its most distinctive choices rather than its weaknesses.`,
    learn: `Ask what a bigger budget would have let this film skip — and whether skipping it would have made the film worse.`,
    apply: `List the constraints on your own project and find one that could become a strength instead of a workaround.`,
    principle: `Steal the reframe of constraint as craft. Don't copy this film's specific budget choices — solve your own.`,
  }),
  marketing: (f, topic) => ({
    where: `In how ${f.title} was positioned to audiences`,
    what: `${topic} made a specific promise to the audience about what kind of experience this would be, and the film delivers on exactly that promise.`,
    why: `A clear promise sets expectations the story can either fulfil or productively subvert.`,
    impact: `Audiences arrived already primed for the film's tone, which let the story spend less time establishing it.`,
    learn: `Identify the one-sentence promise this film's marketing made, and see how early the film itself confirms it.`,
    apply: `Write your own project's one-sentence promise before finishing the draft, and check every scene against it.`,
    principle: `Steal the discipline of a clear promise. Don't copy this film's specific pitch — find your own story's actual hook.`,
  }),
  cinephile: (f, topic) => ({
    where: `In the film's place within ${f.genre.toLowerCase()} and ${f.country}`,
    what: `${topic} connects this film to a broader conversation happening in ${f.language}-language cinema and beyond, worth tracing across a few more titles.`,
    why: `Films rarely invent in isolation — seeing what a film is responding to sharpens what makes its own choices distinct.`,
    impact: `Understanding the surrounding context makes the film's specific choices legible as choices, not defaults.`,
    learn: `Note one other film this reminds you of, and be specific about what it's doing differently.`,
    apply: `Keep a running list in your notebook of films that share a technique — patterns become visible in the collection, not any single entry.`,
    principle: `Steal the habit of cross-referencing. Don't copy another film's approach wholesale — use it as a comparison point.`,
  }),
};

function writerFindings(f: Film): Finding[] {
  const primary: Finding = {
    topic: "Structure",
    where: "Across the full runtime",
    what: f.signature,
    why: f.why,
    impact: `This is the reason StoryLens studies ${f.title} for structure — the choice pays off precisely because it's set up so plainly.`,
    learn: `Identify the single structural decision a film makes early that it trusts the audience to forget until it matters.`,
    apply: `Find the equivalent plant in your own script — or the place you're missing one.`,
    principle: `Steal the principle of trusting a plant to be forgotten. Don't copy ${f.title}'s specific device — find your story's own.`,
  };
  const conflict: Finding = {
    topic: "Conflict",
    where: "In the protagonist's core want vs. need",
    what: `${f.title} keeps its protagonist's stated goal and underlying need pointed in different directions for most of the runtime.`,
    why: "An unresolved gap between want and need creates pressure that a single scene of conflict can't generate alone.",
    impact: "The audience tracks two different problems at once — what the character is chasing, and what they actually need to face.",
    learn: "Map your own protagonist's want against their need — check whether the story resolves the gap too early.",
    apply: "Delay the moment your protagonist admits their real need by at least one more scene than currently drafted.",
    principle: "Steal the discipline of keeping want and need separate. Don't copy this film's specific want/need pairing.",
  };
  const theme: Finding = {
    topic: "Theme",
    where: "In the film's argument, not its dialogue",
    what: `${f.title} makes its thematic argument through structure and consequence rather than a character stating the theme out loud.`,
    why: "A theme demonstrated through plot mechanics lands as earned; a theme announced in dialogue often reads as authorial intrusion.",
    impact: "Viewers arrive at the film's argument themselves, which makes it feel discovered rather than delivered.",
    learn: "Find the one scene where this film comes closest to stating its theme outright, and notice how it undercuts or complicates that statement immediately after.",
    apply: "Cut your most on-the-nose thematic line and see if the scene around it can carry the same idea without it.",
    principle: "Steal the trust in structure over statement. Don't copy this film's specific theme — earn your own.",
  };
  return [primary, conflict, theme];
}

export function getFindings(f: Film, role: Role): Finding[] {
  if (role.id === "writer") return writerFindings(f);
  const template = ROLE_TEMPLATES[role.id];
  if (!template) return [];
  return role.topics.slice(0, 3).map((topic) => ({ topic, ...template(f, topic) }));
}
