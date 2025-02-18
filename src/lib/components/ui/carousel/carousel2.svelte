<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import type { EmblaCarouselSvelteType } from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';

	// const emblaNode = <HTMLElement>document.querySelector('.embla');
	// const viewportNode = <HTMLElement>emblaNode.querySelector('.embla__viewport');
	// const dotsNode = <HTMLElement>emblaNode.querySelector('.embla__dots');

	// const onNavButtonClick = (emblaApi: EmblaCarouselSvelteType): void => {
	// const autoplay = emblaApi?.plugins()?.autoplay;
	// if (!autoplay) return;
	//
	// const resetOrStop =
	// 	autoplay.options.stopOnInteraction === false ? autoplay.reset : autoplay.stop;
	//
	// resetOrStop();
	// };

	// const removeDotBtnsAndClickHandlers = addDotBtnsAndClickHandlers(
	// 	emblaApi,
	// 	dotsNode,
	// 	onNavButtonClick
	// );
	//
	// function onDestroy (removeDotBtnsAndClickHandlers);

	let options = { loop: true };
	let plugins = [Autoplay()];

	const images = [
		{ src: 'images/carousel/1.jpeg', alt: 'Car 1' },
		{ src: 'images/carousel/2.jpeg', alt: 'Car 2' },
		{ src: 'images/carousel/3.jpeg', alt: 'Car 3' },
		{ src: 'images/carousel/4.jpeg', alt: 'Car 4' },
		{ src: 'images/carousel/5.jpeg', alt: 'Car 5' },
		{ src: 'images/carousel/6.jpeg', alt: 'Car 6' },
		{ src: 'images/carousel/7.jpeg', alt: 'Car 7' },
		{ src: 'images/carousel/8.jpeg', alt: 'Car 8' },
		{ src: 'images/carousel/9.jpeg', alt: 'Car 9' }
	];
</script>

<div class="embla" use:emblaCarouselSvelte={{ options, plugins }}>
	<div class="embla__container">
		{#each images as { src, alt }}
			<div class="embla__slide">
				<img class="object-none sm:aspect-video sm:object-cover" {src} {alt} />
			</div>
		{/each}
	</div>
	<div class="embla__controls">
		<div class="embla__dots"></div>
	</div>
</div>

<style>
	.embla {
		overflow: hidden;
	}
	.embla__container {
		height: calc(100%-72px);
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
	}

	.embla__dots {
		display: flex;
		flex-wrap: wrap;
		justify-content: flex-end;
		align-items: center;
		margin-right: calc((2.6rem - 1.4rem) / 2 * -1);
	}
</style>
