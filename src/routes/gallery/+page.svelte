<script lang="ts">
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import Image from '$components/gallery/image.svelte';
	import { goto } from '$app/navigation';

	const { data } = $props();

	function yearSelectionClick(year: string) {
		pendingYear = year;
		goto(`?year=${year}`);
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
	let pendingYear = $state<string | null>(null);
	const INITIAL_IMAGE_BATCH_SIZE = 8;
	const IMAGE_BATCH_SIZE = 12;
	let visibleImagesByGroupId = $state<Record<string, number>>({});
	let progressiveTimer: ReturnType<typeof setInterval> | undefined;

	$effect(() => {
		data.currentReturnedYear;
		pendingYear = null;

		if (progressiveTimer) {
			clearInterval(progressiveTimer);
			progressiveTimer = undefined;
		}

		const nextVisible: Record<string, number> = {};
		for (const group of data.groups ?? []) {
			nextVisible[group.id] = Math.min(INITIAL_IMAGE_BATCH_SIZE, group.images.length);
		}
		visibleImagesByGroupId = nextVisible;

		if (!data.groups?.length) return;
		progressiveTimer = setInterval(() => {
			let allLoaded = true;
			const updated = { ...visibleImagesByGroupId };
			for (const group of data.groups) {
				const current = updated[group.id] ?? INITIAL_IMAGE_BATCH_SIZE;
				if (current < group.images.length) {
					updated[group.id] = Math.min(current + IMAGE_BATCH_SIZE, group.images.length);
					allLoaded = false;
				}
			}
			visibleImagesByGroupId = updated;
			if (allLoaded && progressiveTimer) {
				clearInterval(progressiveTimer);
				progressiveTimer = undefined;
			}
		}, 140);

		return () => {
			if (progressiveTimer) {
				clearInterval(progressiveTimer);
				progressiveTimer = undefined;
			}
		};
	});

	function getVisibleImageCount(groupId: string): number {
		return visibleImagesByGroupId[groupId] ?? IMAGE_BATCH_SIZE;
	}

	function loadMore(groupId: string, total: number) {
		const current = getVisibleImageCount(groupId);
		if (current >= total) return;
		visibleImagesByGroupId = {
			...visibleImagesByGroupId,
			[groupId]: Math.min(current + IMAGE_BATCH_SIZE, total)
		};
	}

	function observeLoadMore(node: HTMLElement, params: { groupId: string; total: number }) {
		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries.some((entry) => entry.isIntersecting);
				if (!visible) return;
				loadMore(params.groupId, params.total);
			},
			{ rootMargin: '500px 0px' }
		);

		observer.observe(node);
		return {
			update(nextParams: { groupId: string; total: number }) {
				params = nextParams;
			},
			destroy() {
				observer.disconnect();
			}
		};
	}
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
	{#if pendingYear !== null}
		<section class="px-2 pb-24">
			<div class="skeleton mb-4 h-10 w-80 rounded-md"></div>
			<div class="skeleton mb-6 h-8 w-56 rounded-md"></div>
			<div class="flex flex-wrap gap-2">
				{#each Array.from({ length: 18 }) as _}
					<div
						class="skeleton h-32 w-40 rounded-md md:h-64 md:w-72"
						aria-hidden="true"
					></div>
				{/each}
			</div>
		</section>
	{:else}
		{#each data.groups as group}
			<section class="px-2 pb-24">
				<div class="py-4">
					<div class="flex items-baseline justify-between">
						<h2 class="pb-2 text-start text-3xl font-bold md:text-5xl">
							{group.name}
						</h2>
						<p class="text-xl md:text-3xl">
							{!group.date.toString().startsWith('0001')
								? group.date.slice(0, 10).replace(/-/g, '/')
								: ''}
						</p>
					</div>
					<p class="text-2xl">
						<span class="font-bold text-gray-600">{group.author}</span>
						<span class=" text-gray-500 italic">{group.location}</span>
					</p>
				</div>
				<div id="mansory" class="flex flex-wrap gap-2">
					{#each group.images.slice(0, getVisibleImageCount(group.id)) as image}
						<Image
							url={image.thumb}
							alt={`${group.name} ${image.width}x${image.height}`}
							--ratio={image.width / image.height}
						/>
					{/each}
				</div>
				{#if getVisibleImageCount(group.id) < group.images.length}
					<div
						class="h-8 w-full"
						use:observeLoadMore={{ groupId: group.id, total: group.images.length }}
						aria-hidden="true"
					></div>
				{/if}
			</section>
		{/each}
	{/if}

	<!-- {:catch error}
		{console.error(error)}
		<p>Errore nel Cercare le immagini, Prova più Tardi</p>
	{/await} -->
</main>

<style></style>
