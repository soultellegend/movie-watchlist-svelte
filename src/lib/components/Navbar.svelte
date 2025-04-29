<script lang="ts">
  import { page } from '$app/state';
  
  let isMenuOpen = $state(false);
  
  function toggleMenu() {
    isMenuOpen = !isMenuOpen;
  }
  
  let isLoggedIn = $derived(!!page.data.user);
</script>

<header class="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm border-b border-sky-100">
  <div class="container mx-auto px-4 py-3">
    <nav class="flex items-center justify-between">
      <a href="/" class="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600">
        MovieWatchlist
      </a>
      
      <div class="hidden md:flex items-center space-x-6">
        <a href="/" class={`hover:text-blue-600 transition-colors ${page.url.pathname === '/' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
          Home
        </a>
        <a href="/movies" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/movies') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
          Movies
        </a>
        <a href="/search" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/search') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
          Search
        </a>
        {#if isLoggedIn}
          <a href="/watchlist" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/watchlist') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
            My Watchlist
          </a>
        {/if}
        <div class="border-l border-slate-200 h-6 mx-2"></div>
        {#if isLoggedIn}
          <a href="/profile" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/profile') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
            Profile
          </a>
        {:else}
          <a href="/login" class="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white">
            Login
          </a>
        {/if}
      </div>
      
      <button class="md:hidden text-slate-800" onclick={toggleMenu} aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
    </nav>
  </div>
  
  {#if isMenuOpen}
    <div class="md:hidden bg-white shadow-lg animate-in slide-in-from-top duration-300">
      <div class="container mx-auto px-4 py-3 flex flex-col space-y-4">
        <a href="/" class={`hover:text-blue-600 transition-colors ${page.url.pathname === '/' ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
          Home
        </a>
        <a href="/movies" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/movies') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
          Movies
        </a>
        <a href="/search" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/search') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
          Search
        </a>
        {#if isLoggedIn}
          <a href="/watchlist" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/watchlist') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
            My Watchlist
          </a>
        {/if}
        {#if isLoggedIn}
          <a href="/profile" class={`hover:text-blue-600 transition-colors ${page.url.pathname.startsWith('/profile') ? 'text-blue-600 font-medium' : 'text-slate-700'}`}>
            Profile
          </a>
        {:else}
          <a href="/login" class="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white text-center">
            Login
          </a>
        {/if}
      </div>
    </div>
  {/if}
</header>

<style>
  @keyframes animate-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-in {
    animation: animate-in 0.3s ease-out forwards;
  }
  
  .slide-in-from-top {
    animation: animate-in 0.3s ease-out forwards;
  }
</style>