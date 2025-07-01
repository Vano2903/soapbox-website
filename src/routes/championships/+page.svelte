<script lang="ts">
	import { ResultStatusType, StageKindType } from '$tsTypes/championships/utils';
	import { innerWidth } from 'svelte/reactivity/window';

	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock } from 'lucide-svelte';

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	// user input
	let category = 'SoapBox';
	//let leaderboard = 'Creatività';
	//let leaderboard = 'Velocità';
	let leaderboard = 'Manche 2';

	let sheetHTML = $state();
	async function updateSheet() {
		try {
			let response = await fetch(
				`/championships/sheetData?category=${category}&leaderboard=${leaderboard}`
			);
			sheetHTML = await response.text();
		} catch (err) {
			console.error('Error fetching sheet data:', err);
		}
	}

	const pollingInterval = 30000;
	onMount(() => {
		updateSheet();
		// const interval = setInterval(updateSheet, pollingInterval);
		// return () => clearInterval(interval);
	});

	// ------------------------------------------ Old Page ----------------------------------------
	const years = $state([
		{ value: '2020', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2021', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2022', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2023', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2024', current: true, disabled: false, icon: LucideRadio },
		{ value: '2025', current: false, disabled: true, icon: LucideLock },
		{ value: '2026', current: false, disabled: true, icon: LucideLock },
		{ value: '2027', current: false, disabled: true, icon: LucideLock }
	]);
	const offset = 3;

	function yearSelectionClick(year: string) {
		console.log('year click:', year);

		// goto(`?year=${year}`);
		// console.log('should go to year', year);

		const url = new URL(window.location.href);
		url.searchParams.set('year', year);
		goto(url.toString(), { noScroll: true });
	}
	function rallySelectionClick(rally: string) {
		//rally_selected = rally;
		console.log('rally click:', rally);

		// goto(`?rally=${rally}`);
		const url = new URL(window.location.href);
		url.searchParams.set('rally', rally);
		goto(url.toString(), { noScroll: true });
		console.log('should go to rally', rally);
	}
</script>

<main class="px-5 pb-16 lg:px-15">
	<header class="flex flex-col items-center space-y-2 pt-14 pb-10">
		<span class="text-5xl font-bold"> Campionati </span>
		<p class="text-gray-500">Lorem ipsum dolor sit amet</p>
	</header>
	<div class="flex justify-center pb-20">
		<ElementSelection
			{offset}
			elements={years}
			handleSelection={yearSelectionClick}
			keysInteraction={true}
		/>
	</div>
	<div class="space-y-16">
		{#if 'liveLeaderboards' != null}
			<section class="flex flex-col items-center">
				<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
				<div class="w-95/100 max-w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
		{#if 'championshipLeaderboard' != null}
			<section class="mx-auto p-4">
				<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
				<div class="w-95/100 max-w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
		{#if 'eventLeaderboard' != null}
			<section class="mx-auto p-4">
				<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
				<div class="w-95/100 max-w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
	</div>
</main>
