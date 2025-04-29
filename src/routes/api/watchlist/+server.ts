import { json } from '@sveltejs/kit';
import { getWatchlist } from '$lib/server/db/watchlist.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ locals }) => {
  try {
    const userId = locals.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    const watchlistItems = await getWatchlist(userId);
    
    return json(watchlistItems);
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch watchlist' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 