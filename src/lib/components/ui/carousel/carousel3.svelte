<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import type { CarouselPage } from '$tsTypes/carouselPage';

	let options = { loop: true };
	let plugins = [Autoplay()];

	let {
		pages,
		withControls = false
	}: {
		pages: CarouselPage[];
		withControls?: boolean;
	} = $props();
</script>

<div class="embla" use:emblaCarouselSvelte={{ options, plugins }}>
	<!-- If you wrap all in the viewport, for some not-understanded reasons, it will lock the carousel -->
	<!-- <div class="embla__viewport"> -->
	<div class="embla__container">
		{#each pages as page}
			<!-- For some reason, if sliders are writter in this way, the library don't know how to manage hidden components -->
			<!--
			{#if page.horizontal ?? false}
				<div class="embla__slide hidden md:block">
					<img
						class="h-full w-full object-none sm:aspect-video sm:object-cover"
						loading={page.loading}
						src={page.horizontal?.src}
						alt={page.horizontal?.alt}
					/>
				</div>
			{/if}
			{#if page.vertical ?? false}
				<div class="embla__slide block md:hidden">
					<img
						class="h-full w-full object-none sm:aspect-video sm:object-cover"
						loading={page.loading}
						src={page.vertical?.src}
						alt={page.vertical?.alt}
					/>
				</div>
			{/if}
			-->
			<div class="embla__slide">
				<img
					class="h-full w-full object-none sm:aspect-video sm:object-cover"
					loading={page.loading}
					src={page.vertical?.src}
					alt={page.vertical?.alt}
				/>
			</div>
		{/each}
	</div>
	<!-- But, theoretically, without viewport you can't embed controls of any type -->
	<!-- {#if withControls}
			<div class="embla__controls">
				<div class="embla__dots"></div>
			</div>
		{/if} -->
	<!-- </div> -->
</div>

<style>
	.embla {
		overflow: hidden;
	}
	.embla__container {
		max-height: calc(100vh - 72px);
		display: flex;
	}
	.embla__slide {
		flex: 0 0 100%;
		min-width: 0;
	}

	.embla__controls {
		display: grid;
		grid-template-columns: auto 1fr;
		justify-content: space-between;
		gap: 1.2rem;
		margin-top: 1.8rem;
		background-color: black;
	}

	.embla__dots {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
		margin-right: calc((2.6rem - 1.4rem) / 2 * -1);
	}
</style>
