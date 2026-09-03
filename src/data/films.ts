export interface Film {
  slug: string;
  title: string;
  year: number;
  director: string;
  runtime: number;
  genre: string;
  language: string;
  country: string;
  categories: string[]; // collection slugs
  gradient: [string, string];
  mark: string;
  logline: string;
  synopsis: string; // original StoryLens description, not marketing copy
  why: string; // "why it works" one-liner
  signature: string; // a specific structural observation
  cast: { actor: string; role: string }[];
  skills: string[]; // skill slugs this film is a strong study for
}

export const FILMS: Film[] = [
  {
    slug: "whiplash",
    title: "Whiplash",
    year: 2014,
    director: "Damien Chazelle",
    runtime: 106,
    genre: "Drama / Music",
    language: "English",
    country: "United States",
    categories: ["pacing-masters", "character-studies", "films-that-teach"],
    gradient: ["#a5323a", "#3a1013"],
    mark: "W",
    logline: "A young drummer trades his sense of self for a teacher's approval, one tempo at a time.",
    synopsis:
      "Andrew enrolls in an elite studio band led by a conductor whose methods blur mentorship and abuse. StoryLens studies this film for how relentlessly it compresses time — almost every scene moves the clock forward while narrowing the emotional distance between teacher and student.",
    why: "the film never slows down to let you catch your breath, which is exactly the pressure it's asking you to feel.",
    signature:
      "the film's runtime shrinks its own scenes as it progresses — early rehearsals run long, the finale is nearly wordless — so pacing itself becomes the character arc.",
    cast: [
      { actor: "Miles Teller", role: "Andrew Neiman" },
      { actor: "J.K. Simmons", role: "Terence Fletcher" },
      { actor: "Paul Reiser", role: "Jim Neiman" },
    ],
    skills: ["pacing", "character", "conflict"],
  },
  {
    slug: "parasite",
    title: "Parasite",
    year: 2019,
    director: "Bong Joon-ho",
    runtime: 132,
    genre: "Thriller / Drama",
    language: "Korean",
    country: "South Korea",
    categories: ["structure-masters", "twist-engineering", "films-that-teach"],
    gradient: ["#767a4c", "#26280f"],
    mark: "P",
    logline: "A family of grifters infiltrates a wealthy household — and discovers they weren't the first.",
    synopsis:
      "The Kim family talks their way into working for the Parks, one fabricated credential at a time. StoryLens studies this film for its structural midpoint reversal, which recategorizes everything the audience thought the story was about.",
    why: "the midpoint doesn't complicate the plan — it reveals the plan was never the real story.",
    signature:
      "the house's basement, glimpsed but unexplained in act one, is the hinge the entire second half turns on — a structural setup disguised as production design.",
    cast: [
      { actor: "Song Kang-ho", role: "Kim Ki-taek" },
      { actor: "Lee Sun-kyun", role: "Park Dong-ik" },
      { actor: "Cho Yeo-jeong", role: "Park Yeon-kyo" },
    ],
    skills: ["twists", "structure", "theme"],
  },
  {
    slug: "the-prestige",
    title: "The Prestige",
    year: 2006,
    director: "Christopher Nolan",
    runtime: 130,
    genre: "Mystery / Drama",
    language: "English",
    country: "United Kingdom / United States",
    categories: ["twist-engineering", "structure-masters"],
    gradient: ["#a5323a", "#767a4c"],
    mark: "P",
    logline: "Two rival magicians destroy each other chasing the same illusion.",
    synopsis:
      "Two stage magicians escalate a professional rivalry into obsession. StoryLens studies this film for its fair-play misdirection — the trick is explained in dialogue in the first act, and most viewers file it away as flavor text.",
    why: "the method is stated out loud early, then trusted to be forgotten by the time it matters.",
    signature:
      "the phrase 'are you watching closely' opens the film and is spoken by three different characters — each time reframing what the audience is actually meant to notice.",
    cast: [
      { actor: "Hugh Jackman", role: "Robert Angier" },
      { actor: "Christian Bale", role: "Alfred Borden" },
      { actor: "Michael Caine", role: "John Cutter" },
    ],
    skills: ["twists", "structure"],
  },
  {
    slug: "memento",
    title: "Memento",
    year: 2000,
    director: "Christopher Nolan",
    runtime: 113,
    genre: "Mystery / Thriller",
    language: "English",
    country: "United States",
    categories: ["twist-engineering", "structure-masters"],
    gradient: ["#0c0a07", "#a5323a"],
    mark: "M",
    logline: "A man who can't form new memories hunts his wife's killer, one Polaroid at a time.",
    synopsis:
      "Leonard reconstructs his own investigation from notes and tattoos because his memory resets every few minutes. StoryLens studies this film for telling its story in reverse-chronological fragments, which forces the audience into the same disorientation as its protagonist.",
    why: "the structure doesn't just show the character's condition — it makes the audience experience it.",
    signature:
      "the film's two interleaved timelines (color, reversed; black-and-white, forward) meet exactly once, at the story's true chronological end — a structural collision built entirely from edit order.",
    cast: [
      { actor: "Guy Pearce", role: "Leonard Shelby" },
      { actor: "Carrie-Anne Moss", role: "Natalie" },
      { actor: "Joe Pantoliano", role: "Teddy" },
    ],
    skills: ["twists", "structure", "pacing"],
  },
  {
    slug: "mad-max-fury-road",
    title: "Mad Max: Fury Road",
    year: 2015,
    director: "George Miller",
    runtime: 120,
    genre: "Action",
    language: "English",
    country: "Australia / United States",
    categories: ["pacing-masters", "visual-storytelling"],
    gradient: ["#c9a227", "#3a1013"],
    mark: "M",
    logline: "A war rig, a warlord, and a two-hour chase that never stops moving forward.",
    synopsis:
      "Furiosa smuggles five captives across the wasteland with Immortan Joe's army in pursuit. StoryLens studies this film for pacing built almost entirely from physical geography — the story is, structurally, a straight line and then the same line reversed.",
    why: "the plot is a single direction of travel, which means every scene either helps or costs the characters that direction — nothing is filler.",
    signature:
      "the film reveals character almost entirely through action choices under pressure, not dialogue — Furiosa's defining scene has no line of exposition in it at all.",
    cast: [
      { actor: "Tom Hardy", role: "Max Rockatansky" },
      { actor: "Charlize Theron", role: "Imperator Furiosa" },
      { actor: "Nicholas Hoult", role: "Nux" },
    ],
    skills: ["pacing", "visual-storytelling"],
  },
  {
    slug: "get-out",
    title: "Get Out",
    year: 2017,
    director: "Jordan Peele",
    runtime: 104,
    genre: "Horror / Thriller",
    language: "English",
    country: "United States",
    categories: ["twist-engineering", "foreshadowing-collection"],
    gradient: ["#26280f", "#0c0a07"],
    mark: "G",
    logline: "A weekend meeting the girlfriend's parents turns into something closer to an auction.",
    synopsis:
      "Chris visits his girlfriend's family estate and notices the household staff behaving strangely. StoryLens studies this film for foreshadowing hidden inside social discomfort — the clues are visible from the opening scene, disguised as awkwardness rather than mystery.",
    why: "every warning sign is dressed up as an uncomfortable dinner-party moment instead of a genre cue, so the audience explains it away exactly like the protagonist does.",
    signature:
      "the film's title is spoken as advice in its cold open, minutes before the story even properly begins — a foreshadow so direct it reads as throwaway dialogue.",
    cast: [
      { actor: "Daniel Kaluuya", role: "Chris Washington" },
      { actor: "Allison Williams", role: "Rose Armitage" },
      { actor: "Catherine Keener", role: "Missy Armitage" },
    ],
    skills: ["twists", "foreshadowing", "theme"],
  },
  {
    slug: "the-godfather",
    title: "The Godfather",
    year: 1972,
    director: "Francis Ford Coppola",
    runtime: 175,
    genre: "Crime / Drama",
    language: "English",
    country: "United States",
    categories: ["character-studies", "structure-masters", "films-that-teach"],
    gradient: ["#0c0a07", "#c9a227"],
    mark: "G",
    logline: "The reluctant son becomes the thing his father built the family to avoid needing him to be.",
    synopsis:
      "Michael Corleone starts the film explicitly outside the family business and ends it running it. StoryLens studies this film for character transformation paced across a full runtime rather than a single turning scene.",
    why: "Michael's transformation is never announced — it's tracked through what he's willing to do in each successive scene, until the audience realizes the shift happened without a single speech about it.",
    signature:
      "Michael's opening line in the film is a defense of his family's honesty; his closing scene requires that line to have quietly become false — the film never points at the contradiction directly.",
    cast: [
      { actor: "Marlon Brando", role: "Vito Corleone" },
      { actor: "Al Pacino", role: "Michael Corleone" },
      { actor: "Diane Keaton", role: "Kay Adams" },
    ],
    skills: ["character", "structure"],
  },
  {
    slug: "the-social-network",
    title: "The Social Network",
    year: 2010,
    director: "David Fincher",
    runtime: 120,
    genre: "Drama",
    language: "English",
    country: "United States",
    categories: ["character-studies", "films-that-teach"],
    gradient: ["#767a4c", "#0c0a07"],
    mark: "S",
    logline: "The story of how a friendship ended, told entirely through depositions about a website.",
    synopsis:
      "Framed almost entirely as competing legal testimony, the film builds its protagonist's character through contradiction rather than confession. StoryLens studies this film for dialogue that reveals want and need are pointed in opposite directions.",
    why: "the character states one motivation under oath and demonstrates a completely different one on screen, and the gap between the two is the actual subject of the film.",
    signature:
      "the film's opening and closing scenes are both about being excluded from something — the shape repeats, but what's being excluded from changes entirely.",
    cast: [
      { actor: "Jesse Eisenberg", role: "Mark Zuckerberg" },
      { actor: "Andrew Garfield", role: "Eduardo Saverin" },
      { actor: "Justin Timberlake", role: "Sean Parker" },
    ],
    skills: ["character", "dialogue"],
  },
  {
    slug: "ratsasan",
    title: "Ratsasan",
    year: 2018,
    director: "Ram Kumar",
    runtime: 170,
    genre: "Crime / Thriller",
    language: "Tamil",
    country: "India",
    categories: ["structure-masters", "foreshadowing-collection"],
    gradient: ["#0c0a07", "#a5323a"],
    mark: "R",
    logline: "A film-school dropout becomes the police officer chasing a killer who studies fear like a craft.",
    synopsis:
      "Arun's early ambition to direct horror films becomes directly relevant once he's hunting a serial killer using cinematic staging. StoryLens studies this film for planting a character's specific skill set early so its later payoff feels earned rather than convenient.",
    why: "the protagonist's unrelated-seeming backstory turns out to be the exact skill the plot needs, planted almost an hour before it's used.",
    signature:
      "the killer's method mirrors horror-film staging techniques the protagonist discussed as a film student — a thematic rhyme built entirely from professional background, not coincidence.",
    cast: [
      { actor: "Vishnu Vishal", role: "Arun Kumar" },
      { actor: "Amala Paul", role: "Vidya" },
    ],
    skills: ["foreshadowing", "structure"],
  },
  {
    slug: "super-deluxe",
    title: "Super Deluxe",
    year: 2019,
    director: "Thiagarajan Kumararaja",
    runtime: 176,
    genre: "Drama / Anthology",
    language: "Tamil",
    country: "India",
    categories: ["structure-masters", "theme-collection"],
    gradient: ["#a5323a", "#767a4c"],
    mark: "S",
    logline: "Four unrelated stories about shame and forgiveness converge over one impossibly long night.",
    synopsis:
      "Separate storylines about infidelity, identity, faith, and a returning parent run in parallel before intersecting. StoryLens studies this film for braided structure — four stories that don't share characters until the ending shares a theme.",
    why: "the stories aren't connected by plot until the very end — they're connected by argument, and the film trusts the audience to feel that before it's stated.",
    signature:
      "each of the four storylines poses a version of the same question — what do you owe someone who disappointed you — well before the film lets the stories physically intersect.",
    cast: [
      { actor: "Vijay Sethupathi", role: "Shilpa" },
      { actor: "Samantha Ruth Prabhu", role: "Vaembu" },
      { actor: "Fahadh Faasil", role: "Mugilan" },
    ],
    skills: ["theme", "structure"],
  },
  {
    slug: "anbe-sivam",
    title: "Anbe Sivam",
    year: 2003,
    director: "Sundar C.",
    runtime: 160,
    genre: "Drama / Comedy",
    language: "Tamil",
    country: "India",
    categories: ["character-studies", "theme-collection"],
    gradient: ["#c9a227", "#26280f"],
    mark: "A",
    logline: "A disfigured labor activist and a vain ad filmmaker are stranded together on a road trip neither of them wants.",
    synopsis:
      "Forced travel companions with opposing worldviews slowly trade influence over the course of the journey. StoryLens studies this film for a two-hander structure where both characters change, but not symmetrically.",
    why: "the film resists the easy version of this structure where one character simply teaches the other — both are altered, at different speeds and for different reasons.",
    signature:
      "the more talkative character's silence in the film's final act is the clearest evidence of change — the film measures growth by what a character stops saying, not what they start saying.",
    cast: [
      { actor: "Kamal Haasan", role: "Nallasivam" },
      { actor: "Madhavan", role: "Anbarasu" },
    ],
    skills: ["character", "theme", "dialogue"],
  },
  {
    slug: "visaranai",
    title: "Visaranai",
    year: 2015,
    director: "Vetrimaaran",
    runtime: 122,
    genre: "Crime / Drama",
    language: "Tamil",
    country: "India",
    categories: ["structure-masters", "beautiful-failures"],
    gradient: ["#0c0a07", "#0c0a07"],
    mark: "V",
    logline: "Four migrant workers are tortured into a false confession, and the system that follows is no kinder.",
    synopsis:
      "Wrongfully accused laborers move from one corrupt institution to the next. StoryLens studies this film for structural pessimism used deliberately — every act the protagonists take to escape their situation delivers them into a worse one.",
    why: "the plot keeps offering what looks like an exit and closing it, until the pattern itself becomes the film's argument about the system.",
    signature:
      "the film is built from four sequential 'escapes,' each one structurally identical in shape to the last — a repetition that stops feeling like plot and starts feeling like structure-as-thesis.",
    cast: [
      { actor: "Dinesh Ravi", role: "Pandi" },
      { actor: "Samuthirakani", role: "Muthuvel" },
    ],
    skills: ["structure", "theme"],
  },
  {
    slug: "kaithi",
    title: "Kaithi",
    year: 2019,
    director: "Lokesh Kanagaraj",
    runtime: 145,
    genre: "Action / Thriller",
    language: "Tamil",
    country: "India",
    categories: ["pacing-masters", "structure-masters"],
    gradient: ["#767a4c", "#0c0a07"],
    mark: "K",
    logline: "An ex-convict released on the night his daughter is born gets pulled into defending a police station instead.",
    synopsis:
      "Dilli's single night unfolds in something close to real time. StoryLens studies this film for a real-time structure that uses a hard external clock — a flight his daughter needs him to meet — to justify every pacing decision in the plot.",
    why: "the ticking clock isn't a gimmick bolted onto the plot — the entire second half is organized around whether the character will make it in time, which makes every delay meaningful.",
    signature:
      "the film almost never cuts away from Dilli's night to show a flashback or subplot — the discipline of staying in one continuous timeline is what makes the real-time conceit actually work.",
    cast: [
      { actor: "Karthi", role: "Dilli" },
      { actor: "Narain", role: "Bejoy" },
    ],
    skills: ["pacing", "structure"],
  },
  {
    slug: "good-time",
    title: "Good Time",
    year: 2017,
    director: "Josh Safdie, Benny Safdie",
    runtime: 101,
    genre: "Crime / Thriller",
    language: "English",
    country: "United States",
    categories: ["pacing-masters", "beautiful-failures"],
    gradient: ["#a5323a", "#767a4c"],
    mark: "G",
    logline: "One botched bank robbery sends a small-time criminal through a single, worsening night in New York.",
    synopsis:
      "Connie improvises his way from one bad decision to the next trying to free his brother. StoryLens studies this film for pacing built from compounding consequences rather than external plot beats — nearly every scene is caused directly by the previous one.",
    why: "there is almost no downtime in the plot because every scene is a direct, escalating consequence of the one before it — cause and effect standing in for a traditional plot outline.",
    signature:
      "the film's night gets structurally worse in a straight line with no plateau scenes — a rare example of pacing with no intentional breathing room at all, which is both its signature strength and, in the back half, its most debated risk.",
    cast: [
      { actor: "Robert Pattinson", role: "Connie Nikas" },
      { actor: "Benny Safdie", role: "Nick Nikas" },
    ],
    skills: ["pacing"],
  },
  {
    slug: "uncut-gems",
    title: "Uncut Gems",
    year: 2019,
    director: "Josh Safdie, Benny Safdie",
    runtime: 135,
    genre: "Crime / Drama",
    language: "English",
    country: "United States",
    categories: ["pacing-masters", "character-studies"],
    gradient: ["#c9a227", "#a5323a"],
    mark: "U",
    logline: "A jeweler with a gambling problem keeps making the one deal that could save him worse.",
    synopsis:
      "Howard's chase for a bigger score keeps interrupting his chance to walk away with a smaller sure thing. StoryLens studies this film as an advanced pacing case — how do you sustain pressure for two hours without a single act of external calm.",
    why: "the film denies the audience nearly every natural pacing rest-point a script would normally include, which is either a masterclass in sustained tension or a cautionary example, depending which scene you ask about.",
    signature:
      "Howard is offered a clean exit from his central problem at least three separate times — the film's tension comes entirely from watching him structurally refuse each one.",
    cast: [
      { actor: "Adam Sandler", role: "Howard Ratner" },
      { actor: "Julia Fox", role: "Julia De Fiore" },
    ],
    skills: ["pacing", "character"],
  },
  {
    slug: "shoplifters",
    title: "Shoplifters",
    year: 2018,
    director: "Hirokazu Kore-eda",
    runtime: 121,
    genre: "Drama",
    language: "Japanese",
    country: "Japan",
    categories: ["character-studies", "theme-collection"],
    gradient: ["#767a4c", "#3a1013"],
    mark: "S",
    logline: "A family that isn't related by blood shares one apartment, a shoplifting habit, and a secret.",
    synopsis:
      "A patchwork household of found family members gets slowly unpacked over the course of the film. StoryLens studies this film for withholding a key structural fact until well past the midpoint without it feeling like a twist for its own sake.",
    why: "the reveal isn't built for shock — it's built to make the audience re-evaluate scenes they already found tender, which is a much harder trick to pull off than surprise alone.",
    signature:
      "the family's single group meal, repeated in variation across the film, quietly changes in composition and mood each time — a structural refrain instead of a montage.",
    cast: [
      { actor: "Lily Franky", role: "Osamu Shibata" },
      { actor: "Sakura Andô", role: "Nobuyo Shibata" },
    ],
    skills: ["theme", "character"],
  },
  {
    slug: "amour",
    title: "Amour",
    year: 2012,
    director: "Michael Haneke",
    runtime: 127,
    genre: "Drama",
    language: "French",
    country: "Austria / France",
    categories: ["theme-collection", "beautiful-failures"],
    gradient: ["#0c0a07", "#766b5a"],
    mark: "A",
    logline: "An elderly couple's apartment becomes the entire world once one of them falls seriously ill.",
    synopsis:
      "Georges cares for Anne after a stroke, almost entirely within their shared home. StoryLens studies this film for spatial storytelling — restricting nearly the whole runtime to one apartment turns the space itself into a structural device.",
    why: "confining the story to a single location isn't a budget constraint here — it's the argument, since the shrinking world mirrors exactly what's happening to the characters inside it.",
    signature:
      "the film's opening scene reveals the ending before the story begins — removing suspense on purpose so the audience watches for meaning instead of outcome.",
    cast: [
      { actor: "Jean-Louis Trintignant", role: "Georges" },
      { actor: "Emmanuelle Riva", role: "Anne" },
    ],
    skills: ["theme", "structure"],
  },
];

export function findFilm(slug: string): Film | undefined {
  return FILMS.find((f) => f.slug === slug);
}
