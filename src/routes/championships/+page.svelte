<script lang="ts">
	import { onMount } from 'svelte';
	import { string } from 'zod';

	// user input
	let category = 'SoapBox';
	let leaderboard = 'Velocità';

	let sheetHTML = $state();
	async function updateSheet() {
		try {
			let response = await fetch(
				`/championships/sheetData?category=${category}&leaderboard=${leaderboard}`
			);
			sheetHTML = await response.text();
		} catch (err) {
			console.error('Error fetching sheet data:', err);
		}
	}

	const pollingInterval = 30000;
	onMount(() => {
		updateSheet();
		const interval = setInterval(updateSheet, pollingInterval);
		return () => clearInterval(interval);
	});
</script>

<main class="p-6">
	<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
	<div class="prose max-w-full overflow-x-auto">
		{@html sheetHTML}
	</div>
</main>
