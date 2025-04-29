import { json } from '@sveltejs/kit';
import { isInWatchlist } from '$lib/server/db/watchlist.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals, params }) => {
  try {
    const userId = locals.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const movieId = params.id;
    const inWatchlistStatus = await isInWatchlist(Number(movieId), userId);
    
    return json({ isInWatchlist: inWatchlistStatus });
  } catch (error) {
    console.error('Error checking watchlist:', error);
    return new Response(JSON.stringify({ error: 'Failed to check watchlist' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 