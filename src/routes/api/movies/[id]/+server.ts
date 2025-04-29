import { json } from '@sveltejs/kit';
import { getMovieDetails } from '$lib/server/tmdb.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
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
    
    const movie = await getMovieDetails(id);
    
    return json(movie);
  } catch (error) {
    console.error(`Error fetching movie details for ID ${params.id}:`, error);
    return new Response(JSON.stringify({ error: 'Failed to fetch movie details' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 