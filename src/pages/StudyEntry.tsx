import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { findFilm } from "../data/films";
import { ROLES } from "../data/taxonomy";

export default function StudyEntry() {
  const { slug } = useParams();
  const film = findFilm(slug ?? "");
  const [selected, setSelected] = useState<string[]>(["writer"]);
  const navigate = useNavigate();

  if (!film) return <div className="max-w-[1180px] mx-auto px-5 py-16">Film not found.</div>;

  const toggle = (id: string) => {
    setSelected((s) => {
      const next = s.includes(id) ? s.filter((x) => x !== id) : [...s, id];
      return next.length ? next : s;
    });
  };

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-5">
        <Link to={`/film/${film.slug}`} className="text-ivory-dim hover:text-red text-sm">
          ← Back to {film.title}
        </Link>
      </div>
      <div className="pt-8">
        <span className="font-hand text-red text-xl -rotate-1 inline-block">Study Mode</span>
        <h1 className="font-serif italic text-4xl mt-1.5 mb-2.5">What are you studying?</h1>
        <p className="text-ivory-dim max-w-[62ch]">
          Pick one or more lenses. The same film reveals different things depending who's asking — a writer and a
          cinematographer walk away with different notes on {film.title}.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5 mt-8">
        {ROLES.map((r) => {
          const isSel = selected.includes(r.id);
          return (
            <button
              key={r.id}
              onClick={() => toggle(r.id)}
              className={`text-left border rounded-sm p-4.5 relative transition ${isSel ? "border-gold" : "border-line hover:-translate-y-0.5"} bg-obsidian-elevated`}
            >
              <span
                className={`absolute top-3.5 right-3.5 w-[18px] h-[18px] rounded-full border flex items-center justify-center text-xs ${isSel ? "bg-gold border-gold text-obsidian" : "border-line"}`}
              >
                {isSel ? "✓" : ""}
              </span>
              <h4 className="font-serif font-semibold text-[1.08rem] mb-1.5">{r.label}</h4>
              <p className="text-ivory-faint text-[0.84rem] leading-snug">{r.blurb}</p>
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-4 mt-7 pb-10 flex-wrap">
        <button
          onClick={() => navigate(`/study/${film.slug}/report?roles=${selected.join(",")}`)}
          className="bg-red text-ivory font-semibold px-6 py-3 rounded-sm"
        >
          Begin study
        </button>
        <span className="text-ivory-faint text-sm">
          {selected.length} role{selected.length === 1 ? "" : "s"} selected
        </span>
      </div>
    </section>
  );
}
