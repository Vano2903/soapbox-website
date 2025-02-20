<script>
	import ModeDropDown from '$components/modeDropDown/modeDropDown.svelte';
	import Carousel from '$components/carousel/carousel.svelte';
	import Carousel2 from '$components/carousel/carousel2.svelte';
	const { data } = $props();
</script>

<main>
	<div class="carousel">
		<!-- <Carousel /> -->
		<Carousel2 />
		<aside class="info-box">
			<div class="inner">
				<div class="rect"></div>
			</div>
		</aside>
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
		overflow: hidden;
		display: flex;
		position: relative;
		justify-content: end;
		align-items: center;
	}

	.info-box {
		border-radius: 1rem 0 0 1rem;
		position: absolute;
		height: 70%;
		width: 30%;
		z-index: 100;
		padding: 0.5rem 0 0 0.5rem;
		box-sizing: border-box;
		background: white;
		padding-bottom: 1rem;
	}

	.inner {
		padding: 1rem;
		border-radius: 0.5rem 0 0 0;
		border-top: 4px solid red;
		border-left: 4px solid red;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
	}

	.rect {
		height: 100%;
		width: 100%;
		background-color: red;
	}

	main {
		display: flex;
		flex-direction: column;
		gap: 40px;
	}
</style>
