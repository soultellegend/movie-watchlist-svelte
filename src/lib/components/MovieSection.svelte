<script lang="ts">
  import MovieCard from './MovieCard.svelte';
  import type { Movie } from "$lib/types/movie.ts";
  
  let { title, movies, isLoading, viewAllLink } = $props<{
    title: string;
    movies: Movie[];
    isLoading: boolean;
    viewAllLink: string;
  }>();
</script>

<section class="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
  <div class="flex justify-between items-center mb-8">
    <h2 class="text-3xl font-bold">
      <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
        {title}
      </span>
    </h2>
    <a href={viewAllLink} class="text-blue-600 hover:text-blue-800 transition-colors font-medium">View all</a>
  </div>
  
  {#if isLoading}
    <div class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  {:else if movies.length === 0}
    <div class="bg-slate-50 rounded-xl p-8 text-center">
      <p class="text-slate-600">No movies found.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
      {#each movies as movie, i}
        <div class="animate-in slide-in-from-bottom duration-500" style="animation-delay: {i * 50}ms">
          <MovieCard {movie} />
        </div>
      {/each}
    </div>
  {/if}
</section>

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
</style> 