<script lang="ts">
  const currentYear = new Date().getFullYear();
</script>

<footer class="bg-white py-8 mt-12 border-t border-sky-100 shadow-sm">
  <div class="container mx-auto px-4">
    <div class="flex flex-col md:flex-row justify-between items-center">
      <div class="mb-4 md:mb-0">
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 font-bold text-xl">MovieWatchlist</span>
        <p class="text-slate-500 text-sm mt-1">Your personal movie collection</p>
      </div>
      <div class="flex space-x-6">
        <a href="/" class="text-slate-600 hover:text-blue-600 transition-colors">Home</a>
        <a href="/movies" class="text-slate-600 hover:text-blue-600 transition-colors">Movies</a>
        <a href="/search" class="text-slate-600 hover:text-blue-600 transition-colors">Search</a>
        <a href="/watchlist" class="text-slate-600 hover:text-blue-600 transition-colors">My Watchlist</a>
      </div>
    </div>
    <div class="mt-8 pt-6 border-t border-slate-100 text-center text-slate-500 text-sm">
      © {currentYear} MovieWatchlist. Powered by TMDB.
    </div>
  </div>
</footer> 