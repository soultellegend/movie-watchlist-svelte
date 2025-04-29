<script lang="ts">
  import { onMount } from 'svelte';
  import type { WatchStatus } from '$lib/types/movie.ts';
  import { page } from '$app/state';
  import { goto } from '$app/navigation';

  import type { Movie } from '$lib/types/movie.ts';
  
  let watchlist = $state<Movie[]>([]);
  let isLoading = $state(true);
  let activeTab = $state<WatchStatus | 'all'>('all');
  let filteredWatchlist = $state<Movie[]>([]);
  let showDropdown = $state<Record<number, boolean>>({});
  
  // Status options for dropdown
  const statusOptions: { value: WatchStatus; label: string }[] = [
    { value: 'planning', label: 'Planning to Watch' },
    { value: 'watching', label: 'Currently Watching' },
    { value: 'completed', label: 'Completed' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'dropped', label: 'Dropped' }
  ];
  
  onMount(async () => {
    if (!page.data.user) {
      goto('/login');
      return;
    }
    await fetchWatchlist();
  });
  
  async function fetchWatchlist() {
    try {
      isLoading = true;
      const response = await fetch('/api/watchlist');
      watchlist = await response.json();
      filterWatchlist();
    } catch (error) {
      console.error('Failed to fetch watchlist:', error);
    } finally {
      isLoading = false;
    }
  }
  
  function filterWatchlist() {
    if (activeTab === 'all') {
      filteredWatchlist = [...watchlist];
    } else {
      filteredWatchlist = watchlist.filter(movie => movie.status === activeTab);
    }
  }
  
  async function removeFromWatchlist(movieId: number) {
    try {
      const response = await fetch(`/api/watchlist/${movieId}`, { method: 'DELETE' });
      
      if (response.ok) {
        watchlist = watchlist.filter(movie => movie.id !== movieId);
        filterWatchlist();
      } else {
        throw new Error('Failed to remove from watchlist');
      }
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      alert('Failed to remove from watchlist. Please try again.');
    }
  }
  
  async function updateStatus(movie: Movie, newStatus: WatchStatus) {
    try {
      const updates: any = {
        status: newStatus
      };
      
    
       if (newStatus === 'watching' && !movie.started_at) {
        updates.started_at = new Date().toISOString();
      } else if (newStatus === 'completed' && !movie.completed_at) {
        updates.completed_at = new Date().toISOString();
        if (!movie.started_at) {
          updates.started_at = new Date().toISOString();
        }
      }
      
      const response = await fetch(`/api/watchlist/${movie.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const updatedMovie = { ...movie, ...updates };
        watchlist = watchlist.map(m => m.id === movie.id ? updatedMovie : m);
        filterWatchlist();
        showDropdown[movie.id] = false;
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  }
  
  function setActiveTab(status: WatchStatus | 'all') {
    activeTab = status;
    filterWatchlist();
  }
  
  function formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  }
  
  function toggleDropdown(movieId: number) {
    showDropdown = { ...showDropdown, [movieId]: !showDropdown[movieId] };
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-3xl font-bold mb-6 text-slate-800">My Watchlist</h1>
  
  {#if isLoading}
    <div class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  {:else}
    <!-- Status tabs -->
    <div class="mb-6 border-b border-slate-200">
      <div class="flex flex-wrap -mb-px">
        <button 
          class="inline-block p-4 border-b-2 rounded-t-lg {activeTab === 'all' ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-slate-300 text-slate-600 hover:text-slate-800'}"
          onclick={() => setActiveTab('all')}
        >
          All
          <span class="ml-2 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
            {watchlist.length}
          </span>
        </button>
        {#each statusOptions as option}
          <button 
            class="inline-block p-4 border-b-2 rounded-t-lg {activeTab === option.value ? 'border-blue-500 text-blue-600' : 'border-transparent hover:border-slate-300 text-slate-600 hover:text-slate-800'}"
            onclick={() => setActiveTab(option.value)}
          >
            {option.label}
            <span class="ml-2 bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
              {watchlist.filter(m => m.status === option.value).length}
            </span>
          </button>
        {/each}
      </div>
    </div>
    
    {#if filteredWatchlist.length === 0}
      <div class="bg-white rounded-lg p-8 text-center shadow-sm border border-slate-100">
        <h2 class="text-xl font-semibold mb-2 text-slate-800">No movies in this category</h2>
        <p class="text-slate-600 mb-6">Add some movies or change their status!</p>
        <a href="/search" class="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
          Search Movies
        </a>
      </div>
    {:else}
      <div class="grid grid-cols-1 gap-6">
        {#each filteredWatchlist as movie}
          <div class="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div class="flex flex-col sm:flex-row">
              <div class="sm:w-48 flex-shrink-0">
                {#if movie.poster_path}
                  <img 
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                    alt={movie.title}
                    class="w-full h-full object-cover"
                  />
                {:else}
                  <div class="w-full h-full min-h-[12rem] bg-slate-100 flex items-center justify-center">
                    <span class="text-slate-400">No image</span>
                  </div>
                {/if}
              </div>
              
              <div class="p-6 flex-1">
                <div class="flex justify-between items-start">
                  <div>
                    <h3 class="font-semibold text-xl mb-1 text-slate-800">
                      <a href="/movies/{movie.id}" class="hover:underline">{movie.title}</a>
                    </h3>
                    {#if movie.release_date}
                      <p class="text-slate-500 text-sm mb-3">
                        {new Date(movie.release_date).getFullYear()}
                      </p>
                    {/if}
                  </div>
                  
                  <div class="flex gap-2">
                    <div class="relative">
                      <button 
                        class="text-sm border border-slate-200 rounded-md bg-slate-50 hover:bg-slate-100 px-3 py-1.5 text-slate-700 flex items-center gap-1"
                        onclick={() => toggleDropdown(movie.id)}
                      >
                        {statusOptions.find(o => o.value === movie.status)?.label || 'Set Status'}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                          <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
                        </svg>
                      </button>
                      
                      {#if showDropdown[movie.id]}
                        <div class="absolute right-0 mt-1 w-48 rounded-md shadow-lg bg-white border border-slate-200 z-10">
                          <div class="py-1">
                            {#each statusOptions as option}
                              <button 
                                class="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 {movie.status === option.value ? 'bg-slate-50' : ''}"
                                onclick={() => updateStatus(movie, option.value)}
                              >
                                {option.label}
                              </button>
                            {/each}
                          </div>
                        </div>
                      {/if}
                    </div>
                    
                    <button 
                      onclick={() => removeFromWatchlist(movie.id)}
                      class="text-red-500 hover:bg-red-50 p-2 rounded-full"
                      aria-label="Remove from watchlist"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </button>
                  </div>
                </div>
                
                <p class="line-clamp-2 text-sm mb-4 text-slate-600">{movie.overview || 'No description available'}</p>
                
                <div class="bg-slate-50 rounded-lg p-3 mt-4 border border-slate-100">
                  <h4 class="text-sm font-medium mb-2 text-blue-600">Tracking Information</h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div class="flex items-center gap-2 bg-white p-2 rounded border border-slate-100">
                      <div class="bg-blue-100 p-1.5 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-blue-600">
                          <path fill-rule="evenodd" d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs text-slate-500">Added</div>
                        <div class="text-sm text-slate-700">{formatDate(movie.added_at)}</div>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-2 bg-white p-2 rounded border border-slate-100">
                      <div class="bg-indigo-100 p-1.5 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-indigo-600">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs text-slate-500">Started</div>
                        <div class="text-sm text-slate-700">{formatDate(movie.started_at)}</div>
                      </div>
                    </div>
                    
                    <div class="flex items-center gap-2 bg-white p-2 rounded border border-slate-100">
                      <div class="bg-green-100 p-1.5 rounded">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-green-600">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" />
                        </svg>
                      </div>
                      <div>
                        <div class="text-xs text-slate-500">Completed</div>
                        <div class="text-sm text-slate-700">{formatDate(movie.completed_at)}</div>
                      </div>
                    </div>
                    
                  
                  </div>
                </div>
                
               
                
                <div class="mt-4 flex justify-end">
                  <a 
                    href="/movies/{movie.id}" 
                    class="text-blue-600 hover:underline text-sm flex items-center gap-1"
                  >
                    View details
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
                      <path fill-rule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clip-rule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {/if}
</div>

<style>
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    line-clamp: 2;
  }
</style> 