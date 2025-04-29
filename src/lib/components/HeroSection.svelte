<script lang="ts">
  let { title, subtitle } = $props<{
    title: string;
    subtitle: string;
  }>();
</script>

<section class="text-center py-16 px-4 rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-100 shadow-sm border border-blue-100">
  <h1 class="text-5xl font-bold mb-6 animate-in slide-in-from-bottom duration-700">
    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
      {title}
    </span>
  </h1>
  <p class="text-xl text-slate-700 max-w-2xl mx-auto mb-8 animate-in slide-in-from-bottom duration-700 delay-150">
    {subtitle}
  </p>
  <div class="flex flex-wrap justify-center gap-4 animate-in slide-in-from-bottom duration-700 delay-300">
    <a href="/movies" class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium transition-all hover:scale-105 shadow-md">
      Browse Movies
    </a>
    <a href="/search" class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-all hover:scale-105 shadow-md">
      Search Movies
    </a>
  </div>
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
  
  .duration-700 {
    animation-duration: 700ms;
  }
  
  .delay-150 {
    animation-delay: 150ms;
  }
  
  .delay-300 {
    animation-delay: 300ms;
  }
</style> 