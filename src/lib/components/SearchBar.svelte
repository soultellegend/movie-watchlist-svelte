<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	
	let { onSearch, initialQuery = '' } = $props<{
		onSearch?: (query: string) => void;
		initialQuery?: string;
	}>();
	
	let searchQuery = $state(initialQuery);
	let searchTimeout: NodeJS.Timeout;
	
	onMount(() => {
		if (initialQuery) {
			searchQuery = initialQuery;
		}
	});
	
	function handleInput() {
		clearTimeout(searchTimeout);
		
		if (searchQuery.trim().length >= 2) {
			searchTimeout = setTimeout(() => {
				if (searchQuery.trim() && onSearch) {
					onSearch(searchQuery);
				}
			}, 800); //Auto refresh after 800ms
		}
	}
	
	function handleSubmit(event: Event) {
		event.preventDefault();
		clearTimeout(searchTimeout);
		if (searchQuery.trim() && onSearch) {
			onSearch(searchQuery);
		}
	}
</script>

<div class="relative">
	<form onsubmit={handleSubmit} class="relative">
		<div class="relative">
			<input
				type="text"
				placeholder="Search for movies..."
				bind:value={searchQuery}
				oninput={handleInput}
				class="w-full py-3 pl-12 pr-4 rounded-full bg-white border border-slate-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 outline-none transition-all shadow-sm"
			/>
			<div class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
					<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
				</svg>
			</div>
			<button 
				type="submit" 
				class="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
				aria-label="Search"
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
					<path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
				</svg>
			</button>
		</div>
	</form>
</div> 