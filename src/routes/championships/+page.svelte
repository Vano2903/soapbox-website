<script lang="ts">
	import type { ChampionshipNonExpand } from '$types/pocketbase/championship.js';
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
	const eventResultsDerived = $derived(data.eventResults);
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

	let eventResults = [
		{
			name: 'Giuria Creativa',
			path: '2025/02-Bergamo/creatività.pdf',
			date: '26/03/2025 18:53'
		},
		{
			name: 'Giuria Tecnica',
			path: '2025/02-Bergamo/tecnica.pdf',
			date: '26/03/2025 18:54'
		},
		{
			name: 'Voti del Pubblico',
			path: '2025/02-Bergamo/pubblico.pdf',
			date: '27/03/2025 18:00'
		},
		{
			name: 'Originalità',
			path: '2025/02-Bergamo/originalità.pdf',
			date: '26/03/2025 18:01'
		},
		{
			name: 'Stage 1',
			path: '2025/02-Bergamo/stage-1.pdf',
			date: '27/03/2025 15:20'
		},
		{
			name: 'Stage 2',
			path: '2025/02-Bergamo/stage-2.pdf',
			date: '27/03/2025 17:43'
		},
		{
			name: 'Velocità',
			path: '2025/02-Bergamo/velocità.pdf',
			date: '27/03/2025 17:44'
		},
		{
			name: 'Special Stage',
			path: '2025/02-Bergamo/stage-special.pdf',
			date: '27/03/2025 18:37'
		},
		{
			name: 'Finale',
			path: '2025/02-Bergamo/finale.pdf',
			date: '27/03/2025 18:42'
		}
	];
	let championshipResult = {
		name: 'Campionato 2025',
		path: '2025/campionato.pdf',
		date: '27/03/2025 19:00'
	};
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

		<div class="flex flex-row justify-center gap-4">
			{#each foundChampionshipDerived.expand.events as event}
				<button
					class="hover:underline {foundEventDerived?.id === event.id ? 'text-red-600' : ''}"
					onclick={() => selectionEvent(`${event.shortName}`)}
				>
					{event.shortName}
				</button>
			{/each}
		</div>

		<div class="my-4 flex flex-col items-center justify-center gap-4">
			{#each warningsDerived as warning}
				<span class="rounded-md bg-amber-100 p-5">{warning}</span>
			{/each}
		</div>
	</div>

	<div class="space-y-8">
		{#if foundEventDerived?.onAir}
			<section class="flex flex-col items-center gap-2">
				<h1 class="text-3xl font-bold">Classifica Live:</h1>
				<div class="flex flex-row items-center justify-center gap-4">
					<select
						bind:value={selectedCategory}
						onchange={updateSheet}
						class="rounded-xl bg-neutral-100 px-1.5 py-0.5"
					>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					<select
						bind:value={selectedLeaderboard}
						onchange={updateSheet}
						class="rounded-xl bg-neutral-100 px-1.5 py-0.5"
					>
						{#each leaderboards as leaderboard}
							<option value={leaderboard}>{leaderboard}</option>
						{/each}
					</select>
				</div>
				<div class="mt-4 w-full overflow-x-auto md:w-8/10">
					{@html sheetHTML}
				</div>
			</section>
		{/if}
		{#if !foundEventDerived?.onAir && eventResultsDerived}
			<section class="flex flex-col items-center gap-2">
				<h1 class="text-3xl font-bold">Classifiche Evento:</h1>
				<div class="flex w-full flex-col gap-2 md:w-8/10">
					{#each eventResultsDerived as result}
						<div
							class="xs:m-auto xs:w-8/10 flex flex-col justify-center rounded-md bg-neutral-50 p-2 shadow-sm md:w-6/10"
						>
							<div class="flex flex-row content-start justify-between">
								<span class="font-semibold">{result.data.shortName}:</span>
								<span class="line-clamp-2 justify-self-end text-right text-xs text-neutral-400"
									>{result.data.formattedUpdated}</span
								>
							</div>
							<a
								class="mt-1 ml-3 text-sm text-gray-600 hover:text-red-600"
								target="_blank"
								href={result.publicUrl}
							>
								<div class="flex items-center gap-1">
									<img
										src="https://www.boxrally.eu/boxrally/images/pdf_icon.gif"
										alt="PDF Icon"
										class="mr-1 shrink-0"
									/>
									<span class="xs:text-sm line-clamp-2 text-xs underline">{result.data.name}</span>
								</div>
							</a>
						</div>
					{/each}
					<!-- {#if championshipResult}
						<hr class="my-2" />
						<div
							class="xs:m-auto xs:w-8/10 flex flex-col justify-center rounded-md bg-neutral-200 p-2 shadow-sm md:w-6/10"
						>
							<div class="flex flex-row content-start justify-between">
								<span class="font-semibold">{championshipResult.name}:</span>
								<span class="justify-self-end text-right text-xs text-neutral-500"
									>{championshipResult.date}</span
								>
							</div>
							<a
								class="mt-1 ml-3 text-sm text-gray-600 hover:text-red-600"
								target="_blank"
								href={'results/' + championshipResult.path}
							>
								<div class="flex items-center gap-1">
									<img
										src="https://www.boxrally.eu/boxrally/images/pdf_icon.gif"
										alt="PDF Icon"
										class="mr-1 shrink-0"
									/>
									<span class="xs:text-sm line-clamp-2 text-xs underline"
										>{championshipResult.path}</span
									>
								</div>
							</a>
						</div>
					{/if} -->
				</div>
			</section>
		{/if}
	</div>
</main>

<style>
	button,
	a {
		cursor: pointer;
	}
</style>
