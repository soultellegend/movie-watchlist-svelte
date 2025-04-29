<script lang="ts">
	import '../app.css';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	let { children } = $props();
</script>

<div class="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-indigo-100 text-slate-800">
	<Navbar />

	<main class="flex-grow container mx-auto px-4 py-6">
		{@render children()}
	</main>

	<Footer />
</div>
