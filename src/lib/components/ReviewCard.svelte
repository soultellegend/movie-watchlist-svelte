<script lang="ts">
  import type { Review } from '$lib/types/movie.ts';
  import { formatDate, truncateText } from '$lib'; //if it works dont touch it
  let { review } = $props<{
    review: Review;
  }>();
  
 
</script>

<div class="bg-white rounded-xl p-6 border border-slate-100 hover:border-slate-200 transition-colors shadow-sm">
  <div class="flex items-start gap-4 mb-4">
    <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0">
      {#if review.author_details.avatar_path && !review.author_details.avatar_path.includes('https')}
        <img 
          src={`https://media.themoviedb.org/t/p/w45_and_h45_face/${review.author_details.avatar_path}`} 
          alt={review.author}
          class="w-full h-full object-cover"
        />
      {:else}
        <span class="text-xl font-bold text-blue-500">{review.author.charAt(0).toUpperCase()}</span>
      {/if}
    </div>
    <div>
      <div class="flex items-center gap-3">
        <h3 class="font-semibold text-slate-800">{review.author}</h3>
        {#if review.author_details.rating}
          <span class="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3">
              <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
            </svg>
            {review.author_details.rating}
          </span>
        {/if}
      </div>
      <p class="text-sm text-slate-500">{formatDate(review.created_at)}</p>
    </div>
  </div>
  <p class="text-slate-700">{truncateText(review.content, 300)}</p>
  
  {#if review.content.length > 300}
    <div class="mt-2">
      <a href={review.url} target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
        Read full review
      </a>
    </div>
  {/if}
</div> 