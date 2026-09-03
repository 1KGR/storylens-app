import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { FILMS } from "../data/films";

export function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = query.trim()
    ? FILMS.filter(
        (f) =>
          f.title.toLowerCase().includes(query.toLowerCase()) ||
          f.director.toLowerCase().includes(query.toLowerCase()) ||
          f.genre.toLowerCase().includes(query.toLowerCase()) ||
          f.categories.some((c) => c.replace(/-/g, " ").includes(query.toLowerCase()))
      ).slice(0, 8)
    : [];

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `px-3.5 py-2 rounded text-sm transition-colors ${isActive ? "text-ivory" : "text-ivory-dim hover:text-ivory"}`;

  return (
    <>
      <nav className="sticky top-0 z-[500] bg-[rgba(12,10,7,0.88)] backdrop-blur-md border-b border-line">
        <div className="max-w-[1180px] mx-auto px-5 md:px-10 h-[68px] flex items-center justify-between gap-6">
          <Link to="/" className="font-serif text-xl flex items-baseline gap-0.5 flex-shrink-0">
            Story<em className="italic text-red font-normal">Lens</em>
          </Link>
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" end className={linkCls}>
              Discover
            </NavLink>
            <NavLink to="/archive" className={linkCls}>
              Archive
            </NavLink>
            <NavLink to="/skills" className={linkCls}>
              Study
            </NavLink>
            <NavLink to="/create" className={linkCls}>
              Create
            </NavLink>
            <NavLink to="/notebook" className={linkCls}>
              Notebook
            </NavLink>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-9 h-9 flex items-center justify-center rounded text-ivory-dim hover:text-ivory hover:border-line border border-transparent"
            >
              <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7} />
                <line x1={21} y1={21} x2={16.65} y2={16.65} />
              </svg>
            </button>
            <Link
              to="/profile"
              aria-label="Profile"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-obsidian-elevated border border-line text-xs font-semibold"
            >
              KG
            </Link>
            <button
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              className="md:hidden w-9 h-9 flex items-center justify-center rounded text-ivory-dim"
            >
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1={3} y1={6} x2={21} y2={6} />
                <line x1={3} y1={12} x2={21} y2={12} />
                <line x1={3} y1={18} x2={21} y2={18} />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[900] bg-obsidian md:hidden">
          <div className="px-5 py-4 flex items-center justify-between h-[68px]">
            <span className="font-serif text-xl">
              Story<em className="italic text-red">Lens</em>
            </span>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className="w-9 h-9 flex items-center justify-center">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <line x1={18} y1={6} x2={6} y2={18} />
                <line x1={6} y1={6} x2={18} y2={18} />
              </svg>
            </button>
          </div>
          <div className="flex flex-col gap-1 px-5">
            {[
              ["/", "Discover"],
              ["/archive", "Archive"],
              ["/skills", "Study"],
              ["/create", "Create"],
              ["/notebook", "Notebook"],
              ["/tracker", "Tracker"],
              ["/path", "Learning Path"],
              ["/profile", "Profile"],
            ].map(([to, label]) => (
              <Link key={to} to={to} onClick={() => setMenuOpen(false)} className="font-serif text-xl py-3.5 px-2 border-b border-line-soft">
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {searchOpen && (
        <div
          className="fixed inset-0 z-[950] bg-[rgba(12,10,7,0.88)] backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false);
          }}
        >
          <div className="max-w-[640px] mx-auto px-5 mt-[90px]">
            <div className="flex items-center gap-3 border-b-2 border-ivory pb-2.5">
              <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <circle cx={11} cy={11} r={7} />
                <line x1={21} y1={21} x2={16.65} y2={16.65} />
              </svg>
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") setSearchOpen(false);
                  if (e.key === "Enter" && query.trim()) {
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                    setSearchOpen(false);
                  }
                }}
                placeholder="Search films, directors, topics, notes…"
                className="flex-1 bg-transparent font-serif text-2xl outline-none placeholder:text-ivory-faint"
              />
            </div>
            <div className="mt-5 flex flex-col">
              {results.map((f) => (
                <button
                  key={f.slug}
                  onClick={() => {
                    navigate(`/film/${f.slug}`);
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="flex items-center gap-3.5 py-3 border-b border-line-soft text-left hover:text-red"
                >
                  <span
                    className="w-8 h-12 rounded-sm flex-shrink-0"
                    style={{ background: `linear-gradient(155deg, ${f.gradient[0]}, ${f.gradient[1]})` }}
                  />
                  <span className="flex flex-col">
                    <strong className="font-normal">{f.title}</strong>
                    <small className="text-ivory-faint text-xs">
                      {f.genre} · {f.year}
                    </small>
                  </span>
                </button>
              ))}
              {query.trim() && results.length === 0 && <div className="text-ivory-faint py-5 italic">No films match “{query}”.</div>}
            </div>
            <div className="mt-8 text-ivory-faint text-sm">Press Esc to close</div>
          </div>
        </div>
      )}
    </>
  );
}
