<script lang="ts">
	import { enhance } from '$app/forms';
	import type { PageData } from './$types.ts';

	let { data } = $props<{ data: PageData }>();
</script>

<div class="max-w-4xl mx-auto">
	<div class="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-in">
		<div class="p-8">
			<div class="flex flex-col md:flex-row items-center md:items-start gap-8">
				<div class="w-32 h-32 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-4xl font-bold text-white">
					{data.user.username.charAt(0).toUpperCase()}
				</div>
				
				<div class="flex-1">
					<h1 class="text-3xl font-bold mb-2 text-center md:text-left text-slate-800">{data.user.username}</h1>
					<p class="text-slate-500 mb-6 text-center md:text-left">Member since {new Date().toLocaleDateString()}</p>
					
					<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
						<div class="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
							<div class="text-3xl font-bold text-blue-600 mb-1">{data.stats?.totalMovies || 0}</div>
							<div class="text-sm text-slate-500">Movies in Watchlist</div>
						</div>
						<div class="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
							<div class="text-3xl font-bold text-blue-600 mb-1">{data.stats?.completed || 0}</div>
							<div class="text-sm text-slate-500">Movies Watched</div>
						</div>
						<div class="bg-slate-50 rounded-lg p-4 text-center border border-slate-100">
							<div class="text-3xl font-bold text-blue-600 mb-1">{data.stats?.totalHours || 0}</div>
							<div class="text-sm text-slate-500">Hours Watched</div>
						</div>
					</div>
					
					<div class="flex justify-end">
						<form method="post" action="?/logout" use:enhance>
							<button type="submit" class="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 transition-colors border border-slate-200">
								Sign Out
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
	
	{#if data.recentMovies && data.recentMovies.length > 0}
		<div class="mt-12">
			<h2 class="text-2xl font-bold mb-6">
				<span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
					Recently Added
				</span>
			</h2>
			
			<div class="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
				<div class="space-y-4">
					{#each data.recentMovies as movie}
						<div class="flex items-center gap-4 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors border border-slate-100">
							{#if movie.posterPath}
								<img 
									src={`https://image.tmdb.org/t/p/w92${movie.posterPath}`} 
									alt={movie.title}
									class="w-12 h-18 object-cover rounded"
								/>
							{:else}
								<div class="w-12 h-18 bg-slate-200 rounded flex items-center justify-center">
									<span class="text-slate-400 text-xs">No image</span>
								</div>
							{/if}
							
							<div class="flex-1">
								<h3 class="font-semibold text-slate-800">{movie.title}</h3>
								<p class="text-sm text-slate-500">Added on {new Date(movie.addedAt).toLocaleDateString()}</p>
							</div>
							
							<div class="text-sm px-3 py-1 rounded-full bg-blue-100 text-blue-700">
								{movie.status}
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	@keyframes animate-in {
		from { opacity: 0; transform: translateY(20px); }
		to { opacity: 1; transform: translateY(0); }
	}
	
	.animate-in {
		animation: animate-in 0.5s ease-out forwards;
	}
</style> 