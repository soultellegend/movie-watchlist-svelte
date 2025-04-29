<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';
  import type { WatchStatus } from '$lib/types/movie.ts';
  import MovieCard from '$lib/components/MovieCard.svelte';
  import ReviewCard from '$lib/components/ReviewCard.svelte';
  import type { Movie, Review } from '$lib/types/movie.ts';
  
  let movie = $state<Movie | null>(null);
  let isLoading = $state(true);
  let error = $state<string | null>(null);
  let isInWatchlist = $state(false);
  let selectedStatus = $state<WatchStatus>('planning');
  let showStatusDropdown = $state(false);
  let recommendations = $state<Movie[]>([]);
  let reviews = $state<Review[]>([]);
  let isLoadingRecommendations = $state(true);
  let isLoadingReviews = $state(true);
  let currentMovieId = $state<string | null>(null);
  
  // Status options for dropdown
  const statusOptions: { value: WatchStatus; label: string }[] = [
    { value: 'planning', label: 'Planning to Watch' },
    { value: 'watching', label: 'Currently Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' }
  ];
  
  async function loadMovieData(movieId: string) {
    if (currentMovieId === movieId) return;
    
    currentMovieId = movieId;
    isLoading = true;
    error = null;
    
    try {
      const response = await fetch(`/api/movies/${movieId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch movie: ${response.statusText}`);
      }
      
      movie = await response.json();
      
      const watchlistResponse = await fetch(`/api/watchlist/check/${movieId}`);
      if (watchlistResponse.ok) {
        const data = await watchlistResponse.json();
        isInWatchlist = data.isInWatchlist;
      }

      fetchRecommendations(movieId);
      fetchReviews(movieId);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      error = err instanceof Error ? err.message : 'Failed to load movie details';
    } finally {
      isLoading = false;
    }
  }

  $effect(() => {
    if (page.params.id) {
      loadMovieData(page.params.id);
    }
  });

  onMount(() => { 
    if (page.params.id) loadMovieData(page.params.id);
  });

  async function fetchRecommendations(movieId: string) {
    isLoadingRecommendations = true;
    try {
      const response = await fetch(`/api/movies/${movieId}/recommendations`);
      if (response.ok) {
        recommendations = await response.json();
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
    } finally {
      isLoadingRecommendations = false;
    }
  }

  async function fetchReviews(movieId: string) {
    isLoadingReviews = true;
    try {
      const response = await fetch(`/api/movies/${movieId}/reviews`);
      if (response.ok) {
        reviews = await response.json();
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      isLoadingReviews = false;
    }
  }
  
  async function addToWatchlist() {
    if (!movie) return;
    
    try {
      const response = await fetch(`/api/watchlist/${movie.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: selectedStatus })
      });
      
      if (response.ok) {
        isInWatchlist = true;
        showStatusDropdown = false;
      } else {
        throw new Error('Failed to add to watchlist');
      }
    } catch (err) {
      console.error('Error adding to watchlist:', err);
      alert('Failed to add to watchlist. Please try again.');
    }
  }
  
  async function removeFromWatchlist() {
    if (!movie) return;
    
    try {
      const response = await fetch(`/api/watchlist/${movie.id}`, { method: 'DELETE' });
      
      if (response.ok) {
        isInWatchlist = false;
      } else {
        throw new Error('Failed to remove from watchlist');
      }
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      alert('Failed to remove from watchlist. Please try again.');
    }
  }
  
  function toggleWatchlist() {
    if (isInWatchlist) {
      removeFromWatchlist();
    } else {
      showStatusDropdown = true;
    }
  }
  
  function formatRuntime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  }



</script>

<div class="container mx-auto px-4 py-8">
  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500"></div>
    </div>
  {:else if error}
    <div class="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-100 p-8">
      <h2 class="text-2xl font-bold text-red-500 mb-2">Error</h2>
      <p class="text-slate-700">{error}</p>
      <a href="/" class="inline-block mt-4 text-blue-600 hover:underline">Back to Home</a>
    </div>
  {:else if movie}
    <div class="mb-6">
      <a href="/" class="text-blue-600 hover:underline flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
          <path fill-rule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clip-rule="evenodd" />
        </svg>
        Back to Home
      </a>
    </div>
    
    <div class="relative">
      {#if movie.backdrop_path}
        <div class="absolute inset-0 -z-10 h-[500px]">
          <img 
            src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${movie.backdrop_path}`} 
            alt=""
            class="w-full h-full object-cover opacity-15"
          />
          <div class="absolute inset-0 bg-gradient-to-t from-white to-white/60"></div>
        </div>
      {/if}
      
      <div class="flex flex-col md:flex-row gap-8 pt-4">
        <div class="md:w-1/3 lg:w-1/4 flex-shrink-0">
          {#if movie.poster_path}
            <img 
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
              alt={movie.title}
              class="w-full rounded-lg shadow-lg"
            />
          {:else}
            <div class="w-full aspect-[2/3] bg-slate-100 rounded-lg flex items-center justify-center">
              <img 
                src="https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg" 
                alt="No poster available"
                class="w-24 h-24 opacity-50"
              />
            </div>
          {/if}
          
          <div class="relative mt-4">
            <button 
              onclick={toggleWatchlist}
              class="w-full py-3 px-4 rounded-md flex items-center justify-center gap-2 font-medium
                {isInWatchlist ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} 
                text-white transition-all hover:scale-[1.02] shadow-lg"
            >
              {#if isInWatchlist}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                </svg>
                Remove from Watchlist
              {:else}
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5">
                  <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                Add to Watchlist
              {/if}
            </button>
            
            {#if showStatusDropdown}
              <div class="absolute top-full left-0 right-0 mt-2 p-4 bg-white border border-slate-200 rounded-md shadow-lg z-10">
                <h3 class="font-medium mb-2 text-slate-800">Add to your watchlist</h3>
                <div class="mb-3">
                  <label for="status" class="block text-sm mb-1 text-slate-600">Status:</label>
                  <select 
                    id="status"
                    class="w-full px-3 py-2 border border-slate-300 rounded-md bg-white text-slate-800"
                    bind:value={selectedStatus}
                  >
                    {#each statusOptions as option}
                      <option value={option.value}>{option.label}</option>
                    {/each}
                  </select>
                </div>
                <div class="flex gap-2">
                  <button 
                  onclick={addToWatchlist}
                    class="flex-1 py-2 px-4 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    Add
                  </button>
                  <button 
                    onclick={() => showStatusDropdown = false}
                    class="py-2 px-4 rounded-md bg-slate-200 text-slate-800 hover:bg-slate-300 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            {/if}
          </div>
        </div>
        
        <div class="flex-1">
          <h1 class="text-3xl md:text-4xl font-bold mb-2 text-slate-800">{movie.title}</h1>
          
          <div class="flex flex-wrap gap-2 mb-4">
            {#if movie.release_date}
              <span class="text-slate-600">{new Date(movie.release_date).getFullYear()}</span>
            {/if}
            
            {#if movie.runtime}
              <span class="text-slate-600">• {formatRuntime(movie.runtime)}</span>
            {/if}
            
            {#if movie.vote_average}
              <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-sm flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4">
                  <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
                </svg>
                {movie.vote_average.toFixed(1)}
              </span>
            {/if}
          </div>
          
          {#if movie.genres && movie.genres.length > 0}
            <div class="flex flex-wrap gap-2 mb-6">
              {#each movie.genres as genre}
                <span class="bg-slate-100 hover:bg-slate-200 transition-colors px-3 py-1 rounded-full text-sm text-slate-700">
                  {genre.name}
                </span>
              {/each}
            </div>
          {/if}
          
          <div class="mb-8">
            <h2 class="text-xl font-semibold mb-2 text-slate-800">Overview</h2>
            <p class="text-slate-700">{movie.overview || 'No overview available.'}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations Section -->
    {#if recommendations.length > 0}
      <section class="mt-16">
        <h2 class="text-2xl font-bold mb-6">
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
            Recommendations
          </span>
        </h2>
        
        {#if isLoadingRecommendations}
          <div class="flex justify-center py-8">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        {:else if recommendations.length === 0}
          <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
            <p class="text-slate-600">No recommendations available.</p>
          </div>
        {:else}
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {#each recommendations.slice(0, 5) as recommendedMovie, i}
              <div class="animate-in slide-in-from-bottom duration-500" style="animation-delay: {i * 50}ms">
                <MovieCard movie={recommendedMovie} />
              </div>
            {/each}
          </div>
        {/if}
      </section>
    {/if}

    <!-- Reviews Section -->
    <section class="mt-16">
      <h2 class="text-2xl font-bold mb-6">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
          Reviews
        </span>
      </h2>
      
      {#if isLoadingReviews}
        <div class="flex justify-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      {:else if reviews.length === 0}
        <div class="bg-white rounded-xl p-6 text-center shadow-sm border border-slate-100">
          <p class="text-slate-600">No reviews available.</p>
        </div>
      {:else}
        <div class="space-y-6">
          {#each reviews.slice(0, 3) as review}
            <ReviewCard {review} />
          {/each}
          
          {#if reviews.length > 3}
            <div class="text-center">
              <button 
                onclick={() => alert('View all reviews functionality coming soon!')}
                class="text-blue-600 hover:text-blue-800 transition-colors font-medium"
              >
                View all {reviews.length} reviews
              </button>
            </div>
          {/if}
        </div>
      {/if}
    </section>
  {/if}
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
</style> 