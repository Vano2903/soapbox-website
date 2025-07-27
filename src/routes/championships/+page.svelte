<script lang="ts">
	import type { ChampionshipNonExpand } from '$lib/types/championship';
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
	const championshipsListDerived = $derived(data.championshipsList);
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const foundEventDerived = $derived(data.foundEvent);
	const warningsDerived = $derived(data.warnings);

	// variables to handle the user choice of wich leaderboard show (if any)
	const categories = ['SoapBox', 'Pinocchio', 'Trike', 'Altro'];
	const leaderboards = [
		// 'Creatività',
		// 'Tecnica',
		// 'Pubblico',
		// 'Originalità',
		// 'Manche 0',
		'Manche 1',
		'Manche 2',
		'Velocità',
		'Finale'
	];
	let selectedCategory = $state('SoapBox');
	
	let selectedLeaderboard = $state('Manche 1');

	// variables and functions to manage the content of leaderboard sheet, retrieved by a controlled polling on the Google Sheets API
	let sheetHTML = $state();
	async function updateSheet() {
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'Updating sheet for category:',
			selectedCategory,
			'and leaderboard:',
			selectedLeaderboard
		);
		try {
			let response = await fetch(
				`/championships/sheetData?category=${selectedCategory}&leaderboard=${selectedLeaderboard}`
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
			console.log(
				new Date().toLocaleTimeString('it-IT', { hour12: false }),
				'foundEventDerived (',
				foundEventDerived.name,
				') is LIVE now!'
			);
			if (!stopPollingUpdateSheet) {
				console.log(
					new Date().toLocaleTimeString('it-IT', { hour12: false }),
					'starting new polling update sheet...'
				);
				stopPollingUpdateSheet = startPollingUpdateSheet();
			}
		} else {
			console.log(
				new Date().toLocaleTimeString('it-IT', { hour12: false }),
				'foundEventDerived (',
				foundEventDerived?.name,
				') is NOT LIVE now!'
			);
			sheetHTML = '';
			if (stopPollingUpdateSheet) {
				stopPollingUpdateSheet();
			}
		}
	});

	// Functions to handle the selection of championship and event, causing a navigation to the new URL with hydration and updated props
	function selectionYear(year: string) {
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'new year selection = {' + year + '}'
		);
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
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'new event selection = {' + event + '}'
		);
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
			const isOngoing = v.ongoing;
			const isLive = foundChampionshipDerived.expand.events.some((e) => e.onAir === true);

			return {
				value: v.name,
				current: v.name === foundChampionshipDerived.name,
				disabled: false,
				icon: isOngoing && isLive ? LucideRadio : isOngoing ? null : LucideCalendarCheck,
				iconProps: isOngoing && isLive ? { color: '#e7000b' } : {}
			};
		});
		for (let i = 0; i < Math.min(championshipsListOffset, 3); i++) {
			elementsList.push({
				value: (Number(championshipList.at(-1)?.name) + (i + 1)).toString(),
				current: false,
				disabled: true,
				icon: LucideLock,
				iconProps: {}
			});
		}
		return elementsList;
	}

	function testIcons() {
		const showIcon = foundChampionshipDerived.expand.events.some((v) => {
			return v.onAir === true;
		});
		console.log('testIcons', showIcon);
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
				elements={transformToElementList(championshipsListDerived)}
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
			<section class="flex flex-col items-center gap-2">
				<h1 class="text-3xl font-bold">Classifica Live:</h1>
				<div class="flex flex-row items-center justify-center gap-4">
					<select
						bind:value={selectedCategory}
						onchange={updateSheet}
						class="rounded-xl bg-neutral-100 px-1.5 py-0.5"
					>
						{#each categories as cat}
							<option value={cat}>{cat}</option>
						{/each}
					</select>
					<select
						bind:value={selectedLeaderboard}
						onchange={updateSheet}
						class="rounded-xl bg-neutral-100 px-1.5 py-0.5"
					>
						{#each leaderboards as board}
							<option value={board}>{board}</option>
						{/each}
					</select>
				</div>
				<div class="mt-4 w-95/100 max-w-full overflow-x-auto md:w-8/10">
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
