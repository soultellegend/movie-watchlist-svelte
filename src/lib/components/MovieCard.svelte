<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Movie } from '$lib/types/movie.ts';


	const { movie } = $props();
	type $$Props = { movie: Movie };

	let movieImageUrl = $derived(movie.poster_path 
		? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
		: 'https://www.themoviedb.org/assets/2/v4/glyphicons/basic/glyphicons-basic-38-picture-grey-c2ebdbb057f2a7614185931650f8cee23fa137b93812ccb132b9df511df1cfac.svg');
	
	let movieYear = $derived(movie.release_date 
		? new Date(movie.release_date).getFullYear() 
		: 'Unknown');
	
	let movieRating = $derived(movie.vote_average 
		? movie.vote_average.toFixed(1) 
		: 'N/A');

	function handleClick() {
		goto(`/movies/${movie.id}`);
	}

	$effect(() => {
		if (!movie) {
			console.error('MovieCard: No movie provided');
		}
	});
</script>


<button 
	type="button"
	class="w-full text-left bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-md hover:scale-[1.02] h-full flex flex-col"
	onclick={handleClick}
	onkeydown={(e) => e.key === 'Enter' && handleClick()}
>
	<div class="relative aspect-[2/3] overflow-hidden bg-slate-100">
		{#if movie.poster_path}
			<img 
				src={movieImageUrl} 
				alt={movie.title}
				class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
				loading="lazy"
			/>
		{:else}
			<div class="w-full h-full flex items-center justify-center">
				<img 
					src={movieImageUrl} 
					alt="No poster available"
					class="w-16 h-16 opacity-50"
				/>
			</div>
		{/if}
		
		{#if movie.vote_average}
			<div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-slate-800 px-2 py-1 rounded-md text-sm font-medium flex items-center gap-1">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-4 h-4 text-yellow-500">
					<path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
				</svg>
				{movieRating}
			</div>
		{/if}
		
		{#if movie.status}
			<div class="absolute top-2 left-2 bg-blue-600/90 backdrop-blur-sm text-white px-2 py-1 rounded-md text-xs font-medium">
				{movie.status === 'planning' ? 'Plan to Watch' : 
				 movie.status === 'watching' ? 'Watching' : 
				 movie.status === 'completed' ? 'Completed' : 
				 movie.status === 'on_hold' ? 'On Hold' : 
				 movie.status === 'dropped' ? 'Dropped' : ''}
			</div>
		{/if}
	</div>
	
	<div class="p-4 flex-grow flex flex-col">
		<h3 class="font-semibold text-slate-800 line-clamp-2 mb-1 group-hover:text-blue-600 transition-colors">
			{movie.title}
		</h3>
		
		<div class="flex items-center gap-2 mb-2">
			<span class="text-slate-500 text-sm">{movieYear}</span>
			{#if movie.genres && movie.genres.length > 0}
				<span class="text-slate-400">•</span>
				<span class="text-slate-500 text-sm line-clamp-1">
					{movie.genres.map((g: {name: string}) => g.name).join(', ')}
				</span>
			{/if}
		</div>
		
		<p class="text-slate-600 text-sm line-clamp-2 flex-grow">
			{movie.overview || 'No description available.'}
		</p>
		
		<div class="mt-3 pt-3 border-t border-slate-100">
			<div class="w-full py-2 text-center text-blue-600 hover:text-blue-800 transition-colors text-sm font-medium flex items-center justify-center gap-1">
				View Details
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
					<path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
				</svg>
			</div>
		</div>
	</div>
</button>

<style>
	.line-clamp-1 {
		display: -webkit-box;
		-webkit-line-clamp: 1;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 1;
	}
	
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
		line-clamp: 2;
	}
</style> 