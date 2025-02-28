<script lang="ts">
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideOrigami } from 'lucide-svelte';
	import { onMount } from 'svelte';

	function yearSelectionClick(year: string) {
		console.log('year click:', year);
	}

	const years = [
		{ value: '2020', current: false, disabled: false },
		{ value: '2021', current: false, disabled: false },
		{ value: '2022', current: false, disabled: false },
		{ value: '2023', current: true, disabled: false, icon: LucideOrigami },
		{ value: '2024', current: false, disabled: false },
		{ value: '2025', current: false, disabled: true },
		{ value: '2026', current: false, disabled: true },
		{ value: '2027', current: false, disabled: true }
	];
	const offset = 3;

	type Image = {
		height: number;
		width: number;
		url: string;
		ratio: number;
	};

	function mockImageArray(num: number): Image[] {
		let images = [];
		for (let i = 0; i < num; i++) {
			let width = Math.floor(Math.random() * 1000) + 500;
			let height = Math.floor(Math.random() * 1000) + 500;
			images.push({
				height: height,
				width: width,
				ratio: width / height,
				url: `https://picsum.photos/${Math.floor(Math.random() * 1000) + 500}/${Math.floor(Math.random() * 1000) + 500}`
			});
		}
		return images;
	}

	const imageCount = 30;
</script>

<main>
	<div class="flex justify-center py-4">
		<ElementSelection {offset} elements={years} handleClick={yearSelectionClick} />
	</div>

	<section>
		<!-- <Mansory stretchFirst={true} gridGap={'0.75rem'} colWidth={'minmax(Min(20em, 100%), 1fr)'}> -->
		<!-- 	{#each mockImageArray(20) as image} -->
		<!-- 		<img src={image.url} class="h-64 bg-gray-700" loading="lazy" alt="random" /> -->
		<!-- 	{/each} -->
		<div id="mansory" class="flex flex-wrap gap-2">
			{#each mockImageArray(imageCount) as image}
				<div
					class="h-64 flex-[1_0_auto] bg-amber-500"
					style="background-image: url({image.url}); background-size: cover; background-position:
			center center;"
				></div>
			{/each}
		</div>
		<!-- </Mansory> -->
	</section>
</main>

<style lang="scss">
	#mansory {
		@for $i from 1 through 1000 {
			div:nth-child(#{$i}) {
				$h: (random(400) + 70) + px;
				width: $h;
			}
		}
	}
</style>
