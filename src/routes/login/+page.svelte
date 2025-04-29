<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types.js';

	let { form }: { form: ActionData } = $props();
	
	let isLogin = $state(true);
	
	function toggleForm() {
		isLogin = !isLogin;
	}
</script>

<div class="max-w-md mx-auto">
	<div class="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in">
		<div class="p-8">
			<div class="text-center mb-8">
				<h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-700">
					{isLogin ? 'Welcome Back' : 'Create Account'}
				</h1>
				<p class="text-slate-600 mt-2">
					{isLogin ? 'Sign in to access your watchlist' : 'Join to start tracking your favorite movies'}
				</p>
			</div>
			
			<form method="post" action={isLogin ? '?/login' : '?/register'} use:enhance class="space-y-6">
				<div>
					<label for="username" class="block text-sm font-medium text-slate-700 mb-1">Username</label>
					<input 
						id="username" 
						name="username" 
						type="text" 
						required 
						class="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
				</div>
				
				<div>
					<label for="password" class="block text-sm font-medium text-slate-700 mb-1">Password</label>
					<input 
						id="password" 
						name="password" 
						type="password" 
						required 
						class="w-full px-4 py-3 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
					/>
				</div>
				
				{#if form?.message}
					<div class="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
						{form.message}
					</div>
				{/if}
				
				<button 
					type="submit" 
					class="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
				>
					{isLogin ? 'Sign In' : 'Create Account'}
				</button>
			</form>
			
			<div class="mt-6 text-center">
				<button 
					onclick={toggleForm} 
					class="text-blue-600 hover:text-blue-800 text-sm transition-colors"
				>
					{isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
				</button>
			</div>
		</div>
	</div>
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