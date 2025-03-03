<script lang="ts">
	import { ResultStatusType } from '$tsTypes/championships/utils';
	import type {
		ChampionshipHeaderType,
		ChampionshipLeaderboardType
	} from '$tsTypes/championships/championshipLeaderboard';
	import type { EventLeaderboardType } from '$tsTypes/championships/eventLeaderboard';
	import type { LiveLeaderboardsType } from '$tsTypes/championships/liveLeaderboards';
	import type { PageProps } from './$types';

	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock } from 'lucide-svelte';

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
	const rallies = [
		{ value: 'Leffe', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: 'Bergamo', current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: "Villa d'Adda", current: false, disabled: false, icon: LucideCalendarCheck },
		{ value: 'Peia', current: true, disabled: false, icon: LucideRadio }
	];
	const offset = 3;

	function yearSelectionClick(year: string) {
		console.log('year click:', year);
		// TODO: request new / update data structures [liveLeaderboards, championshipLeaderboard, eventLeaderboard] for the year clicked.
	}
	function stageSelectionClick(stage: string) {
		console.log('stage click:', stage);
	}

	let showRowsNumber = $state(10);
	let showAllButton = $state(championshipLeaderboard.rows.length > 10);
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
		<!--
		<div class="flex flex-col items-center bg-red-600">
			<p>YEAR SELECTION</p>
		</div>
		-->

		{#if liveLeaderboards != null}
			<section class="flex flex-col items-center">
				<h1>CLASSIFICA RALLY LIVE</h1>
			</section>
		{/if}
		{#if championshipLeaderboard != null}
			<section class="flex flex-col items-center overflow-x-auto">
				<table class="border">
					<thead>
						<tr class="border text-3xl font-extrabold">
							<td class="px-2" colspan={3 + championshipLeaderboard.headers.length}>
								CAMPIONATO {championshipLeaderboard.year}:
							</td>
						</tr>
					</thead>
					<tbody>
						<tr class="border text-lg font-bold">
							<th class="min-w-10 px-2">
								<span class="md:hidden"> Pos. </span>
								<span class="hidden md:block"> Position </span>
							</th>
							<th class="min-w-10 px-2">
								<span class="md:hidden"> Number </span>
								<span class="hidden md:block"> Team Number </span>
							</th>
							<th class="min-w-80 px-2"> Team Name </th>
							{#each championshipLeaderboard.headers as header}
								<th class="min-w-30 px-2">
									{header.eventTitle}<br />{header.eventSubtitle}
								</th>
							{/each}
						</tr>
						{#each championshipLeaderboard.rows.slice(0, showRowsNumber) as row}
							<tr class="border">
								<td class="min-w-10 px-2 positionColor-{row.position}">{row.position}</td>
								<td class="min-w-10 px-2">{row.teamNumber}</td>
								<td class="min-w-80 px-2">{row.teamName}</td>
								{#each row.results as result}
									{#if result.performed === false}
										<td class="min-w-30 px-2"></td>
									{:else if result.status !== ResultStatusType.CLASSIFIED}
										<td class="min-w-30 px-2">
											<p class="flex justify-center">
												{result.status}
											</p>
										</td>
									{:else}
										<td class="min-w-30 px-2">
											<p class="flex justify-center">
												{result.points} ({result.position})
											</p>
										</td>
									{/if}
								{/each}
							</tr>
						{/each}
						<tr class="border" class:hidden={!showAllButton}>
							<td
								class="min-w-10 px-2"
								colspan={3 + championshipLeaderboard.headers.length}
								onclick={() => {
									showRowsNumber = championshipLeaderboard.rows.length;
									showAllButton = false;
								}}
							>
								<p class="flex justify-center">Visualizza Tutti</p>
							</td>
						</tr>
					</tbody>
				</table>
			</section>
		{/if}
		{#if eventLeaderboard != null}
			<section class="flex flex-col items-center">
				<div class="flex justify-center pb-20">
					<ElementSelection {offset} elements={rallies} handleSelection={stageSelectionClick} />
				</div>
				<h1>CLASSIFICA RALLIES</h1>
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
