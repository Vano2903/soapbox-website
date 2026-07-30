<script lang="ts">
	import type { ChampionshipNonExpand } from '$types/pocketbase/championship.js';
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock, UserRoundPlus, Info } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// constant that defines how many elements to show on each side of the current element of the ElementSelection component
	const championshipsListOffset: number = 3;

	// destructures the data received from the PageLoad and prepares it to be derived (reactive to changes in value)
	const { data } = $props();
	const championshipsListDerived = $derived(data.championshipsList);
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const championshipsEventsDerived = $derived(data.championshipEvents);
	const warningsDerived = $derived(data.warnings);

	// Functions to handle the selection of championship, causing a navigation to the new URL with hydration and updated props
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
	// function enrollRedirect(year: string, event: string) {
	// 	console.log(
	// 		new Date().toLocaleTimeString('it-IT', { hour12: false }),
	// 		'redirect to enroll selection = {' + year + ' | ' + event + '}'
	// 	);
	// 	const params = new URLSearchParams(`year=${year}&event=${event}`);
	// 	goto(`/enroll?${params.toString()}`);
	// }

	// Function to transform the championship list into a format suitable for ElementSelection (with extra empty boundaries for cool UI effects)
	function transformToElementList(championshipList: ChampionshipNonExpand[]) {
		let elementsList = championshipList.map((v) => {
			const isOngoing = v.ongoing;
			const isLive = championshipsEventsDerived.some((e) => e.onAir === true);

			return {
				value: v.name,
				current: v.name === foundChampionshipDerived.name,
				disabled: false,
				icon:
					isOngoing && isLive
						? LucideRadio
						: new Date(v.endDate) > new Date()
							? null
							: LucideCalendarCheck,
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

	function formatDate(date: Date | (Date | undefined), withTime: boolean = true) {
		if (!date) {
			return null;
		}
		if (!withTime) {
			return new Date(date).toLocaleDateString('it-IT', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});
		}
		return new Date(date).toLocaleDateString('it-IT', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		});
	}
</script>

<main class="px-5 pb-16 lg:px-15">
	<header class="flex flex-col items-center space-y-2 pt-14 pb-10 text-center">
		<span class="text-5xl font-bold"> Calendario </span>
		<p class="max-w-4/5 text-base text-gray-500">
			Ogni fantastica avventura necessita il suo tempo, e per questo ogni anno raccogliamo tutti gli
			eventi dei nostri campionati in un comodo calendario per farvi sapere quando venire a
			trovarci!
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

		<div class="my-4 flex flex-col items-center justify-center gap-4">
			{#each warningsDerived as warning}
				<span class="rounded-md bg-amber-100 p-5">{warning}</span>
			{/each}
		</div>
	</div>

	<div class="space-y-8">
		<section class="flex flex-wrap justify-center gap-4">
			{#if foundChampionshipDerived && championshipsEventsDerived.length > 0}
				{#each championshipsEventsDerived as event, index}
					<div
						class="event-card flex h-90 w-60 flex-col overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:scale-105 hover:bg-neutral-100 md:h-120 md:w-80"
					>
						<div class="relative h-1/3">
							<img
								src={event.cover ?? "/images/calendars/eventCover.png"}
								alt={event.name}
								class="h-full w-full object-cover"
							/>
							<div
								class="absolute top-1/2 left-1/2 flex h-17.5 w-17.5 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white md:h-22 md:w-22"
							>
								<div
									class="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-3 border-red-600 bg-white text-3xl font-bold md:h-20 md:w-20 md:text-5xl"
								>
									{index + 1}
								</div>
							</div>
						</div>
						<div class="relative z-10 flex flex-col content-between items-center p-1 text-center">
							<hr
								class="mx-auto mt-1.5 mb-2 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mb-4"
							/>
							<div>
								<div class="min-h-31 flex flex-col justify-around">
								<div>
									<p class="text-base text-gray-600 md:text-xl">— {event.shortName} —</p>
									<h3 class="text-xl font-bold md:px-5 md:text-3xl">{event.name}</h3>
								</div>
								<div class="text-sm text-gray-500 mt-4 md:text-base">
									{#if event.canceled}
										{#if event.startDate}
											<p class="line-through">{formatDate(event.startDate, false)}</p>
										{:else}
											<p>&nbsp</p>
										{/if}
										<p>Evento Cancellato</p>
									{:else}
										{#if event.startDate}
											<p>dal: {formatDate(event.startDate)}</p>
										{:else}
											<p>&nbsp</p>
										{/if}
										{#if event.endDate}
											<p>al: {formatDate(event.endDate)}</p>
										{:else}
											<p>&nbsp</p>
										{/if}
									{/if}
								</div>
								</div>
								<div class="mt-2 md:mt-8">
									{#if event.subscriptionsOpen && (event.maxSubscriptions === 0 || event.numSubscriptions < (event.maxSubscriptions || 0)) && (!event.startDate || new Date(event.startDate).valueOf() >= new Date().valueOf())}
										<a
											href={`/enroll?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${event.shortName}`).toString()}`}
											class="btn btn-error text-foreground max-w-5/12 text-xs md:text-lg"
										>
											<UserRoundPlus /> Iscriviti
										</a>
										<a
											href={`/events?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${event.shortName}`).toString()}`}
											class="btn btn-neutral text-foreground max-w-5/12 text-xs md:text-lg">
											<Info /> Info
										</a>
									{:else}
										<button
											class="btn btn-disabled flex-nowrap text-xs text-nowrap text-gray-600 md:text-lg"
										>
											Iscriviti
										</button>
										<a
											href={`/events?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${event.shortName}`).toString()}`}
											class="btn btn-neutral text-foreground max-w-5/12 text-xs md:text-lg">
											<Info /> Info
										</a>
									{/if}
									<p class="mt-2 text-xs text-gray-500 md:text-base">
										{#if event.subscriptionsOpen}
											{event.numSubscriptions}{(event.maxSubscriptions ?? 0) > 0
												? `/${event.maxSubscriptions}`
												: ''} iscrizioni
										{:else}
											Iscrizioni chiuse
										{/if}
									</p>
								</div>
							</div>
							<hr
								class="mx-auto mt-2 mb-1.5 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mt-4"
							/>
						</div>
						{#if event.canceled}
							<div class="event-card-overlay event-card-overlay--canceled" aria-hidden="true"></div>
						{/if}
					</div>
				{/each}
			{:else}
				<div
					class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 px-4 py-8 shadow-md lg:w-7/10"
				>
					<p class="text-center">Per questo campionato non sono ancora stati annunciati eventi.</p>
				</div>
			{/if}
		</section>
		<!--
		<section class="flex flex-col items-center gap-2">
			<h1 class="text-3xl font-bold">Eventi in calendario:</h1>
			<div class="flex w-full flex-row justify-evenly gap-4 md:w-8/10 md:gap-6">
				{#if foundChampionshipDerived && championshipsEventsDerived.length > 0}
					{#each championshipsEventsDerived as event, index}
						<div
							class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 p-2 shadow-md transition duration-300 hover:scale-105 hover:bg-neutral-200 md:flex-row lg:w-7/10 hover:lg:scale-110"
						>
							<div class="items-center text-center">
								<hr
									class="mx-auto mt-2 mb-8 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600"
								/>
								<span class="text-xl font-bold">{index + 1}:</span>
								<span class="text-lg font-semibold">{event.name}:</span>
								<hr
									class="mx-auto mt-2 mb-8 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600"
								/>
							</div>
						</div>
					{/each}
					{#each championshipsEventsDerived as event, index}
						<div
							class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 p-2 shadow-md transition duration-300 hover:scale-105 hover:bg-neutral-200 md:flex-row lg:w-7/10 hover:lg:scale-110"
						>
							<div class="inner fullbox items-center text-center">
								<hr
									class="mx-auto mt-2 mb-8 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600"
								/>
								<div class="flex flex-col">
									<span class="text-xl font-bold">{index + 1}</span><br />
									<span class="text-lg font-semibold">{event.name}</span>
								</div>
								<hr
									class="mx-auto mt-8 mb-2 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600"
								/>
							</div>
						</div>
					{/each}
				{:else}
					<div
						class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 px-4 py-8 shadow-md lg:w-7/10"
					>
						<p class="text-center">
							Per questo campionato non sono ancora stati annunciati eventi.
						</p>
					</div>
				{/if}
			</div>
		</section>
		-->
	</div>
</main>

<style>
	.event-card {
		position: relative;
	}

	.event-card-overlay {
		position: absolute;
		inset: 0;
		background-image: repeating-linear-gradient(
			135deg,
			rgba(120, 120, 120, 0.12) 0,
			rgba(120, 120, 120, 0.12) 10px,
			rgba(255, 255, 255, 0.08) 10px,
			rgba(255, 255, 255, 0.08) 22px
		);
		opacity: 0.7;
		pointer-events: none;
		z-index: 30;
	}

	button,
	a {
		cursor: pointer;
	}
</style>
