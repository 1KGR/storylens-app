import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FILMS } from "../data/films";
import { COLLECTIONS } from "../data/taxonomy";
import { ShelfRow } from "../components/ShelfRow";
import { useCaseStage } from "../state/caseStage";

const SORTS = [
  { id: "recent", label: "Recently added" },
  { id: "studied", label: "Most studied" },
  { id: "discussed", label: "Most discussed" },
  { id: "rated", label: "Highest rated" },
  { id: "writers", label: "Most useful for writers" },
] as const;

export default function Archive() {
  const [params, setParams] = useSearchParams();
  const activeCat = params.get("category");
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [country, setCountry] = useState("All");
  const [sort, setSort] = useState<(typeof SORTS)[number]["id"]>("recent");
  const { stage, requestOpen } = useCaseStage();

  const genres = useMemo(() => ["All", ...new Set(FILMS.map((f) => f.genre))], []);
  const countries = useMemo(() => ["All", ...new Set(FILMS.map((f) => f.country))], []);

  const filtered = useMemo(() => {
    let list = FILMS.filter((f) => {
      if (query && !`${f.title} ${f.director}`.toLowerCase().includes(query.toLowerCase())) return false;
      if (genre !== "All" && f.genre !== genre) return false;
      if (country !== "All" && f.country !== country) return false;
      return true;
    });
    if (sort === "writers") list = [...list].sort((a, b) => (b.skills.includes("character") ? 1 : 0) - (a.skills.includes("character") ? 1 : 0));
    if (sort === "rated") list = [...list].sort((a, b) => b.year - a.year);
    return list;
  }, [query, genre, country, sort]);

  const cats = activeCat ? COLLECTIONS.filter((c) => c.slug === activeCat) : COLLECTIONS;

  return (
    <section className="max-w-[1180px] mx-auto px-5 md:px-10 pb-24">
      <div className="pt-12 pb-4 border-b border-line">
        <h1 className="font-serif italic text-4xl md:text-[2.6rem] mb-2.5">The Archive</h1>
        <p className="text-ivory-dim max-w-[60ch] mb-7 leading-relaxed">
          Every case here has been chosen and studied on purpose. Quality of analysis over size of catalog.
        </p>

        <div className="flex flex-wrap gap-3 mb-6">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search archive…"
            className="flex-1 min-w-[200px] bg-obsidian-elevated border border-line rounded-full px-4 py-2 text-sm outline-none focus:border-gold transition-colors duration-150"
          />
          <select
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            className="bg-obsidian-elevated border border-line rounded-full px-3 py-2 text-sm focus:border-gold transition-colors duration-150"
          >
            {genres.map((g) => (
              <option key={g}>{g}</option>
            ))}
          </select>
          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="bg-obsidian-elevated border border-line rounded-full px-3 py-2 text-sm focus:border-gold transition-colors duration-150"
          >
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="bg-obsidian-elevated border border-line rounded-full px-3 py-2 text-sm focus:border-gold transition-colors duration-150"
          >
            {SORTS.map((s) => (
              <option key={s.id} value={s.id}>
                Sort: {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap gap-2 pb-7">
          <button
            onClick={() => setParams({})}
            className={`rounded-full px-3.5 py-1.5 text-sm border transition-colors duration-150 ${!activeCat ? "bg-red border-red" : "border-line text-ivory-dim hover:border-gold"}`}
          >
            All
          </button>
          {COLLECTIONS.map((c) => (
            <button
              key={c.slug}
              onClick={() => setParams({ category: c.slug })}
              className={`rounded-full px-3.5 py-1.5 text-sm border transition-colors duration-150 ${activeCat === c.slug ? "bg-red border-red" : "border-line text-ivory-dim hover:border-gold"}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {cats.map((cat) => {
        const films = filtered.filter((f) => f.categories.includes(cat.slug));
        if (films.length === 0) return null;
        return (
          <div key={cat.slug} className="pt-12">
            <div className="flex items-baseline gap-2.5 mb-5">
              <h3 className="font-serif italic text-[1.4rem]">{cat.name}</h3>
              <span className="text-ivory-faint text-sm">
                {films.length} case{films.length > 1 ? "s" : ""} on this shelf
              </span>
            </div>
            <div className="relative overflow-x-auto overflow-y-visible pb-7 pt-5">
              {/* soft overhead gallery light, restrained — sells depth without a literal 3D room */}
              <div
                className="absolute left-0 right-0 top-0 h-24 pointer-events-none"
                style={{ background: "radial-gradient(60% 100% at 50% 0%, rgba(201,162,39,0.05), transparent 75%)" }}
              />
              <ShelfRow films={films} openSlug={stage.slug} onOpen={requestOpen} />
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && <div className="py-20 text-center text-ivory-faint">No films match those filters.</div>}
    </section>
  );
}
