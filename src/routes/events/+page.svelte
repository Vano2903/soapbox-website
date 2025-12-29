<script lang="ts">
	import type { ChampionshipNonExpand } from '$types/pocketbase/championship.js';
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { CalendarDays, MapPin, LucideRadio, UserRoundCheck, UserRoundPlus } from 'lucide-svelte';
	import { goto } from '$app/navigation';
	import EventInfoBox from '$components/eventInfoBox/eventInfoBox.svelte';
	import type { EventNonExpand } from '$types/pocketbase/event';
	import { LeaderboardType } from '$types/pocketbase/results';
	import { onMount } from 'svelte';
	import { CategoryKind } from '$types/pocketbase/eventParticipation.js';

	// destructures the data received from the PageLoad and prepares it to be derived (reactive to changes in value)
	const { data } = $props();
	const championshipsListDerived = $derived(data.championshipsList);
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const foundEventDerived = $derived(data.foundEvent);
	const eventParticipationsDerived = $derived(data.eventParticipations);

	// split results by metadata
	const stageAndEventResultsDerived = $derived(
		foundEventDerived.expand.results?.filter((result) => {
			return (
				result.leaderboardType == LeaderboardType.Stage ||
				result.leaderboardType == LeaderboardType.Event
			);
		})
	);
	const championshipResultsDerived = $derived(
		foundEventDerived.expand.results?.filter((result) => {
			return result.leaderboardType == LeaderboardType.Championship;
		})
	);

	// console.log(foundEventDerived?.endDate);
	// console.log(foundEventDerived?.startDate);
	// console.log(
	// 	new Date(foundEventDerived?.endDate ?? foundEventDerived?.startDate ?? new Date()).valueOf()
	// );
	// console.log(new Date().valueOf());
	// console.log(
	// 	new Date(foundEventDerived?.endDate ?? foundEventDerived?.startDate ?? new Date()).valueOf() >=
	// 		new Date().valueOf()
	// );

	// console.log('FOUND CHAMPIONSHIP = ', foundChampionshipDerived);
	// console.log('FOUND EVENT = ', foundEventDerived);
	// console.log('FOUND EVENT.EXPAND = ', foundEventDerived?.expand);
	// console.log('EVENTS[5] = ', foundChampionshipDerived.expand.events[5]);
	// console.log(
	// 	'TEST (EVENT == EVENTS[5]) = ',
	// 	foundEventDerived == foundChampionshipDerived.expand.events[5]
	// );
	// console.log(
	// 	'TEST (EVENT.Id == EVENTS[5].Id) = ',
	// 	foundEventDerived?.id == foundChampionshipDerived.expand.events[5]?.id
	// );
</script>

<main class="px-5 pb-16 lg:px-15">
	<!-- <header class="flex flex-col items-center space-y-2 pt-14 pb-10 text-center">
		<span class="text-3xl font-bold"> {foundEventDerived?.shortName} </span>
		<span class="text-5xl font-bold"> {foundEventDerived?.name} </span>
		<p class="max-w-4/5 text-base text-gray-500">
			{foundChampionshipDerived.name}
		</p>
	</header> -->

	<div class="space-y-8 pt-14">
		<div class="flex flex-col items-center justify-center gap-2">
			<section class="w-8/10 md:max-w-6/10 2xl:max-w-5/10">
				<div class="relative w-full">
					<img
						src={foundEventDerived?.cover == ''
							? 'images/calendars/eventCover.png'
							: (foundEventDerived?.cover ?? 'images/calendars/eventCover.png')}
						alt="event cover"
						class="ratio-16/9 h-full max-h-70 w-full rounded-md object-cover"
					/>
					<div
						class="absolute top-1/2 left-1/2 flex h-17.5 w-17.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white md:h-22 md:w-22"
					>
						<div
							class="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-3 border-red-600 bg-white text-3xl font-bold md:h-20 md:w-20 md:text-5xl"
						>
							{foundChampionshipDerived.events.indexOf(foundEventDerived!.id) + 1}
						</div>
					</div>
				</div>
			</section>
			<section class="text-center">
				<h2 class="text-xl lg:text-3xl">— {foundEventDerived?.shortName} —</h2>
				<h1 class="text-3xl font-bold lg:text-5xl">{foundEventDerived?.name}</h1>
				<h3 class="text-base text-gray-600 lg:text-xl">
					Campionato {foundChampionshipDerived.name}
				</h3>
			</section>
			<hr class="mx-4 my-4 h-1 w-4/10 rounded-sm border-0 bg-red-600" />
			<section>
				<div class="mb-2 flex flex-col items-center justify-center md:flex-row md:gap-6">
					<p class="flex flex-row items-center gap-2 text-lg text-gray-700 md:text-xl">
						<CalendarDays class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
						Dal:
						{#if foundEventDerived?.startDate}
							<span>
								{new Date(foundEventDerived?.startDate).toLocaleDateString()}
							</span>
							<span>
								{(new Date(foundEventDerived?.startDate).getHours() < 10
									? '0' + new Date(foundEventDerived?.startDate).getHours()
									: new Date(foundEventDerived?.startDate).getHours()) +
									':' +
									(new Date(foundEventDerived?.startDate).getMinutes() < 10
										? '0' + new Date(foundEventDerived?.startDate).getMinutes()
										: new Date(foundEventDerived?.startDate).getMinutes())}
							</span>
						{:else}
							<span>Da definirsi</span>
						{/if}
					</p>
					<p class="flex flex-row items-center gap-2 text-lg text-gray-700 md:text-xl">
						<CalendarDays class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
						Al:
						{#if foundEventDerived?.endDate}
							<span>
								{new Date(foundEventDerived?.endDate).toLocaleDateString()}
							</span>
							<span>
								{(new Date(foundEventDerived?.endDate).getHours() < 10
									? '0' + new Date(foundEventDerived?.endDate).getHours()
									: new Date(foundEventDerived?.endDate).getHours()) +
									':' +
									(new Date(foundEventDerived?.endDate).getMinutes() < 10
										? '0' + new Date(foundEventDerived?.endDate).getMinutes()
										: new Date(foundEventDerived?.endDate).getMinutes())}
							</span>
						{:else}
							<span>Da definirsi</span>
						{/if}
					</p>
				</div>
				<div class="flex flex-col items-center justify-center gap-6 md:flex-row">
					<p class="flex flex-row items-center gap-2 text-lg text-gray-700 md:text-xl">
						<MapPin class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
						{#if foundEventDerived?.expand.location}
							<span>
								{foundEventDerived?.expand.location.city}, {foundEventDerived?.expand.location
									.province}
							</span>
						{:else}
							<span>Da definirsi</span>
						{/if}
					</p>
				</div>
			</section>
			<section
				class="my-2 mb-4 flex flex-row items-center gap-2 rounded-lg bg-neutral-100 p-2 shadow-md"
			>
				<div class="flex flex-row items-center justify-center gap-2">
					<UserRoundCheck class=" h-6 w-6 text-red-600" />
					<div class="flex flex-col items-start gap-2 text-gray-700 md:flex-row md:text-lg">
						<p>
							{eventParticipationsDerived?.length} Iscritti
						</p>
						{#if eventParticipationsDerived?.length > 0}
							<p class="text-gray-500 italic">
								({eventParticipationsDerived.filter((p) => p.category == CategoryKind.SoapBox)
									.length}
								SoapBox,
								{eventParticipationsDerived.filter((p) => p.category == CategoryKind.DriftTrike)
									.length} Drift-Trike)
							</p>
						{/if}
					</div>
				</div>
				<a
					class="btn btn-error aspect-square"
					href="/enroll?championship={foundChampionshipDerived?.name}&event={foundEventDerived?.shortName}"
				>
					<UserRoundPlus class="h-4 w-4 text-white md:h-6 md:w-6" />
				</a>
			</section>
			<hr class="mx-2 h-0.5 w-3/10 rounded-sm border-0 bg-neutral-400" />
			<h3 class="mt-4 text-2xl font-bold">Programmazione dell'Evento:</h3>
			<section class="flex flex-col items-center justify-center gap-4 md:flex-row">
				<div class="box-border flex flex-col gap-2 rounded-xl bg-neutral-50 p-2">
					{#each foundEventDerived?.expand?.stages as stage}
						<div class="rounded-md rounded-r-lg bg-red-600 shadow-md">
							<div class="ml-1 rounded-r-md bg-neutral-100 pl-1">
								<div class="mr-4">
									<span class="text-sm font-bold sm:text-base lg:text-xl"
										>{stage.name.split(' - ').at(-1)}:&nbsp;</span
									>
									<span class="text-xs sm:text-sm lg:text-lg">{stage.description}</span>
								</div>
								<div class="mr-4">
									<p class="flex flex-row items-center gap-2">
										{#if stage.startTime}
											<span>
												<span class="text-xs text-gray-700 sm:text-sm lg:text-lg">
													{new Date(stage.startTime).toLocaleDateString()}
												</span>
												|
												<span class="text-xs text-gray-700 sm:text-sm lg:text-lg">
													{(new Date(stage.startTime).getHours() < 10
														? '0' + new Date(stage.startTime).getHours()
														: new Date(stage.startTime).getHours()) +
														':' +
														(new Date(stage.startTime).getMinutes() < 10
															? '0' + new Date(stage.startTime).getMinutes()
															: new Date(stage.startTime).getMinutes())}
												</span>
											</span>
										{:else}
											<span>Da definirsi</span>
										{/if}
										{#if stage.onAir}
											<LucideRadio class="h-4 w-4 sm:h-6 sm:w-6" color="#e7000b" />
											<a
												class="font-medium text-red-600"
												href={`/leaderboards?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${foundEventDerived.shortName}`).toString()}`}
											>
												Classifica Live
											</a>
										{/if}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<!-- <div class="box-border rounded-xl bg-neutral-100 p-2">
					{#if foundEventDerived?.poster}
						<a
							target="_blank"
							href={foundEventDerived?.poster}
							class="btn btn-error text-foreground min-h-15 max-w-5/12 flex-nowrap text-xs md:text-lg"
						>
							Visualizza<br />Locandina
						</a>
					{:else}
						<button
							class="btn btn-disabled min-h-15 flex-nowrap text-xs text-nowrap text-gray-600 md:text-lg"
						>
							Visualizza<br />Locandina
						</button>
					{/if}
				</div> -->
			</section>
		</div>
	</div>
</main>

<style>
	button,
	a {
		cursor: pointer;
		text-decoration: underline;
	}

	/* .inner {
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
	} */
</style>
