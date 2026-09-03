import { Link, useParams } from "react-router-dom";
import { findFilm } from "../data/films";
import { getScenes } from "../lib/sceneAnatomy";

const FIELDS: [string, keyof ReturnType<typeof getScenes>[number]][] = [
  ["Scene purpose", "purpose"],
  ["Conflict", "conflict"],
  ["Character objective", "objective"],
  ["Information revealed", "information"],
  ["Reversal", "reversal"],
  ["Emotional change", "emotionalChange"],
  ["Visual choice", "visualChoice"],
  ["Sound choice", "soundChoice"],
  ["Exit hook", "exitHook"],
];

export default function SceneAnatomy() {
  const { slug } = useParams();
  const film = findFilm(slug ?? "");
  if (!film) return <div className="max-w-[1180px] mx-auto px-5 py-16">Film not found.</div>;
  const scenes = getScenes(film);

  return (
    <section className="max-w-[900px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-5">
        <Link to={`/film/${film.slug}`} className="text-ivory-dim hover:text-red text-sm">
          ← Back to {film.title}
        </Link>
      </div>
      <div className="pt-6 mb-8">
        <div className="text-red text-sm mb-2">Scene Anatomy</div>
        <h1 className="font-serif italic text-3xl">{film.title}</h1>
      </div>

      {scenes.map((s, i) => (
        <div key={i} className="border border-line rounded bg-obsidian-elevated p-6 md:p-7 mb-6">
          <div className="flex items-baseline justify-between gap-3 flex-wrap mb-4">
            <h3 className="font-serif italic text-xl">{s.title}</h3>
            <span className="text-gold-bright text-sm font-mono">{s.timestamp}</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {FIELDS.map(([label, key]) => (
              <div key={key}>
                <div className="text-[0.72rem] uppercase tracking-wide text-ivory-faint mb-1">{label}</div>
                <p className="text-[0.92rem] text-ivory-dim leading-relaxed">{s[key]}</p>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-line-soft">
            <div className="text-[0.72rem] uppercase tracking-wide text-red mb-1">Why does this scene exist?</div>
            <p className="text-[0.95rem] leading-relaxed">{s.whyExists}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
