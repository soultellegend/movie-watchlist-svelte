import { db } from './index.js';
import { watchlist } from './schema.js';
import { eq, and } from 'drizzle-orm';
import type { Movie } from '../../types/movie.js';
import type { WatchlistMovie, WatchStatus } from '../../types/movie.js';
import { getMovieDetails } from '../tmdb.js';

export async function addToWatchlist(movie: Movie, userId: string, status: WatchStatus = 'planning'): Promise<void> {
  let movieToAdd = movie;
  if (movieToAdd.runtime === undefined || movieToAdd.runtime === null) {
    try {
      movieToAdd = await getMovieDetails(movie.id);
    } catch (error) {
      console.error(`Failed to fetch movie details for ID ${movie.id}:`, error);
    }
  }

  await db.insert(watchlist).values({
    movieId: movieToAdd.id,
    title: movieToAdd.title,
    posterPath: movieToAdd.poster_path,
    backdropPath: movieToAdd.backdrop_path,
    releaseDate: movieToAdd.release_date,
    overview: movieToAdd.overview,
    voteAverage: movieToAdd.vote_average ? Math.round(movieToAdd.vote_average * 10) : 0,
    runtime: movieToAdd.runtime || null,
    status,
    userId,
  });
}

export async function removeFromWatchlist(movieId: number, userId: string): Promise<void> {
  await db.delete(watchlist)
    .where(
      and(
        eq(watchlist.movieId, movieId),
        eq(watchlist.userId, userId)
      )
    );
}

export async function updateWatchlistStatus(
  movieId: number, 
  userId: string, 
  status: WatchStatus, 
  updates: {
    startedAt?: string;
    completedAt?: string;
  } = {}
): Promise<void> {
  const updateData: Record<string, unknown> = { status };
  
  if (updates.startedAt) updateData.startedAt = updates.startedAt;
  if (updates.completedAt) updateData.completedAt = updates.completedAt;
  
  if (status !== 'completed' && !updates.completedAt) {
    updateData.completedAt = null;
  }
  
  if (status === 'planning' && !updates.startedAt) {
    updateData.startedAt = null;
  }
  
  await db.update(watchlist)
    .set(updateData)
    .where(
      and(
        eq(watchlist.movieId, movieId),
        eq(watchlist.userId, userId)
      )
    );
}

export async function getWatchlist(userId: string): Promise<WatchlistMovie[]> {
  const items = await db.select()
    .from(watchlist)
    .where(eq(watchlist.userId, userId))
    .orderBy(watchlist.addedAt);
  
  return items.map(item => ({
    id: item.movieId,
    title: item.title,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    release_date: item.releaseDate || '',
    overview: item.overview || '',
    vote_average: item.voteAverage ? item.voteAverage / 10 : 0,
    runtime: item.runtime || undefined,
    added_at: item.addedAt,
    status: item.status as WatchStatus,
    started_at: item.startedAt || undefined,
    completed_at: item.completedAt || undefined
  }));
}

export async function getWatchlistByStatus(userId: string, status: WatchStatus): Promise<WatchlistMovie[]> {
  const items = await db.select()
    .from(watchlist)
    .where(
      and(
        eq(watchlist.userId, userId),
        eq(watchlist.status, status)
      )
    )
    .orderBy(watchlist.addedAt);
  
  return items.map(item => ({
    id: item.movieId,
    title: item.title,
    poster_path: item.posterPath,
    backdrop_path: item.backdropPath,
    release_date: item.releaseDate || '',
    overview: item.overview || '',
    vote_average: item.voteAverage ? item.voteAverage / 10 : 0,
    runtime: item.runtime || undefined,
    added_at: item.addedAt,
    status: item.status as WatchStatus,
    started_at: item.startedAt || undefined,
    completed_at: item.completedAt || undefined
  }));
}

export async function isInWatchlist(movieId: number, userId: string): Promise<boolean> {
  const item = await db.select({ id: watchlist.id })
    .from(watchlist)
    .where(
      and(
        eq(watchlist.movieId, movieId),
        eq(watchlist.userId, userId)
      )
    )
    .limit(1);
  
  return item.length > 0;
} 