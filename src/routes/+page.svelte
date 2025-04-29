<script lang="ts">
  import { onMount } from 'svelte';
  import HeroSection from '$lib/components/HeroSection.svelte';
  import MovieSection from '$lib/components/MovieSection.svelte';
  import FeaturesSection from '$lib/components/FeaturesSection.svelte';
  
  import type { Movie } from "$lib/types/movie.ts";
  
  let popularMovies: Movie[] = $state([]);
  let isLoading = $state(true);
  
  onMount(async () => {
    try {
      const response = await fetch('/api/movies/popular');
      const data = await response.json();
      popularMovies = data.results;
    } catch (error) {
      console.error('Failed to fetch popular movies:', error);
    } finally {
      isLoading = false;
    }
  });
</script>

<div class="space-y-12">
  <HeroSection 
    title="Discover & Track Your Favorite Movies" 
    subtitle="Find new films to watch, keep track of your watchlist, and share your thoughts with others."
  />
  
  <MovieSection 
    title="Popular Movies" 
    movies={popularMovies} 
    {isLoading} 
    viewAllLink="/movies"
  />
  
  <FeaturesSection />
</div>
