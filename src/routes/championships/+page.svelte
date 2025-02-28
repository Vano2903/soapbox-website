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
	import { LucideOrigami, LucidePanelTop } from 'lucide-svelte';

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

	// console.log('liveLeaderboards', liveLeaderboards);
	// console.log('championshipLeaderboard', championshipLeaderboard);
	// console.log('eventLeaderboard', eventLeaderboard);

	const years = [
		{ value: '2020', current: false, disabled: false },
		{ value: '2021', current: false, disabled: false },
		{ value: '2022', current: false, disabled: false, icon: LucideOrigami },
		{ value: '2023', current: false, disabled: false, icon: LucideOrigami },
		{ value: '2024', current: true, disabled: false },
		{ value: '2025', current: false, disabled: true, icon: LucidePanelTop },
		{ value: '2026', current: false, disabled: true },
		{ value: '2027', current: false, disabled: true }
	];
	const stages = [
		{ value: 'Leffe', current: false, disabled: false },
		{ value: 'Bergamo', current: false, disabled: false },
		{ value: "Villa d'Adda", current: true, disabled: false, icon: LucideOrigami },
		{ value: 'Peia', current: false, disabled: false, icon: LucideOrigami }
	];
	const offset = 3;

	function yearSelectionClick(year: string) {
		console.log('year click:', year);
		// TODO: request new / update data structures [liveLeaderboards, championshipLeaderboard, eventLeaderboard] for the year clicked.
	}
	function stageSelectionClick(stage: string) {
		console.log('stage click:', stage);
	}
</script>

<main class="px-20 pb-16">
	<header class="flex flex-col items-center space-y-2 pt-14 pb-10">
		<span class="text-5xl font-bold"> Campionati </span>
		<p class="text-gray-500">Lorem ipsum dolor sit amet</p>
	</header>
	<div class="flex justify-center pb-20">
		<ElementSelection {offset} elements={years} handleClick={yearSelectionClick} />
	</div>
	<div class="space-y-16">
		<!--
		<div class="flex flex-col items-center bg-red-600">
			<p>YEAR SELECTION</p>
		</div>
		-->

		{#if liveLeaderboards != null}
			<section class="flex flex-col items-center">
				<h1>CLASSIFICA EVENTO LIVE</h1>
			</section>
		{/if}
		{#if championshipLeaderboard != null}
			<section class="flex flex-col items-center">
				<table class="border">
					<thead>
						<tr class="border text-3xl font-extrabold">
							<th class="px-2">
								CAMPIONATO {championshipLeaderboard.year}:
							</th>
						</tr>
					</thead>
					<tbody>
						<tr class="border text-lg font-bold">
							<th class="min-w-10 px-2"> Position </th>
							<th class="min-w-10 px-2"> Team Number </th>
							<th class="min-w-80 px-2"> Team Name </th>
							{#each championshipLeaderboard.headers as header}
								<th class="min-w-30 px-2">
									{header.eventTitle}<br />{header.eventSubtitle}
								</th>
							{/each}
						</tr>
						{#each championshipLeaderboard.rows as row}
							<tr class="border">
								<td class="min-w-10 px-2">{row.position}</td>
								<td class="min-w-10 px-2">{row.teamNumber}</td>
								<td class="min-w-80 px-2">{row.teamName}</td>
								{#each row.results as result}
									{#if result.performed === false}
										<td class="min-w-30 px-2"></td>
									{:else if result.status !== ResultStatusType.FINISHED}
										<td class="min-w-30 px-2">
											<p class="flex justify-center">
												{result.points} ({result.status.toString()})
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
					</tbody>
				</table>
			</section>
		{/if}
		{#if eventLeaderboard != null}
			<section class="flex flex-col items-center">
				<div class="flex justify-center pb-20">
					<ElementSelection {offset} elements={stages} handleClick={stageSelectionClick} />
				</div>
				<h1>CLASSIFICA STAGES</h1>
			</section>
		{/if}
	</div>
</main>
