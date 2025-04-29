<script lang="ts">
	import SearchBar from '$lib/components/SearchBar.svelte';
	import MovieCard from '$lib/components/MovieCard.svelte';
	import type { Movie } from "$lib/types/movie.ts";
	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';

	let searchResults = $state<Movie[]>([]);
	let isLoading = $state(false);
	let hasSearched = $state(false);
	let initialQuery = $state('');
	
	onMount(() => {
	
		const urlQuery = page.url.searchParams.get('q');
		if (urlQuery) {
			initialQuery = urlQuery;
			handleSearch(urlQuery);
		}
	});
	
	async function handleSearch(query: string) {
		if (!query) {
			searchResults = [];
			hasSearched = false;
			return;
		}
		
		const url = new URL(window.location.href);
		url.searchParams.set('q', query);
		goto(url.toString(), { replaceState: true, noScroll: false });
		
		isLoading = true;
		hasSearched = true;
		
		try {
			const response = await fetch(`/api/movies/search?query=${encodeURIComponent(query)}`);
			const data = await response.json();
			searchResults = Array.isArray(data) ? data : [];
		} catch (error) {
			console.error('Failed to search movies:', error);
			searchResults = [];
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="space-y-12">
	<section class="text-center py-12 px-4 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm border border-blue-100">
		<h1 class="text-4xl font-bold mb-6 animate-in slide-in-from-bottom duration-500">
			<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
				Find Your Next Favorite Movie
			</span>
		</h1>
		<p class="text-lg text-slate-700 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom duration-500 delay-100">
			Search for movies by title, actor, or director to add to your watchlist.
		</p>
		
		<div class="animate-in slide-in-from-bottom duration-500 delay-200 max-w-2xl mx-auto">
			<SearchBar onSearch={handleSearch} initialQuery={initialQuery} />
		</div>
	</section>
	
	<section>
		{#if isLoading}
			<div class="flex justify-center py-20">
				<div class="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
			</div>
		{:else if hasSearched && searchResults.length === 0}
			<div class="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
				<h2 class="text-2xl font-semibold mb-2 text-slate-800">No Results Found</h2>
				<p class="text-slate-600">Try searching for a different movie title.</p>
			</div>
		{:else if searchResults.length > 0}
			<h2 class="text-2xl font-bold mb-6">
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
					Search Results
				</span>
			</h2>
			
			<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
				{#each searchResults as movie, i}
					<div class="animate-in slide-in-from-bottom duration-500" style="animation-delay: {i * 50}ms">
						<MovieCard {movie} />
					</div>
				{/each}
			</div>
		{:else if !hasSearched}
			<div class="bg-white rounded-xl p-8 text-center shadow-sm border border-slate-100">
				<h2 class="text-2xl font-semibold mb-2 text-slate-800">Start Searching</h2>
				<p class="text-slate-600">Enter a movie title above to find films to add to your watchlist.</p>
			</div>
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
	
	.delay-200 {
		animation-delay: 200ms;
	}
</style> 