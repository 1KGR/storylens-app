import { Link } from "react-router-dom";
import { useStore } from "../state/store";
import { findFilm } from "../data/films";
import { SKILLS } from "../data/taxonomy";

export default function StudyPathPage() {
  const { studyPath } = useStore();
  const skill = SKILLS.find((s) => s.slug === studyPath.skillSlug)!;
  const current = findFilm(studyPath.current)!;
  const next = findFilm(studyPath.recommendedNext)!;

  return (
    <section className="max-w-[720px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-10 pb-6 border-b border-line">
        <div className="text-red text-sm mb-2">My Learning Path</div>
        <h1 className="font-serif italic text-4xl mb-2">You are studying: {skill.label}</h1>
        <p className="text-ivory-dim">{skill.description}</p>
      </div>

      <div className="mt-8">
        <h3 className="font-serif text-lg mb-3 text-ivory-faint">Completed</h3>
        <div className="space-y-3 mb-8">
          {studyPath.completed.map((slug, i) => {
            const f = findFilm(slug);
            if (!f) return null;
            return (
              <Link key={slug} to={`/film/${slug}`} className="flex items-center gap-4 border border-line rounded p-3 hover:border-gold">
                <span className="w-7 h-7 rounded-full bg-gold text-obsidian flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {i + 1}
                </span>
                <div className="w-10 aspect-[2/3] rounded-sm" style={{ background: `linear-gradient(155deg, ${f.gradient[0]}, ${f.gradient[1]})` }} />
                <span className="font-serif">{f.title}</span>
                <span className="ml-auto text-gold-bright text-sm">✓ Studied</span>
              </Link>
            );
          })}
        </div>

        <h3 className="font-serif text-lg mb-3 text-ivory-faint">Current</h3>
        <Link to={`/film/${current.slug}`} className="flex items-center gap-4 border-2 border-red rounded p-4 mb-8 hover:bg-red/10">
          <span className="w-7 h-7 rounded-full border border-red text-red flex items-center justify-center text-sm font-semibold flex-shrink-0">
            {studyPath.completed.length + 1}
          </span>
          <div className="w-10 aspect-[2/3] rounded-sm" style={{ background: `linear-gradient(155deg, ${current.gradient[0]}, ${current.gradient[1]})` }} />
          <div>
            <span className="font-serif block">{current.title}</span>
            <span className="text-red text-sm">Currently studying</span>
          </div>
        </Link>

        <h3 className="font-serif text-lg mb-3 text-ivory-faint">Recommended next</h3>
        <Link to={`/film/${next.slug}`} className="flex items-center gap-4 border border-dashed border-line rounded p-4 hover:border-gold">
          <span className="w-7 h-7 rounded-full border border-line text-ivory-faint flex items-center justify-center text-sm flex-shrink-0">
            {studyPath.completed.length + 2}
          </span>
          <div className="w-10 aspect-[2/3] rounded-sm" style={{ background: `linear-gradient(155deg, ${next.gradient[0]}, ${next.gradient[1]})` }} />
          <span className="font-serif">{next.title}</span>
        </Link>
      </div>
    </section>
  );
}
