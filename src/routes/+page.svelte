<script>
	import ModeDropDown from '$components/modeDropDown/modeDropDown.svelte';
</script>

<main>
	<!-- <h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p> -->

	<!-- <ModeDropDown /> -->
</main>

<style>
	main {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}

	.header {
		display: flex;
		gap: 40px;
		min-height: calc(100svh - 200px);
	}

	.cards {
		display: flex;
		gap: 40px;
	}
</style>
