import { json } from '@sveltejs/kit';
import { addToWatchlist, removeFromWatchlist, updateWatchlistStatus } from '$lib/server/db/watchlist.js';
import { getMovieDetails } from '$lib/server/tmdb.js';
import type { RequestHandler } from '@sveltejs/kit';
import type { WatchStatus } from '$lib/types/movie.js';

export const POST: RequestHandler = async ({ params, locals, request }) => {
  try {
    const { id } = params;
    
        
  const userId = locals.user?.id;
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

    if (!id) {
      return new Response(JSON.stringify({ error: 'Movie ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }

    
    const movie = await getMovieDetails(id);
    
    let status: WatchStatus = 'planning';
    try {
      const body = await request.json();
      if (body.status && typeof body.status === 'string') {
        status = body.status as WatchStatus;
      }
    } catch(error) {
        console.error(`Error adding movie ${params.id} to watchlist:`, error);
        return new Response(
          JSON.stringify({ error: "Failed to add movie to watchlist" }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    }
    
    await addToWatchlist(movie, userId, status);
    
    return json({ success: true });
  } catch (error) {
    console.error(`Error adding movie ${params.id} to watchlist:`, error);
    return new Response(JSON.stringify({ error: 'Failed to add movie to watchlist' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const PATCH: RequestHandler = async ({ params, locals, request }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Movie ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const userId = locals.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
     

    const body = await request.json();
    
    if (!body.status) {
      return new Response(JSON.stringify({ error: 'Status is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const status = body.status as WatchStatus;
    const updates = {
      startedAt: body.started_at,
      completedAt: body.completed_at,
      rating: body.rating ? Number(body.rating) : undefined,
      notes: body.notes
    };

    await updateWatchlistStatus(Number(id), userId, status, updates);
    
    return json({ success: true });
  } catch (error) {
    console.error(`Error updating movie ${params.id} in watchlist:`, error);
    return new Response(JSON.stringify({ error: 'Failed to update movie in watchlist' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  try {
    const { id } = params;
    
    if (!id) {
      return new Response(JSON.stringify({ error: 'Movie ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const userId = locals.user?.id;
    if (!userId) {
      return new Response('Unauthorized', { status: 401 });
    }
    
    await removeFromWatchlist(Number(id), userId);
    
    return json({ success: true });
  } catch (error) {
    console.error(`Error removing movie ${params.id} from watchlist:`, error);
    return new Response(JSON.stringify({ error: 'Failed to remove movie from watchlist' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 