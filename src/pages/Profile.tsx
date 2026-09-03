import { Link } from "react-router-dom";
import { useStore } from "../state/store";
import { findFilm } from "../data/films";

export default function Profile() {
  const { notes, watchlist, progress, drafts } = useStore();

  const stats = [
    { label: "Films studied", value: new Set(progress.map((p) => p.filmSlug)).size },
    { label: "Stories analyzed", value: drafts.length },
    { label: "Notes", value: notes.length },
    { label: "Skills studied", value: new Set(progress.map((p) => p.roleId)).size + 6 },
  ];

  return (
    <section className="max-w-[820px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-10 pb-8 border-b border-line flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-obsidian-elevated border border-line flex items-center justify-center font-serif text-xl">
          KG
        </div>
        <div>
          <h1 className="font-serif italic text-3xl">KGR</h1>
          <p className="text-ivory-faint text-sm">Studying pacing · {watchlist.length} on watchlist</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 my-8">
        {stats.map((s) => (
          <div key={s.label} className="border border-line rounded p-4 text-center">
            <div className="text-3xl font-serif">{s.value}</div>
            <div className="text-ivory-faint text-xs mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Link to="/archive" className="border border-line rounded p-5 hover:border-gold">
          <h3 className="font-serif mb-1">My Films</h3>
          <p className="text-ivory-faint text-sm">{watchlist.length} on watchlist</p>
        </Link>
        <Link to="/skills" className="border border-line rounded p-5 hover:border-gold">
          <h3 className="font-serif mb-1">My Studies</h3>
          <p className="text-ivory-faint text-sm">{progress.length} in progress</p>
        </Link>
        <Link to="/notebook" className="border border-line rounded p-5 hover:border-gold">
          <h3 className="font-serif mb-1">My Notes</h3>
          <p className="text-ivory-faint text-sm">{notes.length} saved</p>
        </Link>
        <Link to="/tracker" className="border border-line rounded p-5 hover:border-gold">
          <h3 className="font-serif mb-1">My Stories</h3>
          <p className="text-ivory-faint text-sm">Draft {drafts[drafts.length - 1].number}</p>
        </Link>
        <Link to="/path" className="border border-line rounded p-5 hover:border-gold sm:col-span-2">
          <h3 className="font-serif mb-1">My Learning Path</h3>
          <p className="text-ivory-faint text-sm">Currently studying pacing</p>
        </Link>
      </div>

      {watchlist.length > 0 && (
        <div className="mt-10">
          <h3 className="font-serif text-lg mb-4">Watchlist</h3>
          <div className="flex gap-4 flex-wrap">
            {watchlist.map((slug) => {
              const f = findFilm(slug);
              if (!f) return null;
              return (
                <Link key={slug} to={`/film/${slug}`} className="w-20">
                  <div className="w-full aspect-[2/3] rounded-sm mb-1.5" style={{ background: `linear-gradient(155deg, ${f.gradient[0]}, ${f.gradient[1]})` }} />
                  <div className="text-xs font-serif">{f.title}</div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
