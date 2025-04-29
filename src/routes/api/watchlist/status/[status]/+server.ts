import { json } from '@sveltejs/kit';
import { getWatchlistByStatus } from '$lib/server/db/watchlist.js';
import type { RequestHandler } from '@sveltejs/kit';
import type { WatchStatus } from '$lib/types/movie.js';

export const GET: RequestHandler = async ({ locals, params }) => {
  try {
    const userId = locals.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const status = params.status;
    
    if (!status || !['planning', 'watching', 'completed', 'on_hold', 'dropped'].includes(status)) {
      return new Response(JSON.stringify({ error: 'Valid status is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const watchlistItems = await getWatchlistByStatus(userId, status as WatchStatus);
    
    return json(watchlistItems);
  } catch (error) {
    console.error('Error fetching watchlist by status:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch watchlist by status' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 