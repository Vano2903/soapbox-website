<!-- <script lang="ts">
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';
	import image1 from '$lib/assets/images/carousel/1.jpeg?enhanced';
	import image2 from '$lib/assets/images/carousel/2.jpeg?enhanced';
	import image3 from '$lib/assets/images/carousel/3 - Vert.jpeg?enhanced';
	import image4 from '$lib/assets/images/carousel/4.jpeg?enhanced';
	import image5 from '$lib/assets/images/carousel/5.jpeg?enhanced';
	import image6 from '$lib/assets/images/carousel/6.jpeg?enhanced';
	import image7 from '$lib/assets/images/carousel/7.jpeg?enhanced';
	import image8 from '$lib/assets/images/carousel/8.jpeg?enhanced';
	import image9 from '$lib/assets/images/carousel/9.jpeg?enhanced';

	const images = [
		{ src: image1, alt: 'Car 1' },
		{ src: image2, alt: 'Car 2' },
		{ src: image3, alt: 'Car 3' },
		{ src: image4, alt: 'Car 4' },
		{ src: image5, alt: 'Car 5' },
		{ src: image6, alt: 'Car 6' },
		{ src: image7, alt: 'Car 7' },
		{ src: image8, alt: 'Car 8' },
		{ src: image9, alt: 'Car 9' }
	];
</script>

<Splide
	options={{
		rewind: true,
		autoplay: true
	}}
>
	{#each images as { src, alt }}
		<SplideSlide class="h-lvh">
			<enhanced:img
				class="aspect-9/16 object-none sm:aspect-video sm:max-h-full sm:object-cover"
				{src}
				{alt}
			/>
		</SplideSlide>
	{/each}
</Splide>

<style>
</style> -->
