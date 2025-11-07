<script lang="ts">
	import emblaCarouselSvelte from 'embla-carousel-svelte';
	import Autoplay from 'embla-carousel-autoplay';
	import { defaultCarouselPage, type CarouselPageType } from '$lib/types/carouselPage';
	import type { EmblaCarouselType } from 'embla-carousel';
	import EnhancedImage from '$components/enhanedImage/enhancedImage.svelte';

	let options = { loop: true };
	let plugins = []; //[Autoplay({ delay: 5000, stopOnInteraction: false })];

	let emblaApi: EmblaCarouselType;
	function onInit(event: CustomEvent<EmblaCarouselType>): void {
		emblaApi = event.detail;
		emblaApi.on('select', () => {
			activePage = emblaApi.selectedScrollSnap();
		});
		activePage = emblaApi.selectedScrollSnap();
	}
	function handleControl(index: number): void {
		if (emblaApi) emblaApi.scrollTo(index);
		activePage = index;
	}

	let {
		pages,
		withControls = false,
		startingPage = 0
	}: {
		pages: CarouselPageType[];
		withControls?: boolean;
		startingPage?: number;
	} = $props();

	let activePage = $state(startingPage);
	handleControl(startingPage);
</script>

<div class="embla relative" use:emblaCarouselSvelte={{ options, plugins }} onemblaInit={onInit}>
	<div class="embla__container h-full">
		{#each pages as page}
			<div class="embla__slide">
				{#if (page.layout ?? defaultCarouselPage.layout) === 'both'}
					<!-- <enhanced:img
						class="hidden h-full w-full object-none sm:aspect-video sm:object-cover
								{page.breakpoint ?? defaultCarouselPage.breakpoint}:block"
						loading={page.loading}
						fetchpriority={page.fetchpriority}
						src={page.horizontal?.src}
						alt={page.horizontal?.alt}
					/>
					<enhanced:img
						class="block h-full w-full object-none sm:aspect-video sm:object-cover
								{page.breakpoint ?? defaultCarouselPage.breakpoint}:hidden"
						loading={page.loading}
						fetchpriority={page.fetchpriority}
						src={page.vertical?.src.img.src}
						alt={page.vertical?.alt}
					/> -->
					<EnhancedImage
						pictureClass="hidden h-full w-full object-cover sm:aspect-video 
								{page.breakpoint ?? defaultCarouselPage.breakpoint}:block"
						imageClass="h-full w-full sm:aspect-video object-cover"
						loading={page.loading}
						fetchpriority={page.fetchpriority}
						picture={page.horizontal.src}
						alt={page.horizontal?.alt}
					/>
					<EnhancedImage
						pictureClass="block h-full w-full object-cover sm:aspect-video
								{page.breakpoint ?? defaultCarouselPage.breakpoint}:hidden"
						imageClass="h-full w-full sm:aspect-video object-cover"
						loading={page.loading}
						fetchpriority={page.fetchpriority}
						picture={page.vertical.src}
						alt={page.vertical?.alt}
					/>
				{:else if (page.layout ?? defaultCarouselPage.layout) === 'horizontal'}
					<EnhancedImage
						pictureClass="hidden h-full w-full object-cover sm:aspect-video 
								{page.breakpoint ?? defaultCarouselPage.breakpoint}:block"
						imageClass="h-full w-full sm:aspect-video object-cover"
						loading={page.loading}
						fetchpriority={page.fetchpriority}
						picture={page.horizontal.src}
						alt={page.horizontal?.alt}
					/>
				{:else if (page.layout ?? defaultCarouselPage.layout) === 'vertical'}
					<EnhancedImage
						pictureClass="block h-full w-full object-cover sm:aspect-video
								{page.breakpoint ?? defaultCarouselPage.breakpoint}:hidden"
						imageClass="h-full w-full sm:aspect-video object-cover"
						loading={page.loading}
						fetchpriority={page.fetchpriority}
						picture={page.vertical.src}
						alt={page.vertical?.alt}
					/>
				{/if}
			</div>
		{/each}
	</div>
	{#if withControls}
		<div
			class="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-row items-center justify-center gap-2"
			use:emblaCarouselSvelte
		>
			{#each pages as _, index}
				<button
					class="h-4 w-4 rounded-full transition-colors duration-300
						{activePage === index ? `bg-red-600` : `bg-white hover:bg-neutral-400`}"
					onclick={() => handleControl(index)}
					aria-label="Slide {index}"
				></button>
			{/each}
		</div>
	{/if}
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
