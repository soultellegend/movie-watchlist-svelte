import { json } from '@sveltejs/kit';
import { TMDB_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params }) => {
  try {
    const movieId = params.id;
    
    if (!movieId) {
      return new Response(JSON.stringify({ error: 'Movie ID is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/reviews?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }
    
    const data = await response.json();
    return json(data.results);
  } catch (error) {
    console.error('Error fetching movie reviews:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch movie reviews' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 