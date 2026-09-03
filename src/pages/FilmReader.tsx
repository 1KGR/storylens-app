import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { findFilm, FILMS } from "../data/films";
import { CaseInteriorSpread, MobileNotesDisc } from "../components/CaseInteriorSpread";
import { CaseBookletSections } from "../components/CaseBookletSections";
import { useTrailer } from "../components/TrailerModal";
import { useStore } from "../state/store";
import { useFilmArt } from "../services/filmDataLayer";
import { reduceEffects } from "../state/caseStage";

const CaseCanvas3D = lazy(() => import("../three/CaseCanvas3D").then((m) => ({ default: m.CaseCanvas3D })));

export default function FilmReader() {
  const { slug } = useParams();
  const film = findFilm(slug ?? "");
  const navigate = useNavigate();
  const { open: openTrailer } = useTrailer();
  const { toggleWatchlist, isWatchlisted } = useStore();
  // Hooks must run unconditionally — fall back to the first catalog film for
  // the art lookup when the slug doesn't resolve; the render guard below
  // means its result is simply never used in that case.
  const art = useFilmArt(film ?? FILMS[0]);
  const [open3D, setOpen3D] = useState(reduceEffects());
  const reviewsRef = useRef<HTMLDivElement>(null);
  const use3D = !reduceEffects();

  useEffect(() => {
    if (!use3D) return;
    const t = setTimeout(() => setOpen3D(true), 350);
    return () => clearTimeout(t);
  }, [use3D]);

  if (!film) {
    return (
      <div className="max-w-[1180px] mx-auto px-5 md:px-10 py-16">
        Film not found. <Link to="/archive" className="text-red">Back to archive</Link>
      </div>
    );
  }

  const watchlisted = isWatchlisted(film.slug);

  return (
    <section className="pb-20">
      {/* atmospheric hero — real TMDB backdrop when configured, StoryLens's own
          gradient wash (derived from the film's cover colors) otherwise */}
      <div className="relative overflow-hidden border-b border-line">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: art.backdropUrl
              ? `linear-gradient(180deg, rgba(6,5,4,0.55), rgba(6,5,4,0.92)), url(${art.backdropUrl})`
              : `radial-gradient(85% 100% at 15% 0%, ${film.gradient[0]}59, transparent 62%), radial-gradient(100% 90% at 95% 100%, ${film.gradient[1]}4d, transparent 58%), linear-gradient(180deg, rgba(6,5,4,0.15), rgba(6,5,4,0.75))`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(6,5,4,0.15) 0%, rgba(6,5,4,0.55) 100%)" }} />
        <div className="relative max-w-[1180px] mx-auto px-5 md:px-10 pt-8 pb-14">
          <button onClick={() => navigate(-1)} className="text-ivory-dim hover:text-red text-sm inline-flex items-center gap-1.5 transition-colors duration-150 mb-8">
            ← Back to archive
          </button>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}>
            <div className="text-red text-[0.82rem] mb-2.5 tracking-wide uppercase">{film.categories[0]?.replace(/-/g, " ")}</div>
            <h1 className="font-serif italic text-4xl md:text-6xl mb-3 max-w-[16ch]">{film.title}</h1>
            <div className="text-ivory-dim text-[0.95rem] space-x-2 mb-5">
              <span>{film.year}</span>
              <span>·</span>
              <span>{film.director}</span>
              <span>·</span>
              <span>{film.runtime} min</span>
            </div>
            <p className="font-serif italic text-xl text-ivory-dim mb-7 leading-relaxed max-w-[54ch]">{film.logline}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.12, ease: "easeOut" }}
            className="flex gap-3 flex-wrap"
          >
            <button onClick={() => openTrailer(film.title, "Watch")} className="bg-red text-ivory text-sm font-semibold px-6 py-3 rounded-sm hover:brightness-110 transition">
              ▷ Watch
            </button>
            <button onClick={() => openTrailer(film.title, "Trailer")} className="border border-ivory/25 backdrop-blur-sm text-sm font-semibold px-6 py-3 rounded-sm hover:border-gold transition-colors">
              Trailer
            </button>
            <button
              onClick={() => reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="border border-ivory/25 backdrop-blur-sm text-sm font-semibold px-6 py-3 rounded-sm hover:border-gold transition-colors"
            >
              Reviews
            </button>
            <Link to={`/study/${film.slug}`} className="border-2 border-gold/70 text-sm font-semibold px-6 py-3 rounded-sm hover:border-gold transition-colors">
              ✦ Study
            </Link>
            <button
              onClick={() => toggleWatchlist(film.slug)}
              className="border border-ivory/25 text-sm font-semibold px-6 py-3 rounded-sm transition-colors"
              style={{ borderColor: watchlisted ? "var(--color-gold)" : undefined }}
            >
              {watchlisted ? "✓ On watchlist" : "+ Watchlist"}
            </button>
          </motion.div>
        </div>
      </div>

      {/* the physical object — a real Three.js case on capable devices, the
          established CSS case (already-open, no WebGL) on mobile/reduced-motion */}
      <div className="max-w-[680px] mx-auto px-5 md:px-10">
        {use3D && (
          <div className="w-[min(300px,62vw)] mx-auto mt-10" style={{ aspectRatio: "2 / 3" }}>
            <Suspense fallback={null}>
              <CaseCanvas3D film={film} open={open3D} pickedUp={false} />
            </Suspense>
          </div>
        )}

        {use3D ? (
          <div className="w-[min(300px,62vw)] mx-auto -mt-1">
            <CaseInteriorSpread film={film} onWatch={() => openTrailer(film.title, "Watch")} onTrailer={() => openTrailer(film.title, "Trailer")} flat />
          </div>
        ) : (
          <MobileNotesDisc film={film} onWatch={() => openTrailer(film.title, "Watch")} onTrailer={() => openTrailer(film.title, "Trailer")} />
        )}

        <div ref={reviewsRef} />
        <CaseBookletSections film={film} />
      </div>
    </section>
  );
}
