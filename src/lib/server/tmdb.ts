import { TMDB_API_KEY, TMDB_API_URL } from '$env/static/private';
import type { Movie, TMDBResponse } from '../types/movie.js';

const API_URL = TMDB_API_URL;
const API_KEY = TMDB_API_KEY;

async function fetchFromTMDB<T>(endpoint: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${API_URL}${endpoint}`);
  
  url.searchParams.append('api_key', API_KEY);
  
  for (const [key, value] of Object.entries(params)) {
    url.searchParams.append(key, value);
  }
  
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getPopularMovies(page = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/movie/popular', { page: page.toString() });
}

export async function searchMovies(query: string, page = 1): Promise<TMDBResponse<Movie>> {
  return fetchFromTMDB<TMDBResponse<Movie>>('/search/movie', { 
    query, 
    page: page.toString(),
    include_adult: 'false'
  });
}

export async function getMovieDetails(movieId: string | number): Promise<Movie> {
  const data = await fetchFromTMDB<any>(`/movie/${movieId}`, { append_to_response: 'credits,videos' });
  
  return {
    id: data.id,
    title: data.title,
    poster_path: data.poster_path,
    backdrop_path: data.backdrop_path,
    release_date: data.release_date,
    overview: data.overview,
    vote_average: data.vote_average,
    genres: data.genres,
    runtime: data.runtime || null,
  };
} 