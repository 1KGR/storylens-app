import { useEffect } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { findFilm } from "../data/films";
import { ROLES } from "../data/taxonomy";
import { getFindings } from "../lib/findings";
import { FindingCard } from "../components/shared";
import { useStore } from "../state/store";

const DNA_CATEGORIES = ["Structure", "Character", "Pacing", "Conflict", "Theme", "Twist", "Foreshadowing", "Visual", "Payoff", "Dialogue"];

function dnaScore(seed: string, cat: string) {
  let h = 0;
  const s = seed + cat;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) % 97;
  return 45 + (h % 50);
}

export default function StudyReport() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const film = findFilm(slug ?? "");
  const roleIds = (params.get("roles") ?? "writer").split(",").filter(Boolean);
  const roles = ROLES.filter((r) => roleIds.includes(r.id));
  const { setProgress } = useStore();

  useEffect(() => {
    if (film && roleIds[0]) {
      setProgress(film.slug, roleIds[0], 100);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [film?.slug, roleIds[0]]);

  if (!film) return <div className="max-w-[1180px] mx-auto px-5 py-16">Film not found.</div>;

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-5 flex justify-between items-start gap-4 flex-wrap">
        <div>
          <Link to={`/film/${film.slug}`} className="text-ivory-dim hover:text-red text-sm">
            ← Back to {film.title}
          </Link>
          <div className="text-red text-[0.82rem] mt-4">{film.categories[0]?.replace(/-/g, " ")}</div>
          <h1 className="font-serif italic text-4xl mt-1 mb-2">{film.title}</h1>
          <div className="flex gap-2 flex-wrap mt-2">
            {roles.map((r) => (
              <span key={r.id} className="border border-line rounded-full px-3 py-1 text-sm text-ivory-dim">
                {r.label}
              </span>
            ))}
          </div>
        </div>
        <Link to={`/study/${film.slug}`} className="border border-line font-semibold px-4 py-2.5 rounded-sm text-sm">
          Change roles
        </Link>
      </div>

      <div className="border border-line rounded bg-obsidian-elevated p-6 md:p-7 mt-8">
        <h3 className="font-serif text-lg mb-1">Story DNA</h3>
        <div className="text-ivory-faint text-sm mb-6">A structural fingerprint — not a bare score. Every category links to why.</div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-5">
          {DNA_CATEGORIES.map((cat) => {
            const score = dnaScore(film.slug, cat);
            return (
              <div key={cat}>
                <div className="flex justify-between text-xs text-ivory-faint mb-1">
                  <span>{cat}</span>
                  <span>{score}</span>
                </div>
                <div className="h-1.5 bg-line rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${score}%`, background: score > 75 ? "var(--color-gold)" : score > 55 ? "var(--color-red)" : "var(--color-olive)" }}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-6 pt-5 border-t border-line-soft text-sm text-ivory-dim">
          Story DNA describes shape, not verdict — a low Pacing score on a deliberately slow film isn't a flaw, it's a data point. Read the findings below for why.
        </div>
      </div>

      {roles.map((role) => {
        const findings = getFindings(film, role);
        return (
          <div key={role.id} className="mt-10">
            <div className="flex items-baseline justify-between mb-5">
              <h2 className="font-serif text-2xl">{role.label} findings</h2>
              <span className="text-ivory-faint text-sm">What / where / why / impact / how to learn</span>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {findings.map((f, i) => (
                <FindingCard key={i} f={f} index={i} />
              ))}
            </div>
          </div>
        );
      })}

      <div className="mt-10 pt-6 border-t border-line flex flex-wrap gap-3">
        <Link to={`/scenes/${film.slug}`} className="border border-line rounded-sm px-5 py-3 text-sm hover:border-gold">
          Open Scene Anatomy →
        </Link>
        <Link to="/notebook" className="border border-line rounded-sm px-5 py-3 text-sm hover:border-gold">
          Take a note on this film →
        </Link>
        <Link to="/skills" className="border border-line rounded-sm px-5 py-3 text-sm hover:border-gold">
          Study by skill instead →
        </Link>
      </div>
    </section>
  );
}
