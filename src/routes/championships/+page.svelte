<script lang="ts">
	import type { ChampionshipNonExpand } from '$types/pocketbase/championship.js';
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock, ExternalLink } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import EventInfoBox from '$components/eventInfoBox/eventInfoBox.svelte';
	import { toEventInfoType, type EventNonExpand } from '$types/pocketbase/event';

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
	function enrollRedirect(year: string, event: string) {
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'redirect to enroll selection = {' + year + ' | ' + event + '}'
		);
		const params = new URLSearchParams(`championship=${year}&event=${event}`);
		goto(`/enroll?${params.toString()}`);
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
</script>

<main class="px-5 pb-16 lg:px-15">
	<header class="flex flex-col items-center space-y-2 pt-14 pb-10 text-center">
		<span class="text-5xl font-bold"> Campionati </span>
		<p class="max-w-4/5 text-base text-gray-500">
			Ogni tappa, ogni sfida, ogni discesa: qui trovi la storia dei nostri campionati. Scopri eventi
			passati, vivi le classifiche in diretta o prepara la prossima corsa.
		</p>
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

		<div class="flex flex-row flex-wrap justify-center gap-4">
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
		{:else if new Date(foundEventDerived?.startDate ?? '').valueOf() > new Date().valueOf()}
			<section class="flex flex-col items-center gap-2">
				<h1 class="text-3xl font-bold">Informazioni Evento:</h1>
				<div class="flex w-full flex-col gap-2 sm:w-2/3 lg:w-1/2 2xl:w-1/3">
					<div class="flex flex-col justify-center">
						<div class="box-border rounded-xl bg-neutral-100 p-2">
							<div class="inner fullborder p-1 lg:p-4">
								<EventInfoBox
									championshipInfo={foundChampionshipDerived}
									eventInfo={foundEventDerived as EventNonExpand}
									locatedOnCarousel={false}
								/>
								{#if foundEventDerived?.subscriptionsOpen}
									<div class="my-2 flex flex-row justify-center lg:my-0 lg:mt-4">
										<button
											class="btn btn-error text-foreground max-w-70"
											onclick={() =>
												enrollRedirect(
													`${foundChampionshipDerived.name}`,
													`${foundEventDerived.shortName}`
												)}
										>
											Iscriviti
										</button>
									</div>
								{:else}
									<div class="my-2 flex flex-row justify-center lg:my-0 lg:mt-4">
										<span>Le iscrizioni al momento non sono aperte.</span>
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</section>
		{:else}
			<section class="flex flex-col items-center gap-2">
				<h1 class="text-3xl font-bold">Classifiche Evento:</h1>
				<div class="flex w-full flex-col gap-2 md:w-8/10">
					{#if eventResultsDerived && eventResultsDerived.length > 0}
						{#each eventResultsDerived as result}
							<div
								class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 p-2 shadow-md transition duration-300 hover:scale-105 hover:bg-neutral-200 lg:w-7/10 hover:lg:scale-110"
							>
								<div class="flex flex-row content-start justify-between">
									<span class="text-lg font-semibold">{result.data.shortName}:</span>
									<span class="line-clamp-2 justify-self-end text-right text-xs text-neutral-400"
										>{result.data.formattedUpdated}</span
									>
								</div>
								<div class="mt-1 ml-3 flex items-center gap-1">
									<a class="peer cursor-pointer" target="_blank" href={result.publicUrl}>
										<img src="/images/icons/pdf.gif" alt="PDF Icon" class="mr-1 shrink-0" />
									</a>
									<a
										class="text-sm text-gray-600 peer-hover:text-red-600 hover:text-red-600"
										target="_blank"
										href={result.publicUrl}
									>
										<span class="xs:text-sm line-clamp-2 text-xs underline">{result.data.name}</span
										>
									</a>
								</div>
							</div>
						{/each}
					{:else}
						<div
							class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 px-4 py-8 shadow-md lg:w-7/10"
						>
							<p class="text-center">
								Per questo evento non sono ancora state pubblicate classifiche.
							</p>
						</div>
					{/if}
					<!--
						This feature is temporarily disabled. The system should be reinstated by requesting championship results information from the database.
						However, given the current database structure, the ability to choose whether the result is of the "stage/event/championship" type should be added, and the frontend should separate them accordingly.
						This feature is not currently strictly* needed, so we are postponing it.
						*: Because it's possible to publish the ranking as the result of event 'E' with filename "championship updated to race 'E'".
					-->
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

	.inner {
		border-radius: 0.5rem 0 0 0;
		border-top: 4px solid red;
		border-left: 4px solid red;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
	}

	.inner.fullborder {
		border-radius: 0.5rem;
		border: 2px solid red;
	}
</style>
