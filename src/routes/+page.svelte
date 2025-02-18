<script>
	import ModeDropDown from '$components/modeDropDown/modeDropDown.svelte';
	import Carousel from '$components/carousel/carousel.svelte';
	import Carousel2 from '$components/carousel/carousel2.svelte';
</script>

<main>
	<div class="carousel">
		<!-- <Carousel /> -->
		<Carousel2 />
	</div>
	<h1>ciao sono pino</h1>
	<!-- <h1>Welcome to SvelteKit</h1>
	<p>
		Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation
	</p> -->

	<!-- <ModeDropDown /> -->
</main>

<style>
	.carousel {
		height: calc(100vh - 72px);
		overflow: hidden;
		display: flex;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
</style>
