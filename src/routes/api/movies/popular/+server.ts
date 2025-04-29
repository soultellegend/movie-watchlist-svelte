import { json } from '@sveltejs/kit';
import { getPopularMovies } from '$lib/server/tmdb.js';
import type { RequestHandler } from './$types.js';

export const GET: RequestHandler = async ({ url }) => {
  try {
    const page = Number(url.searchParams.get('page') || '1');    
    const response = await getPopularMovies(page);
    
    return json({
      results: response.results,
      page: response.page,
      total_pages: response.total_pages,
      total_results: response.total_results
    });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch popular movies' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
}; 