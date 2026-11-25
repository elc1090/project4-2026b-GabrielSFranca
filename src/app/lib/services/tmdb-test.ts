import "server-only";

import type {
  TmdbMediaType,
  TmdbTitleSummary,
  TmdbSearchResponse,
  TmdbTitleDetails,
  TmdbGenre,
} from "./types";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";

const DEFAULT_LANGUAGE = "pt-BR";

export class TmdbApiError extends Error {
  constructor(public readonly status: number) {
    super(`Erro na API TMDB: HTTP ${status}`);
    this.name = "TmdbApiError";
  }
}

type TmdbParams = Record<string, string>;

async function tmdbFetch<T>(
  endpoint: string,
  params: TmdbParams = {},
): Promise<T> {
  const token = process.env.TMDB_ACCESS_TOKEN;

  if (!token) {
    throw new Error("TMDB_ACCESS_TOKEN não foi configurado.");
  }

  const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, value);
  });

  const response = await fetch(url, {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new TmdbApiError(response.status);
  }

  return (await response.json()) as T;
}