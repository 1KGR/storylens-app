import { useEffect, useState } from "react";
import type { Film } from "../data/films";
import { searchMovie, getMovieDetailsWithImages, posterUrl, backdropUrl, logoUrl } from "./tmdb";
import { hasTmdbKey } from "./env";

export interface ResolvedArt {
  posterUrl: string | null;
  backdropUrl: string | null;
  /** A wide "still/frame" image for this film — currently the resolved backdrop, kept as a
   * distinct field so callers that want a frame rather than a poster have a stable name to use. */
  stillUrl: string | null;
  logoUrl: string | null;
  source: "tmdb" | "generated";
}

const EMPTY_ART: ResolvedArt = { posterUrl: null, backdropUrl: null, stillUrl: null, logoUrl: null, source: "generated" };

const cache = new Map<string, ResolvedArt>();

async function resolve(film: Film): Promise<ResolvedArt> {
  if (!hasTmdbKey()) return EMPTY_ART;
  const found = await searchMovie(film.title, film.year);
  if (!found) return EMPTY_ART;
  const details = await getMovieDetailsWithImages(found.id);
  const movie = details ?? found;
  const backdrop = backdropUrl(movie.backdrop_path);
  const logo = details?.images?.logos?.[0]?.file_path ? logoUrl(details.images.logos[0].file_path) : null;
  return {
    posterUrl: posterUrl(movie.poster_path),
    backdropUrl: backdrop,
    stillUrl: backdrop,
    logoUrl: logo,
    source: "tmdb",
  };
}

/**
 * Resolves real poster/backdrop/logo art for a film when a TMDB key is configured.
 * Without one — the default in this prototype — it resolves immediately to
 * `source: "generated"` and callers should render the existing gradient +
 * mark cover, which is StoryLens's own generated art, not a copyrighted image.
 */
export function useFilmArt(film: Film): ResolvedArt {
  const [art, setArt] = useState<ResolvedArt>(() => cache.get(film.slug) ?? EMPTY_ART);

  useEffect(() => {
    let cancelled = false;
    const cached = cache.get(film.slug);
    if (cached) {
      setArt(cached);
      return;
    }
    if (!hasTmdbKey()) return; // stay on the generated fallback, no request to make
    resolve(film).then((result) => {
      if (cancelled) return;
      cache.set(film.slug, result);
      setArt(result);
    });
    return () => {
      cancelled = true;
    };
  }, [film.slug]);

  return art;
}
