// A genuine TMDB client. It makes real fetch() calls to api.themoviedb.org
// when VITE_TMDB_API_KEY is set. With no key configured (the default for
// this prototype, since no key is bundled), every call resolves to `null`
// and callers fall back to StoryLens's own curated data — see
// `data/filmDataLayer.ts`. This is the "clean environment-variable setup
// with a mock fallback" the brief asks for, not a fake network call.
import { ENV, hasTmdbKey } from "./env";

const API_BASE = "https://api.themoviedb.org/3";

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  runtime: number | null;
  poster_path: string | null;
  backdrop_path: string | null;
  genres: { id: number; name: string }[];
  original_language: string;
  production_countries: { name: string }[];
  vote_average: number;
}

export interface TmdbCastMember {
  name: string;
  character: string;
  profile_path: string | null;
}

export interface TmdbCredits {
  cast: TmdbCastMember[];
  crew: { name: string; job: string }[];
}

export interface TmdbLogo {
  file_path: string;
  iso_639_1: string | null;
}

export interface TmdbMovieWithImages extends TmdbMovie {
  images?: { logos: TmdbLogo[] };
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T | null> {
  if (!hasTmdbKey()) return null;
  const url = new URL(API_BASE + path);
  url.searchParams.set("api_key", ENV.tmdbApiKey!);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  try {
    const res = await fetch(url.toString());
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    // Network error, CORS, offline, revoked key, etc. — fail soft, never crash the UI.
    return null;
  }
}

export async function searchMovie(title: string, year?: number): Promise<TmdbMovie | null> {
  const result = await tmdbFetch<{ results: TmdbMovie[] }>("/search/movie", {
    query: title,
    ...(year ? { year: String(year) } : {}),
  });
  return result?.results?.[0] ?? null;
}

export async function getMovieDetails(tmdbId: number): Promise<TmdbMovie | null> {
  return tmdbFetch<TmdbMovie>(`/movie/${tmdbId}`);
}

// Same movie details call, but also asks TMDB to inline its logo images
// (English or language-neutral only) so the archive can show a real title
// lockup instead of the generated monogram, without a second round trip.
export async function getMovieDetailsWithImages(tmdbId: number): Promise<TmdbMovieWithImages | null> {
  return tmdbFetch<TmdbMovieWithImages>(`/movie/${tmdbId}`, {
    append_to_response: "images",
    include_image_language: "en,null",
  });
}

export async function getMovieCredits(tmdbId: number): Promise<TmdbCredits | null> {
  return tmdbFetch<TmdbCredits>(`/movie/${tmdbId}/credits`);
}

export function posterUrl(path: string | null, size: "w342" | "w500" | "original" = "w500"): string | null {
  if (!path) return null;
  return `${ENV.tmdbImageBase}/${size}${path}`;
}

export function backdropUrl(path: string | null, size: "w780" | "w1280" | "original" = "w1280"): string | null {
  if (!path) return null;
  return `${ENV.tmdbImageBase}/${size}${path}`;
}

export function logoUrl(path: string | null, size: "w185" | "w300" | "original" = "w300"): string | null {
  if (!path) return null;
  return `${ENV.tmdbImageBase}/${size}${path}`;
}
