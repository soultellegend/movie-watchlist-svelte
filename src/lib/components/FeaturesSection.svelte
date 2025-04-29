<script lang="ts">
  const features = [
    {
      title: "Discover New Movies",
      description: "Explore the latest releases and find hidden gems based on your preferences.",
      icon: "🔍"
    },
    {
      title: "Track Your Watchlist",
      description: "Keep track of movies you want to watch and organize your personal collection.",
      icon: "📋"
    },
    {
      title: "Rate & Review",
      description: "Share your thoughts and see what others think about your favorite films.",
      icon: "⭐"
    },
    {
      title: "Personalized Recommendations",
      description: "Get movie suggestions tailored to your taste and viewing history.",
      icon: "🎯"
    }
  ];
</script>

<section class="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl shadow-sm border border-blue-100 p-8">
  <h2 class="text-3xl font-bold text-center mb-10">
    <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
      Features You'll Love
    </span>
  </h2>
  
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
    {#each features as feature, i}
      <div class="bg-white p-6 rounded-xl shadow-sm border border-slate-100 animate-in slide-in-from-bottom duration-500" style="animation-delay: {i * 100}ms">
        <div class="text-4xl mb-4">{feature.icon}</div>
        <h3 class="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
        <p class="text-slate-600">{feature.description}</p>
      </div>
    {/each}
  </div>
  
  <div class="mt-10 text-center">
    <a href="/search" class="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full font-medium transition-all hover:scale-105 shadow-md">
      Get Started Now
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
  
  .duration-500 {
    animation-duration: 500ms;
  }
</style> 