import { json } from '@sveltejs/kit';
import { searchMovies } from '$lib/server/tmdb.js';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const query = url.searchParams.get('query');
    
    if (!query) {
      return new Response(JSON.stringify({ error: 'Query parameter is required' }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const page = Number(url.searchParams.get('page') || '1');
    const response = await searchMovies(query, page);
    
    return json(response.results);
  } catch (error) {
    console.error('Error searching movies:', error);
    return new Response(JSON.stringify({ error: 'Failed to search movies' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 