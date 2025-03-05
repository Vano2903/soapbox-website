<script lang="ts">
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import Image from '$components/gallery/image.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();

	function yearSelectionClick(year: string) {
		console.log('year click:', year);
		// $page.set({ year: year });
		// page.url.searchParams.set('year', year);
		goto(`?year=${year}`);
		console.log('should go to year', year);
	}

	// const years = [
	// 	{ value: '2020', current: false, disabled: false },
	// 	{ value: '2021', current: false, disabled: false },
	// 	{ value: '2022', current: false, disabled: false },
	// 	{ value: '2023', current: true, disabled: false, icon: LucideOrigami },
	// 	{ value: '2024', current: false, disabled: false },
	// 	{ value: '2025', current: false, disabled: true },
	// 	{ value: '2026', current: false, disabled: true },
	// 	{ value: '2027', current: false, disabled: true }
	// ];

	const years = $derived.by(() => {
		if (data.setQueryParameter || data.action === 'redirect') {
			goto(`?year=${data.currentReturnedYear}`);
			return;
		}

		console.log('deriving years');
		const selectedYear = data.currentReturnedYear;
		return data.availableYears?.map((year) => {
			return {
				value: year.toString(),
				current: selectedYear === year,
				disabled: false
			};
		});
	});

	let offset = $state(3);

	type ImageType = {
		height: number;
		width: number;
		url: string;
		ratio: number;
	};

	function mockImageArray(num: number): ImageType[] {
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

	// const imageCount = 30;
</script>

<main>
	<div class=" flex w-full justify-center py-4 pb-10">
		<ElementSelection
			keysInteraction={true}
			bind:offset
			elements={years ?? []}
			handleSelection={yearSelectionClick}
		/>
	</div>
	<!-- {#await data.groups}
		<p>Caricamento...</p>
	{:then groups} -->
	{#each data.groups as group}
		<section class="px-2 pb-24">
			<div class="py-4">
				<div class="flex items-baseline justify-between">
					<h2 class="pb-2 text-start text-3xl font-bold md:text-5xl">
						{group.name}
					</h2>
					<p class="text-xl md:text-3xl">
						{!group.date.toString().startsWith('0001')
							? group.date.slice(1, 10).replace(/-/g, '/')
							: ''}
					</p>
				</div>
				<p class="text-2xl">
					<span class="font-bold text-gray-600">{group.author}</span>
					<span class=" text-gray-500 italic">{group.location}</span>
				</p>
			</div>
			<div id="mansory" class="flex flex-wrap gap-2">
				{#each group.images as image}
					<Image url={image.thumb} --ratio={image.width / image.height} />
				{/each}
				<!-- {#each mockImageArray(imageCount) as image}
			<Image url={image.url} --ratio={image.ratio} />
		{/each} -->
			</div>
		</section>
	{/each}

	<!-- {:catch error}
		{console.error(error)}
		<p>Errore nel Cercare le immagini, Prova più Tardi</p>
	{/await} -->
</main>

<style></style>
