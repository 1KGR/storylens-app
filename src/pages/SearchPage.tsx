import { Link, useSearchParams } from "react-router-dom";
import { FILMS } from "../data/films";
import { COLLECTIONS } from "../data/taxonomy";
import { useStore } from "../state/store";

export default function SearchPage() {
  const [params] = useSearchParams();
  const q = (params.get("q") ?? "").toLowerCase();
  const { notes } = useStore();

  const films = q ? FILMS.filter((f) => `${f.title} ${f.director} ${f.genre}`.toLowerCase().includes(q)) : [];
  const collections = q ? COLLECTIONS.filter((c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) : [];
  const matchedNotes = q ? notes.filter((n) => n.text.toLowerCase().includes(q) || n.tags.some((t) => t.includes(q))) : [];

  return (
    <section className="max-w-[820px] mx-auto px-5 md:px-10 pb-20">
      <div className="pt-10 pb-6 border-b border-line">
        <h1 className="font-serif italic text-3xl">Search results for “{params.get("q")}”</h1>
      </div>

      {films.length > 0 && (
        <div className="mt-8">
          <h3 className="font-serif text-lg mb-3">Films</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {films.map((f) => (
              <Link key={f.slug} to={`/film/${f.slug}`} className="flex items-center gap-3 border border-line rounded p-3 hover:border-gold">
                <span className="w-9 h-13 rounded-sm flex-shrink-0" style={{ background: `linear-gradient(155deg, ${f.gradient[0]}, ${f.gradient[1]})`, height: 52, width: 36 }} />
                <div>
                  <div className="font-serif">{f.title}</div>
                  <div className="text-ivory-faint text-xs">{f.director}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {collections.length > 0 && (
        <div className="mt-8">
          <h3 className="font-serif text-lg mb-3">Collections</h3>
          <div className="flex flex-wrap gap-2">
            {collections.map((c) => (
              <Link key={c.slug} to={`/archive?category=${c.slug}`} className="border border-line rounded-full px-4 py-2 text-sm hover:border-gold">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
      )}

      {matchedNotes.length > 0 && (
        <div className="mt-8">
          <h3 className="font-serif text-lg mb-3">My Notes</h3>
          <div className="space-y-3">
            {matchedNotes.map((n) => (
              <div key={n.id} className="border-t border-line-soft pt-3">
                “{n.text}”
              </div>
            ))}
          </div>
        </div>
      )}

      {q && films.length === 0 && collections.length === 0 && matchedNotes.length === 0 && (
        <p className="text-ivory-faint italic mt-8">Nothing found for “{params.get("q")}”.</p>
      )}
    </section>
  );
}
