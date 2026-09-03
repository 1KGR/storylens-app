import { Link, useParams } from "react-router-dom";
import { FILMS } from "../data/films";
import { SKILLS } from "../data/taxonomy";

export default function StudyBySkill() {
  const { slug } = useParams();
  const skill = SKILLS.find((s) => s.slug === slug);

  if (!skill) {
    return (
      <section className="max-w-[1180px] mx-auto px-5 md:px-10 pb-20">
        <div className="pt-10 pb-6 border-b border-line">
          <h1 className="font-serif italic text-4xl mb-2">Study by skill</h1>
          <p className="text-ivory-dim max-w-[60ch]">Tell StoryLens what you want to get better at, and it recommends the films that teach it best.</p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 pt-8">
          {SKILLS.map((s) => (
            <Link key={s.slug} to={`/skills/${s.slug}`} className="border border-line rounded-sm p-5 bg-obsidian-elevated hover:border-gold transition">
              <h3 className="font-serif text-lg mb-1.5">I want to improve {s.label.toLowerCase()}</h3>
              <p className="text-ivory-faint text-sm">{s.description}</p>
            </Link>
          ))}
        </div>
        <div className="pt-10">
          <Link to="/path" className="text-ivory-dim hover:text-red text-sm">
            View my learning path →
          </Link>
        </div>
      </section>
    );
  }

  const recs = FILMS.filter((f) => f.skills.includes(skill.slug));

  return (
    <section className="max-w-[900px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-5">
        <Link to="/skills" className="text-ivory-dim hover:text-red text-sm">
          ← All skills
        </Link>
      </div>
      <div className="pt-6 mb-8">
        <div className="font-hand text-red text-xl -rotate-1 inline-block">“I want to improve {skill.label.toLowerCase()}.”</div>
        <h1 className="font-serif italic text-3xl mt-2">{skill.label}</h1>
        <p className="text-ivory-dim mt-2 max-w-[60ch]">{skill.description}</p>
      </div>

      <div className="space-y-5">
        {recs.map((f) => (
          <div key={f.slug} className="border border-line rounded bg-obsidian-elevated p-5 flex gap-5">
            <div className="w-20 aspect-[2/3] rounded-sm flex-shrink-0" style={{ background: `linear-gradient(155deg, ${f.gradient[0]}, ${f.gradient[1]})` }} />
            <div className="flex-1">
              <h3 className="font-serif text-lg">{f.title}</h3>
              <div className="text-ivory-faint text-sm mb-2">
                {f.year} · {f.director}
              </div>
              <div className="text-[0.72rem] uppercase tracking-wide text-ivory-faint mb-1">What to study</div>
              <p className="text-sm text-ivory-dim mb-2">{f.signature}</p>
              <div className="text-[0.72rem] uppercase tracking-wide text-ivory-faint mb-1">Why</div>
              <p className="text-sm text-ivory-dim mb-2">{f.why}</p>
              <Link to={`/film/${f.slug}`} className="text-red text-sm mt-1 inline-block">
                Open the case →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
