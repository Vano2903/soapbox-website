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

	let offset = $state(3);

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
				url: `https://picsum.photos/${width}/${height}`
			});
		}
		return images;
	}

	const imageCount = 30;
</script>

<main>
	<div class=" flex w-full justify-center py-4">
		<ElementSelection bind:offset elements={years} handleClick={yearSelectionClick} />
	</div>

	<section class="px-2">
		<div id="mansory" class="flex flex-wrap gap-2">
			{#each mockImageArray(imageCount) as image}
				<div
					class="md:64 h-32 flex-[1_0_auto] rounded-md border border-gray-300 bg-gray-200"
					style="background-image: url({image.url}); width:calc({image.ratio}*8rem);  background-size: cover; background-position:
				center center;"
				></div>
			{/each}
		</div>
	</section>
</main>

<style></style>
