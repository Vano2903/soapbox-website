<script lang="ts">
	import { Splide, SplideSlide } from '@splidejs/svelte-splide';
	import '@splidejs/svelte-splide/css';

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

<Splide
	options={{
		rewind: true,
		autoplay: true
	}}
>
	{#each images as { src, alt }}
		<SplideSlide class="h-lvh">
			<img
				class="aspect-9/16 object-none sm:aspect-video sm:max-h-full sm:object-cover"
				{src}
				{alt}
			/>
		</SplideSlide>
	{/each}
</Splide>

<style>
</style>
