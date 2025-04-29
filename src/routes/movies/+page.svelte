<script lang="ts">
  import { onMount } from 'svelte';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import type { Movie, MovieResponse } from '$lib/types/movie.ts';
 
  let movies = $state<Movie[]>([]);
  let isLoading = $state(true);
  let currentPage = $state(1);
  let totalPages = $state(1);
  
  async function fetchMovies(page = 1) {
    isLoading = true;
    
    try {
      const response = await fetch(`/api/movies/popular?page=${page}`);
      const data = await response.json() as MovieResponse;
      
      movies = [...data.results];
      currentPage = data.page;
      totalPages = data.total_pages;
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      fetchMovies(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  function nextPage() {
    if (currentPage < totalPages) {
      fetchMovies(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  function prevPage() {
    if (currentPage > 1) {
      fetchMovies(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  
  onMount(() => {
    fetchMovies();
  });
</script>

<div class="space-y-12">
  <section class="text-center py-12 px-4 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm border border-blue-100">
    <h1 class="text-4xl font-bold mb-6 animate-in slide-in-from-bottom duration-500">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
        Popular Movies
      </span>
    </h1>
    <p class="text-lg text-slate-700 max-w-2xl mx-auto animate-in slide-in-from-bottom duration-500 delay-100">
      Discover the most popular movies right now. Add them to your watchlist to keep track of what you want to see.
    </p>
  </section>
  
  <section>
    {#if isLoading && movies.length === 0}
      <div class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    {:else if movies.length === 0}
      <div class="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
        <p class="text-slate-600">No movies found.</p>
      </div>
    {:else}
      <div class="relative">
        {#if isLoading}
          <div class="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
            <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        {/if}
        
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {#each movies as movie, i (movie.id)}
            <div class="animate-in slide-in-from-bottom duration-500" style="animation-delay: {i * 50}ms">
              <MovieCard {movie} />
            </div>
          {/each}
        </div>
      </div>
      
      <!-- Pagination -->
      {#if !isLoading && totalPages > 1}
        <div class="flex flex-wrap justify-center mt-12 gap-2">
          <button 
            onclick={prevPage} 
            disabled={currentPage === 1}
            class="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-slate-700"
          >
            Previous
          </button>
          
          {#if currentPage > 3}
            <button 
              onclick={() => goToPage(1)} 
              class="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-700"
            >
              1
            </button>
            
            {#if currentPage > 4}
              <span class="px-2 py-2 text-slate-600">...</span>
            {/if}
          {/if}
          
          {#each Array.from({length: 5}, (_, i) => Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i) as page}
            {#if page >= 1 && page <= totalPages}
              <button 
                onclick={() => goToPage(page)} 
                class={`px-4 py-2 rounded-lg transition-colors shadow-sm ${currentPage === page ? 'bg-blue-600 text-white' : 'bg-white border border-slate-200 hover:bg-slate-50 text-slate-700'}`}
              >
                {page}
              </button>
            {/if}
          {/each}
          
          {#if currentPage < totalPages - 2}
            {#if currentPage < totalPages - 3}
              <span class="px-2 py-2 text-slate-600">...</span>
            {/if}
            
            <button 
              onclick={() => goToPage(totalPages)} 
              class="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm text-slate-700"
            >
              {totalPages}
            </button>
          {/if}
          
          <button 
            onclick={nextPage} 
            disabled={currentPage === totalPages}
            class="px-4 py-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm text-slate-700"
          >
            Next
          </button>
        </div>
        
        <div class="mt-4 text-center text-slate-600">
          Page {currentPage} of {totalPages.toLocaleString()}
        </div>
      {/if}
    {/if}
  </section>
</div>

<style>
  @keyframes slide-in-from-bottom {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-in {
    animation-fill-mode: both;
  }
  
  .slide-in-from-bottom {
    animation-name: slide-in-from-bottom;
  }
  
  .duration-500 {
    animation-duration: 500ms;
  }
  
  .delay-100 {
    animation-delay: 100ms;
  }
</style> 