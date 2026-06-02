<script lang="ts">
	import type { ChampionshipNonExpand } from '$types/pocketbase/championship.js';
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock, Info, UserRoundPlus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import EventInfoBox from '$components/eventInfoBox/eventInfoBox.svelte';
	import {
		EventCategory,
		EventLeaderboard,
		type EventAvailableLeaderboards,
		type EventNonExpand
	} from '$types/pocketbase/event';
	import { LeaderboardType } from '$types/pocketbase/results';
	import ContextualHelp from '$components/contextualHelp/contextualHelp.svelte';
	import { DefaultEventAvailableLeaderboards } from '$lib/utils/eventUtils.js';

	const championshipsListOffset: number = 3;

	const { data } = $props();
	const championshipsListDerived = $derived(data.championshipsList);
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const foundEventDerived = $derived(data.foundEvent);
	const eventResultsDerived = $derived(data.eventResults);
	const foundCategoryDerived = $derived(data.foundCategory);
	const foundLeaderboardDerived = $derived(data.foundLeaderboard);
	const championshipsIdsWithOnAirEvents = $derived(data.championshipsIdsWithOnAirEvents);
	const warningsDerived = $derived(data.warnings);
	const contextualHelps = $derived(data.contextualHelps);

	// Results split by type
	const stageAndEventResultsDerived = $derived(
		eventResultsDerived?.filter((r) =>
			r.data.leaderboardType == LeaderboardType.Stage || r.data.leaderboardType == LeaderboardType.Event
		)
	);
	const championshipResultsDerived = $derived(
		eventResultsDerived?.filter((r) => r.data.leaderboardType == LeaderboardType.Championship)
	);

	// --- URL-driven selections ---
	const leaderboardMap = $derived((foundEventDerived?.availableLeaderboards ?? DefaultEventAvailableLeaderboards) as EventAvailableLeaderboards);
	const categories = $derived(
		Object.entries(leaderboardMap)
			.filter(([, leaderboards]) => (leaderboards?.length ?? 0) > 0)
			.map(([key]) => key as EventCategory)
	);

	const selectedChampionship = $derived(foundChampionshipDerived?.name ?? '');
	const selectedEvent = $derived(foundEventDerived?.shortName ?? '');
	let selectedCategory = $derived(foundCategoryDerived ?? '');
	let selectedLeaderboard = $derived(foundLeaderboardDerived ?? '');

	// let selectedCategory = $derived.by((): EventCategory => {
	// 	const param = $page.url.searchParams.get('category') as EventCategory | null;
	// 	if (param && categories.includes(param)) return param;
	// 	return categories[0] ?? EventCategory.SoapBox;
	// });

	const leaderboards = $derived(leaderboardMap[selectedCategory] ?? []);
	// let selectedLeaderboard = $derived.by((): EventLeaderboard => {
	// 	const param = $page.url.searchParams.get('leaderboard') as EventLeaderboard | null;
	// 	if (param && leaderboards.includes(param)) return param;
	// 	return leaderboards[0] ?? EventLeaderboard.Stage1;
	// });

	// --- Sheet polling ---
	let sheetHTML = $state();
	// Accept explicit values so callers can pass the new selection before the derived has updated
	async function updateSheet(category = selectedCategory, leaderboard = selectedLeaderboard) {
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'Updating sheet — category:', category, 'leaderboard:', leaderboard
		);
		try {
			const response = await fetch(
				`/leaderboards/sheetData?category=${category}&leaderboard=${leaderboard}`
			);
			if (!response.ok) {
				console.error('Sheet data not available:', response.status, await response.text());
				sheetHTML = '';
				return;
			}
			sheetHTML = await response.text();
		} catch (err) {
			console.error('Error fetching sheet data:', err);
		}
	}

	const pollingInterval = 30000;
	function startPollingUpdateSheet() {
		updateSheet(selectedCategory, selectedLeaderboard);
		const interval = setInterval(() => {
			console.log("updateSheet() called from startPollingUpdateSheet.\n| Using default category:", selectedCategory, "and leaderboard:", selectedLeaderboard);
			updateSheet(selectedCategory, selectedLeaderboard);
		}, pollingInterval);
		return () => clearInterval(interval);
	}

	let stopPollingUpdateSheet: (() => void) | undefined;
	$effect(() => {
		if (foundEventDerived?.onAir) {
			console.log(new Date().toLocaleTimeString('it-IT', { hour12: false }), 'foundEventDerived (', foundEventDerived.name, ') is LIVE now!');
			if (!stopPollingUpdateSheet) {
				console.log(new Date().toLocaleTimeString('it-IT', { hour12: false }), 'starting new polling update sheet...');
				stopPollingUpdateSheet = startPollingUpdateSheet();
			}
		} else {
			console.log(new Date().toLocaleTimeString('it-IT', { hour12: false }), 'foundEventDerived (', foundEventDerived?.name, ') is NOT LIVE now!');
			sheetHTML = '';
			if (stopPollingUpdateSheet) {
				stopPollingUpdateSheet();
				stopPollingUpdateSheet = undefined;
			}
		}
	});

	// --- Selection handlers ---
	function selectionYear(year: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('championship', year);
		goto(url.toString(), { noScroll: true, keepFocus: true, replaceState: true, invalidateAll: true });
	}
	function selectionEvent(event: string) {
		const url = new URL(window.location.href);
		url.searchParams.set('event', event);
		goto(url.toString(), { noScroll: true, keepFocus: true, replaceState: true, invalidateAll: true });
	}
	function selectionCategory(category: string) {
		const url = new URL(window.location.href);
		selectedCategory = category as EventCategory;

		// enforce leaderboard validity when changing category
		if (!leaderboardMap[selectedCategory]?.includes(selectedLeaderboard as EventLeaderboard)) {
			selectedLeaderboard = (leaderboardMap[selectedCategory] ?? [])[0] ?? EventLeaderboard.Stage1;
			url.searchParams.set('leaderboard', selectedLeaderboard);
		}

		url.searchParams.set('category', selectedCategory);
		updateSheet(selectedCategory, selectedLeaderboard);
		goto(url.toString(), { noScroll: true, keepFocus: true, replaceState: true, invalidateAll: true });
	}
	function selectionLeaderboard(leaderboard: string) {
		const url = new URL(window.location.href);
		selectedLeaderboard = leaderboard as EventLeaderboard;

		url.searchParams.set('leaderboard', selectedLeaderboard);
		updateSheet(selectedCategory, selectedLeaderboard);
		goto(url.toString(), { noScroll: true, keepFocus: true, replaceState: true, invalidateAll: true });
	}

	// ElementSelection helper
	function transformToElementList(championshipList: ChampionshipNonExpand[]) {
		const liveChampionshipIds = championshipsIdsWithOnAirEvents ?? [];
		const elementsList = championshipList.map((v) => ({
			value: v.name,
			current: v.name === selectedChampionship,
			disabled: false,
			icon: liveChampionshipIds.includes(v.id)
				? LucideRadio
				: new Date(v.endDate) > new Date()
					? null
					: LucideCalendarCheck,
			iconProps: liveChampionshipIds.includes(v.id) ? { color: '#e7000b' } : {}
		}));
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

	// Push computed defaults to URL on initial load so refresh preserves the selection.
	// Uses window.history directly because replaceState() from $app/navigation requires
	// the router to be initialized, which isn't guaranteed during onMount/hydration.
	onMount(() => {
		const url = new URL(window.location.href);
		
		// force url to track selected championship, event, category and leaderboard.
		url.searchParams.set('championship', selectedChampionship);
		url.searchParams.set('event', selectedEvent);
		url.searchParams.set('category', selectedCategory);
		url.searchParams.set('leaderboard', selectedLeaderboard);
		
		window.history.replaceState(history.state, '', url.toString());
		console.log('Initial URL set to:', url.toString());
	});

	console.log('Loading championships:\n > data = ', data);
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
					class="hover:underline {event.shortName === selectedEvent ? 'text-red-600' : ''}"
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
				<div class="flex flex-row items-center gap-2">
					<h1 class="text-3xl font-bold">Classifica Live:</h1>
					<ContextualHelp contextualHelp={contextualHelps.leaderboards_liveLeaderboardSelection} />
				</div>
				<div class="flex flex-row items-center justify-center gap-4">
					<select
						value={selectedCategory}
						onchange={(e) => selectionCategory(e.currentTarget.value as EventCategory)}
						class="rounded-xl bg-neutral-100 px-1.5 py-0.5"
					>
						{#each categories as category}
							<option value={category}>{category}</option>
						{/each}
					</select>
					<select
						value={selectedLeaderboard}
						onchange={(e) => selectionLeaderboard(e.currentTarget.value as EventLeaderboard)}
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
		{:else if (foundEventDerived?.endDate ?? foundEventDerived?.startDate) ? new Date(foundEventDerived?.endDate ?? foundEventDerived?.startDate ?? '').valueOf() > new Date().valueOf() : true}
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
								<div class="my-2 flex flex-row justify-center lg:my-0 lg:mt-4 gap-4">
									{#if foundEventDerived?.subscriptionsOpen && (foundEventDerived.maxSubscriptions === 0 || foundEventDerived.numSubscriptions < (foundEventDerived.maxSubscriptions ?? 0)) && (!foundEventDerived.startDate || new Date(foundEventDerived.startDate).valueOf() >= new Date().valueOf())}
										<a
											href={`/enroll?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${foundEventDerived.shortName}`).toString()}`}
											class="btn btn-error text-foreground max-w-5/12 text-xs md:text-lg"
										>
											<UserRoundPlus /> Iscriviti
										</a>
									{:else}
										<button
											class="btn btn-disabled flex-nowrap text-xs text-nowrap text-gray-600 md:text-lg"
										>
											Iscriviti
										</button>
									{/if}
									<a
										href={`/events?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${foundEventDerived?.shortName}`).toString()}`}
										class="btn btn-neutral text-foreground max-w-5/12 text-xs md:text-lg">
										<Info /> Info
									</a>
								</div>
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
						{#if stageAndEventResultsDerived && stageAndEventResultsDerived.length > 0}
							{#each stageAndEventResultsDerived as result}
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
											<span class="xs:text-sm line-clamp-2 text-xs underline"
												>{result.data.name}</span
											>
										</a>
									</div>
								</div>
							{/each}
						{/if}
						{#if stageAndEventResultsDerived && stageAndEventResultsDerived.length > 0 && championshipResultsDerived && championshipResultsDerived.length > 0}
							<hr class="my-2" />
						{/if}
						{#if championshipResultsDerived && championshipResultsDerived.length > 0}
							{#each championshipResultsDerived as result}
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
											<span class="xs:text-sm line-clamp-2 text-xs underline"
												>{result.data.name}</span
											>
										</a>
									</div>
								</div>
							{/each}
						{/if}
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
						This feature is temporarily disabled. The system should be reinstated by requesting championship results information from the databuase.
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
