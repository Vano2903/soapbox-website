<script lang="ts">
	import type { EventNonExpand } from '$tsTypes/event';
	import type { ChampionshipExpand, ChampionshipNonExpand } from '$tsTypes/championship';
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// const {
	// 	championshipsList,
	// 	foundChampionship,
	// 	foundEvent,
	// 	warnings
	// }: {
	// 	championshipsList: ChampionshipNonExpand[];
	// 	foundChampionship: ChampionshipExpand;
	// 	foundEvent: EventNonExpand | undefined;
	// 	warnings: string[];
	// } = data;

	// constant that defines how many elements to show on each side of the current element of the ElementSelection component
	const championshipsListOffset: number = 3;

	// destructures the data received from the PageLoad and prepares it to be derived (reactive to changes in value)
	const { data } = $props();
	const championshipsList = $derived(data.championshipsList);
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const foundEventDerived = $derived(data.foundEvent);
	const warningsDerived = $derived(data.warnings);

	// variables to handle the user choice of wich leaderboard show (if any)
	const categories = ['SoapBox', 'Pinocchio', 'Trike', 'Altro'];
	const leaderboards = [
		'Creatività',
		// 'Tecnica',
		// 'Pubblico',
		'Originalità',
		// 'Manche 0',
		'Manche 1',
		'Manche 2',
		'Velocità',
		'Finale'
	];
	let category = $state('SoapBox');
	let leaderboard = $state('Manche 1');

	// variables and functions to manage the content of leaderboard sheet, retrieved by a controlled polling on the Google Sheets API
	let sheetHTML = $state();
	async function updateSheet() {
		console.log('Updating sheet for category:', category, 'and leaderboard:', leaderboard);
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
	function startPollingUpdateSheet() {
		updateSheet();
		const interval = setInterval(updateSheet, pollingInterval);
		return () => clearInterval(interval);
	}

	let stopPollingUpdateSheet: (() => void) | undefined;
	$effect(() => {
		if (foundEventDerived?.onAir) {
			console.log('foundEventDerived (', foundEventDerived.name, ') is LIVE now!');
			stopPollingUpdateSheet = startPollingUpdateSheet();
		} else {
			console.log('foundEventDerived (', foundEventDerived?.name, ') is NOT LIVE now!');
			sheetHTML = '';
			if (stopPollingUpdateSheet) {
				stopPollingUpdateSheet();
			}
		}
	});

	// Functions to handle the selection of championship and event, causing a navigation to the new URL with hydration and updated props
	function selectionYear(year: string) {
		console.log('new year selection = {' + year + '}');
		const url = new URL(window.location.href);
		url.searchParams.set('championship', year);
		goto(url.toString(), {
			noScroll: true,
			keepFocus: true,
			replaceState: true,
			invalidateAll: true
		});
	}
	function selectionEvent(event: string) {
		console.log('new event selection = {' + event + '}');
		const url = new URL(window.location.href);
		url.searchParams.set('event', event);
		goto(url.toString(), {
			noScroll: true,
			keepFocus: true,
			replaceState: true,
			invalidateAll: true
		});
	}

	// Function to transform the championship list into a format suitable for ElementSelection (with extra empty boundaries for cool UI effects)
	function transformToElementList(championshipList: ChampionshipNonExpand[]) {
		let elementsList = championshipList.map((v) => {
			return {
				value: v.name,
				current: v.name === foundChampionshipDerived.name,
				disabled: false,
				icon: v.ongoing ? (foundEventDerived?.onAir ? LucideRadio : null) : LucideCalendarCheck
			};
		});
		for (let i = 0; i < Math.min(championshipsListOffset, 3); i++) {
			elementsList.push({
				value: (Number(championshipList.at(-1)?.name) + (i + 1)).toString(),
				current: false,
				disabled: true,
				icon: LucideLock
			});
		}
		return elementsList;
	}
</script>

<main class="px-5 pb-16 lg:px-15">
	<header class="flex flex-col items-center space-y-2 pt-14 pb-10">
		<span class="text-5xl font-bold"> Campionati </span>
		<p class="text-gray-500">Lorem ipsum dolor sit amet</p>
	</header>

	<div class="flex flex-col">
		<div class="my-5 flex justify-center">
			<ElementSelection
				offset={championshipsListOffset}
				elements={transformToElementList(championshipsList)}
				handleSelection={selectionYear}
				keysInteraction={true}
			/>
		</div>

		<div class="my-5 flex flex-row justify-center gap-4">
			{#each foundChampionshipDerived.expand.events as event}
				<button
					class="hover:underline {foundEventDerived?.id === event.id ? 'text-red-600' : ''}"
					onclick={() => selectionEvent(`${event.shortName}`)}
				>
					{event.shortName}
				</button>
			{/each}
		</div>

		<div class="my-5 flex flex-col items-center justify-center gap-4">
			{#each warningsDerived as warning}
				<span class="rounded-md bg-amber-100 p-5">{warning}</span>
			{/each}
		</div>
	</div>

	<div class="space-y-16">
		{#if foundEventDerived?.onAir}
			<section class="flex flex-col items-center">
				<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
				<div class="w-95/100 max-w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
		{#if null != null}
			<section class="mx-auto p-4">
				<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
				<div class="w-95/100 max-w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
		{#if null != null}
			<section class="mx-auto p-4">
				<h1 class="mb-4 text-2xl font-bold">Live Leaderboard</h1>
				<div class="w-95/100 max-w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
	</div>
</main>
