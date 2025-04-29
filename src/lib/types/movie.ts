export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  overview: string;
  vote_average?: number;
  genres?: Genre[];
  runtime?: number;
  completed_at?: string;
  started_at?: string;
  status?: WatchStatus;
  added_at?: string;
}

export interface Genre {
  id: number;
  name: string;
}

export type WatchStatus = 'planning' | 'watching' | 'completed' | 'on_hold' | 'dropped';

export interface WatchlistMovie extends Movie {
  added_at: string;
  status: WatchStatus;
  started_at?: string;
  completed_at?: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
} 

export interface Review {
  id: string;
  author: string;
  content: string;
  created_at: string;
  author_details: {
    rating: number | null;
    avatar_path: string | null;
    username: string;
  };
}

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}
