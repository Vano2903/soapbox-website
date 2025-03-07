<script lang="ts">
	import { ResultStatusType, StageKindType } from '$tsTypes/championships/utils';
	import type { ChampionshipLeaderboardType } from '$tsTypes/championships/championshipLeaderboard';
	import type { EventLeaderboardType } from '$tsTypes/championships/eventLeaderboard';
	import type { LiveLeaderboardsType } from '$tsTypes/championships/liveLeaderboards';

	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock } from 'lucide-svelte';

	import { goto } from '$app/navigation';

	// Page informations
	const { data } = $props();
	const {
		liveLeaderboards,
		championshipLeaderboard,
		eventLeaderboard
	}: {
		liveLeaderboards: LiveLeaderboardsType;
		championshipLeaderboard: ChampionshipLeaderboardType;
		eventLeaderboard: EventLeaderboardType;
	} = data;

	console.log('liveLeaderboards', liveLeaderboards);
	console.log('championshipLeaderboard', championshipLeaderboard);
	console.log('eventLeaderboard', eventLeaderboard);

	const years = [
		{ value: '2020', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2021', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2022', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2023', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: '2024', current: true, disabled: false, icon: LucideRadio },
		{ value: '2025', current: false, disabled: true, icon: LucideLock },
		{ value: '2026', current: false, disabled: true, icon: LucideLock },
		{ value: '2027', current: false, disabled: true, icon: LucideLock }
	];
	const offset = 3;

	function yearSelectionClick(year: string) {
		console.log('year click:', year);

		goto(`?year=${year}`);
		console.log('should go to year', year);
	}
	function rallySelectionClick(rally: string) {
		event_selected = rally;
		console.log('rally click:', rally);

		goto(`?rally=${rally}`, { noScroll: true });
		console.log('should go to rally', rally);
	}

	let championship_defaultNumberRowsToShow = 10;
	let championship_NumberRowsShowed = $state(championship_defaultNumberRowsToShow);
	let championship_ShowButtonSeeAll = $state(
		championshipLeaderboard.rows.length > championship_defaultNumberRowsToShow
	);

	let event_selected = $state('Bergamo');
	let event_defaultNumberRowsToShow = 10;
	let event_NumberRowsShowed = $state(event_defaultNumberRowsToShow);
	let event_ShowButtonSeeAll = $state(eventLeaderboard.rows.length > event_defaultNumberRowsToShow);
</script>

<main class="px-20 pb-16">
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
		{#if liveLeaderboards != null}
			<!--
			<section class="flex flex-col items-center">
				<h1>CLASSIFICA RALLY LIVE</h1>
			</section>
			-->
		{/if}
		{#if championshipLeaderboard != null}
			<section class="mx-auto p-4">
				<hr class="h-1.5 w-full bg-red-600" />
				<div class="mx-auto flex max-w-2/3 justify-center p-5 text-4xl font-bold">
					CLASSIFICA CAMPIONATO:
				</div>
				<div class="overflow-x-auto">
					<table class="w-full min-w-max border-collapse">
						<caption class="caption-bottom py-2 text-sm font-light text-neutral-400">
							<div class="flex max-w-2xl flex-row justify-evenly">
								<span>'DNS': Non Partito</span>
								<span>'DNF': Non Arrivato</span>
								<span>'/': Non Classificato</span>
							</div>
						</caption>
						<thead>
							<tr class="bg-neutral-400 text-4xl font-extrabold">
								<td class="p-3" colspan={4 + championshipLeaderboard.headers.length}>
									CAMPIONATO {championshipLeaderboard.year}:
								</td>
							</tr>
						</thead>
						<tbody>
							<tr class="border-b border-dashed border-neutral-700 bg-neutral-300 text-neutral-700">
								<th class="min-w-10 p-2 text-xl">
									<span class="xl:hidden"> Pos.: </span>
									<span class="hidden xl:block"> Posizione: </span>
								</th>
								<th class="min-w-10 p-2 pr-3 text-right text-xl">
									<span class="xl:hidden"> #: </span>
									<span class="hidden xl:block"> Numero di Gara: </span>
								</th>
								<th class="min-w-30 p-2 text-left text-xl">
									<span class="xl:hidden"> Nome: </span>
									<span class="hidden xl:block"> Nome del Team: </span>
								</th>
								{#each championshipLeaderboard.headers as header, index}
									<th
										class="min-w-30 p-2 {index === championshipLeaderboard.headers.length - 1
											? 'noborder'
											: ''}"
									>
										<span class="text-xl">{header.eventTitle}</span>
										<br />
										<span class="font-medium">{header.eventSubtitle}</span>
									</th>
								{/each}
								<th class="min-w-10 p-2 text-right text-xl">
									<span class="xl:hidden"> Pts.: </span>
									<span class="hidden xl:block"> Punteggio: </span>
								</th>
							</tr>
							{#each championshipLeaderboard.rows.slice(0, championship_NumberRowsShowed) as row, index}
								<tr class="{index % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-100'} text-lg">
									<td class="min-w-10 p-1 text-center positionColor-{row.position}"
										>{row.position}°</td
									>
									<td class="min-w-10 p-1 pr-3 text-right">{row.teamNumber}</td>
									<td class="min-w-30 p-1">{row.teamName}</td>
									{#each row.results as result}
										{#if result.performed === false}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">/</span>
											</td>
										{:else if result.status !== ResultStatusType.CLASSIFIED}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">
													{result.status}
												</span>
											</td>
										{:else}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">
													<span>
														{result.points}
													</span>
													&nbsp;
													<span
														class="font-ligth text-xs positionColor-{result.position} rounded-full"
													>
														&nbsp;({result.position}°)&nbsp;
													</span>
												</span>
											</td>
										{/if}
									{/each}
									{#each { length: championshipLeaderboard.headers.length - row.results.length }}
										<td class="min-w-30 p-1">
											<span class="flex justify-center"></span>
										</td>
									{/each}
									<td class="min-w-10 p-1 text-right font-medium">{row.totalPoints}</td>
								</tr>
							{/each}
							<tr class="border-t border-dashed border-neutral-700 bg-neutral-200">
								{#if championship_ShowButtonSeeAll}
									<td
										class="min-w-10 px-2"
										colspan={4 + championshipLeaderboard.headers.length}
										onclick={() => {
											championship_NumberRowsShowed = championshipLeaderboard.rows.length;
											championship_ShowButtonSeeAll = false;
										}}
									>
										<p class="flex justify-center text-xl">• Visualizza Tutti •</p>
									</td>
								{:else if championshipLeaderboard.rows.length > championship_defaultNumberRowsToShow}
									<td
										class="min-w-10 px-2"
										colspan={4 + championshipLeaderboard.headers.length}
										onclick={() => {
											championship_NumberRowsShowed = championship_defaultNumberRowsToShow;
											championship_ShowButtonSeeAll =
												championshipLeaderboard.rows.length > championship_defaultNumberRowsToShow;
										}}
									>
										<p class="flex justify-center text-xl">• Mostra meno •</p>
									</td>
								{/if}
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		{/if}
		{#if eventLeaderboard != null}
			<section class="mx-auto p-4">
				<hr class="h-1.5 w-full bg-red-600" />
				<div class="mx-auto mb-4 flex max-w-2/3 justify-center pt-5 text-4xl font-bold">
					CLASSIFICA RALLIES:
				</div>
				<div
					class=" mx-auto flex max-w-5/6 items-center justify-evenly space-x-6 overflow-x-auto pb-5 text-xl font-bold text-neutral-600"
				>
					{#each championshipLeaderboard.headers as header}
						{#if header.eventTitle == event_selected}
							<span class=" text-nowrap text-red-600 hover:underline"
								>{header.eventTitle.toUpperCase()}</span
							>
						{:else}
							<button
								class="text-nowrap hover:underline"
								onclick={() => rallySelectionClick(header.eventTitle)}
							>
								{header.eventTitle.toUpperCase()}
							</button>
						{/if}
					{/each}
				</div>
				<div class="overflow-x-auto">
					<table class="w-full min-w-max border-collapse">
						<caption class="caption-bottom py-2 text-sm font-light text-neutral-400">
							<div class="flex max-w-2xl flex-row justify-evenly">
								<span>'DNS': Non Partito</span>
								<span>'DNF': Non Arrivato</span>
								<span>'/': Non Classificato</span>
							</div>
						</caption>
						<thead>
							<tr class="bg-neutral-400 text-4xl font-extrabold">
								<td class="p-3" colspan={4 + eventLeaderboard.headers.length}>
									Rally di {eventLeaderboard.event}:
								</td>
							</tr>
						</thead>
						<tbody>
							<tr class="border-b border-dashed border-neutral-700 bg-neutral-300 text-neutral-700">
								<th class="min-w-10 p-2 text-xl">
									<span class="xl:hidden"> Pos.: </span>
									<span class="hidden xl:block"> Posizione: </span>
								</th>
								<th class="min-w-10 p-2 pr-3 text-right text-xl">
									<span class="xl:hidden"> #: </span>
									<span class="hidden xl:block"> Numero di Gara: </span>
								</th>
								<th class="min-w-30 p-2 text-left text-xl">
									<span class="xl:hidden"> Nome: </span>
									<span class="hidden xl:block"> Nome del Team: </span>
								</th>
								{#each eventLeaderboard.headers as header, index}
									<th
										class="min-w-30 p-2 {index === eventLeaderboard.headers.length - 1
											? 'noborder'
											: ''}"
									>
										<span class="text-xl">{header.stageTitle}</span>
										<br />
										<span class="font-medium">{header.stageSubtitle}</span>
									</th>
								{/each}
								<th class="min-w-10 p-2 text-right text-xl">
									<span class="xl:hidden"> Pts.: </span>
									<span class="hidden xl:block"> Punteggio: </span>
								</th>
							</tr>
							{#each eventLeaderboard.rows.slice(0, event_NumberRowsShowed) as row, index}
								<tr class="{index % 2 === 0 ? 'bg-neutral-50' : 'bg-neutral-100'} text-lg">
									<td class="min-w-10 p-1 text-center positionColor-{row.position}"
										>{row.position}°</td
									>
									<td class="min-w-10 p-1 pr-3 text-right">{row.teamNumber}</td>
									<td class="min-w-30 p-1">{row.teamName}</td>
									{#each row.results as result}
										{#if result.performed === false}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">/</span>
											</td>
										{:else if result.status !== ResultStatusType.CLASSIFIED}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">
													{result.status}
												</span>
											</td>
										{:else if result.kind === StageKindType.SHOWDOWN && result.showdown !== null}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">
													<span>
														{result.showdown.points}
													</span>
													&nbsp;
													<span
														class="font-ligth text-xs positionColor-{result.showdown
															.position} rounded-full"
													>
														&nbsp;({result.showdown.position}°)&nbsp;
													</span>
												</span>
											</td>
										{:else if result.kind !== StageKindType.SHOWDOWN && result.stage !== null}
											<td class="min-w-30 p-1">
												<span class="flex justify-center">
													<span>
														{result.stage.finalTime}
													</span>
													&nbsp;
													<span
														class="font-ligth text-xs positionColor-{result.stage
															.position} rounded-full"
													>
														&nbsp;({result.stage.position}°)&nbsp;
													</span>
												</span>
											</td>
										{/if}
									{/each}
									{#each { length: eventLeaderboard.headers.length - row.results.length }}
										<td class="min-w-30 p-1">
											<span class="flex justify-center"></span>
										</td>
									{/each}
									<td class="min-w-10 p-1 text-right font-medium">{row.totalPoints}</td>
								</tr>
							{/each}
							<tr class="border-t border-dashed border-neutral-700 bg-neutral-200">
								{#if event_ShowButtonSeeAll}
									<td
										class="min-w-10 px-2"
										colspan={4 + eventLeaderboard.headers.length}
										onclick={() => {
											event_NumberRowsShowed = eventLeaderboard.rows.length;
											event_ShowButtonSeeAll = false;
										}}
									>
										<p class="flex justify-center text-xl">• Visualizza Tutti •</p>
									</td>
								{:else if eventLeaderboard.rows.length > event_defaultNumberRowsToShow}
									<td
										class="min-w-10 px-2"
										colspan={4 + eventLeaderboard.headers.length}
										onclick={() => {
											event_NumberRowsShowed = event_defaultNumberRowsToShow;
											event_ShowButtonSeeAll =
												eventLeaderboard.rows.length > event_defaultNumberRowsToShow;
										}}
									>
										<p class="flex justify-center text-xl">• Mostra meno •</p>
									</td>
								{/if}
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		{/if}
	</div>
</main>

<style>
	.positionColor-1 {
		background-color: var(--color-yellow-400);
	}
	.positionColor-2 {
		background-color: var(--color-slate-300);
	}
	.positionColor-3 {
		background-color: var(--color-amber-600);
	}
</style>
