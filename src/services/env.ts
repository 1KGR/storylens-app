// Central place to read environment configuration. Vite only exposes
// variables prefixed VITE_ to client code — nothing here is a secret key
// that should ever live in a browser bundle in production; VITE_AI_ENDPOINT
// is meant to point at a server-side route that holds the real provider key.
export const ENV = {
  tmdbApiKey: import.meta.env.VITE_TMDB_API_KEY as string | undefined,
  tmdbImageBase: (import.meta.env.VITE_TMDB_IMAGE_BASE as string | undefined) ?? "https://image.tmdb.org/t/p",
  aiEndpoint: import.meta.env.VITE_AI_ENDPOINT as string | undefined,
};

export const hasTmdbKey = () => Boolean(ENV.tmdbApiKey);
export const hasAiEndpoint = () => Boolean(ENV.aiEndpoint);
