<script>
	import ModeDropDown from '$components/modeDropDown/modeDropDown.svelte';
	import Carousel from '$components/carousel/carousel.svelte';
</script>

<main>
	<div class="max-w-6xl">
		<Carousel />
	</div>
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
</style>
