<script lang="ts">
	import { CategoryKind } from '$types/pocketbase/eventParticipation';
	import { Roles } from '$types/pocketbase/user';
	import { ToSurfaceInfoExpandArray } from '$types/surfaceUtils.js';
	import {
		CalendarDays,
		MapPin,
		UserRoundPlus,
		FileCheck,
		Map as MapBase,
		SquarePen,
		Route,
		Ruler,
		Mountain,
		TriangleRight,
		ChartSpline,
		Download,
		X,
		Radio,
		ChevronDown,
		Trophy
	} from '@lucide/svelte';
	import EntityCard2 from '$components/entityCard/entityCard2.svelte';
	import ContextualHelp from '$components/contextualHelp/contextualHelp.svelte';
	import { capitalizeFirstLetter } from '$lib/utils/generic';

	// destructures the data received from the PageLoad and prepares it to be derived (reactive to changes in value)
	const { data } = $props();
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const foundEventDerived = $derived(data.foundEvent);
	const eventParticipationsDerived = $derived(data.eventParticipations);
	const userDerived = $derived(data.user);
	const contextualHelps = $derived(data.contextualHelps);

	// --- Event participations modal management ---
	let activeModalTab = $state<CategoryKind>(CategoryKind.SoapBox);

	// --- News section ---
	let showAllNews = $state(false);
	const sortedNews = $derived(
		(foundEventDerived.expand?.news ?? [])
			.filter((n) => !n.hidden)
			.sort((a, b) => new Date(b.created).valueOf() - new Date(a.created).valueOf())
	);

	function downloadParticipantsList() {
		let contentTxt = `Evento: ${foundEventDerived.name} (${foundEventDerived.shortName})\n`;
		contentTxt += `Data evento: ${foundEventDerived?.startDate ? new Date(foundEventDerived?.startDate).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Non definita'}\n`;
		contentTxt += `Data download: ${new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}\n`;
		contentTxt += `Totale iscritti: ${eventParticipationsDerived?.length}\n\n`;
		contentTxt += '='.repeat(80) + '\n\n';

		// SoapBox category
		const soapboxParticipations = eventParticipationsDerived.filter(
			(p) => p.category == CategoryKind.SoapBox
		);
		contentTxt += `CATEGORIA SOAPBOX (${soapboxParticipations.length} Iscritti)\n`;
		contentTxt += '-'.repeat(80) + '\n';
		soapboxParticipations.forEach((participation, index) => {
			contentTxt += `${(index + 1).toString().padStart(2, '0')}. ${participation.expand.team.name}\n`;
			if (participation.expand.team.number != 0) {
				contentTxt += `    Numero: ${participation.expand.team.number}\n`;
			}
			if (
				participation.teamNameAlias != '' &&
				participation.teamNameAlias != participation.expand.team.name
			) {
				contentTxt += `    Alias: ${participation.teamNameAlias}\n`;
			}
			if (participation.participants && participation.participants.length > 0) {
				contentTxt += `    Partecipanti: ${participation.expand.participants.map((p) => `${capitalizeFirstLetter(p.name)} ${capitalizeFirstLetter(p.lastName)}`).join(', ')}\n`;
			}
			contentTxt += '\n';
		});

		contentTxt += '\n';

		// Drift-Trike category
		const driftTrikeParticipations = eventParticipationsDerived.filter(
			(p) => p.category == CategoryKind.DriftTrike
		);
		contentTxt += `CATEGORIA DRIFT-TRIKE (${driftTrikeParticipations.length} Iscritti)\n`;
		contentTxt += '-'.repeat(80) + '\n';
		driftTrikeParticipations.forEach((participation, index) => {
			contentTxt += `${(index + 1).toString().padStart(2, '0')}. ${participation.expand.team.name}\n`;
			if (participation.expand.team.number != 0) {
				contentTxt += `    Numero: ${participation.expand.team.number}\n`;
			}
			if (
				participation.teamNameAlias != '' &&
				participation.teamNameAlias != participation.expand.team.name
			) {
				contentTxt += `    Alias: ${participation.teamNameAlias}\n`;
			}
			if (participation.participants && participation.participants.length > 0) {
				contentTxt += `    Partecipanti: ${participation.expand.participants.map((p) => `${capitalizeFirstLetter(p.name)} ${capitalizeFirstLetter(p.lastName)}`).join(', ')}\n`;
			}
			contentTxt += '\n';
		});

		let contentCsv = '';
		// contentTxt += '\n' + '='.repeat(80) + '\n\n';

		// .csv format summary (for easier import in spreadsheet software)
		// contentTxt += ".CSV FORMAT SUMMARY (For spreadsheet import)\n";
		// contentTxt += '-'.repeat(80) + '\n';
		soapboxParticipations.forEach((participation) => {
			// const teamId = participation.expand.team.id;
			const teamNumber =
				participation.expand.team.number != 0 ? participation.expand.team.number : '';
			const teamAlias =
				participation.teamNameAlias && participation.teamNameAlias != participation.expand.team.name
					? participation.teamNameAlias
					: participation.expand.team.name;
			let drivers = participation.expand.participants
				? participation.expand.participants.map(
						(p) => `${capitalizeFirstLetter(p.lastName)} ${capitalizeFirstLetter(p.name)}`
					)
				: [];
			if (drivers.length > 4) {
				drivers[3] = drivers.slice(3).join(' ||| ');
				drivers = drivers.slice(0, 4);
			}
			// content += `${teamId};${teamNumber};${teamAlias};${drivers.join(';')}\n`;
			contentCsv += `${teamNumber};${teamAlias};${drivers.join(';')}\n`;
		});
		contentCsv += ';;;;;;\n';
		driftTrikeParticipations.forEach((participation) => {
			// const teamId = participation.expand.team.id;
			const teamNumber =
				participation.expand.team.number != 0 ? participation.expand.team.number : '';
			const teamAlias =
				participation.teamNameAlias && participation.teamNameAlias != participation.expand.team.name
					? participation.teamNameAlias
					: participation.expand.team.name;
			let drivers = participation.expand.participants
				? participation.expand.participants.map(
						(p) => `${capitalizeFirstLetter(p.lastName)} ${capitalizeFirstLetter(p.name)}`
					)
				: [];
			if (drivers.length > 4) {
				drivers[3] = drivers.slice(3).join(' ||| ');
				drivers = drivers.slice(0, 4);
			}
			// content += `${teamId};${teamNumber};${teamAlias};${drivers.join(';')}\n`;
			contentCsv += `${teamNumber};${teamAlias};${drivers.join(';')}\n`;
		});

		// Create download .txt
		const blobTxt = new Blob([contentTxt], { type: 'text/plain;charset=utf-8' });
		const urlTxt = URL.createObjectURL(blobTxt);
		const linkTxt = document.createElement('a');
		linkTxt.href = urlTxt;
		linkTxt.download = `Iscritti_${foundEventDerived.shortName.replaceAll(' ', '-')}_${new Date().toISOString().split('T')[0]}.txt`;
		document.body.appendChild(linkTxt);
		linkTxt.click();
		document.body.removeChild(linkTxt);
		URL.revokeObjectURL(urlTxt);

		// Create download .csv
		const blobCsv = new Blob([contentCsv], { type: 'text/csv;charset=utf-8' });
		const urlCsv = URL.createObjectURL(blobCsv);
		const linkCsv = document.createElement('a');
		linkCsv.href = urlCsv;
		linkCsv.download = `Iscritti_${foundEventDerived.shortName.replaceAll(' ', '-')}_${new Date().toISOString().split('T')[0]}.csv`;
		document.body.appendChild(linkCsv);
		linkCsv.click();
		document.body.removeChild(linkCsv);
		URL.revokeObjectURL(urlCsv);
	}

	// --- Interactive Map management ---
	const mapZoom = 16;
	const trackMapURL = $derived(
		`https://www.google.com/maps/d/embed?mid=1UhQ2GD9N4TgOZ-KBu2nn7ak-WqbYjuo&hl=it&ll=${foundEventDerived.expand.track?.coordinates?.lat},${foundEventDerived.expand.track?.coordinates?.lon}&z=${mapZoom}&noprof=1`
	);
	const hasInteractiveMap = $derived(
		!!(
			foundEventDerived.expand.track.coordinates &&
			!(
				foundEventDerived.expand.track.coordinates.lat == 0 &&
				foundEventDerived.expand.track.coordinates.lon == 0
			)
		)
	);
	let showInteractiveMap = $state(false);
	$effect(() => {
		showInteractiveMap = hasInteractiveMap;
	});

	function switchShowInteractiveMap() {
		if (showInteractiveMap) {
			// check if a event static map is available, if not keep the interactive map shown
			if (foundEventDerived.map && foundEventDerived.map != '') {
				showInteractiveMap = false;
			}
		} else {
			// check if track coordinates are available and valid, if not keep the static map shown
			if (
				foundEventDerived.expand.track.coordinates &&
				!(
					foundEventDerived.expand.track.coordinates.lat == 0 &&
					foundEventDerived.expand.track.coordinates.lon == 0
				)
			) {
				showInteractiveMap = true;
			}
		}
	}
</script>

<main class="pb-16">
	<div class="bg-base-100 min-h-screen">
		<div class="relative h-[30vh] overflow-hidden md:h-[40vh]">
			<img
				src={foundEventDerived?.cover == ''
					? 'images/calendars/eventCover.png'
					: (foundEventDerived?.cover ?? 'images/calendars/eventCover.png')}
				alt="event cover"
				class="h-full w-full object-cover"
			/>
			<div
				class="from-base-100 absolute inset-0 bg-linear-to-t to-transparent to-80% sm:to-60%"
			></div>
			<div class="absolute right-0 bottom-0 left-0 p-6 md:p-10">
				<div class="mx-auto max-w-7xl">
					<h1 class="text-4xl font-bold drop-shadow-2xl md:text-6xl">
						{foundEventDerived.name}
					</h1>
					<p class="mb-2 text-lg drop-shadow-lg md:text-xl">
						— {foundEventDerived.shortName} —
					</p>
					<div class="flex flex-wrap gap-4 drop-shadow">
						<div class="flex items-center gap-2">
							<MapPin class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
							<span class="text-gray-600">
								{#if foundEventDerived?.expand.location.name !== foundEventDerived?.expand.location.city}
									{foundEventDerived?.expand.location.name}, {foundEventDerived?.expand.location
										.city}
								{:else}
									{foundEventDerived?.expand.location.name}
								{/if}
								{#if foundEventDerived?.expand.location.provinceShort}
									({foundEventDerived?.expand.location.provinceShort})
								{/if}
							</span>
						</div>
						{#if !foundEventDerived.canceled}
							<div class="flex items-center gap-2">
								<CalendarDays class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
								{#if foundEventDerived?.startDate}
									<span class="text-gray-600"
										>Dal {new Date(foundEventDerived?.startDate ?? new Date()).toLocaleDateString(
											'it-IT',
											{ day: 'numeric', month: 'long', year: 'numeric' }
										)}</span
									>
								{:else}
									<span class="text-gray-600">Non Definito</span>
								{/if}
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="mx-auto mt-8 max-w-7xl px-4 pb-8 md:px-6">
			<div class="m-2 flex items-center gap-2">
				<h2 class="text-xl font-bold md:text-2xl">Informazioni evento:</h2>
				<ContextualHelp
					contextualHelp={contextualHelps.events_subscriptionInteraction}
					stopPropagation={true}
				/>
			</div>

			<div
				class="card bg-base-100 mb-4 cursor-pointer shadow-xl transition duration-300 hover:bg-neutral-100 hover:shadow-2xl active:scale-98"
				onclick={() =>
					(
						document.getElementById('subscribed-member-list_modal') as HTMLDialogElement
					)?.showModal()}
				onkeypress={(e) =>
					e.key === 'Enter' &&
					(
						document.getElementById('subscribed-member-list_modal') as HTMLDialogElement
					)?.showModal()}
				role="button"
				tabindex="0"
			>
				<div class="card-body pb-2">
					<div class="xs:justify-between flex flex-row items-center gap-4">
						<div class="flex flex-row items-center justify-between gap-4">
							<div
								class="xs:flex hidden min-w-24 flex-col items-center rounded-md border p-2 shadow-md"
							>
								<span class="text-primary text-lg font-bold md:text-4xl"
									>{foundEventDerived.numSubscriptions}</span
								>
								<span class="text-xs text-gray-600 md:text-sm">Iscritti</span>
							</div>
							<div>
								<h2 class="card-title text-lg md:text-2xl">Partecipanti</h2>
								<p class="text-xs text-gray-600 md:text-base">
									Clicca per vedere la lista di tutti i team iscritti
								</p>
							</div>
						</div>
						{#if foundEventDerived.subscriptionsOpen && (foundEventDerived.maxSubscriptions === 0 || foundEventDerived.numSubscriptions < (foundEventDerived.maxSubscriptions || 0)) && (!foundEventDerived.startDate || new Date(foundEventDerived.startDate).valueOf() >= new Date().valueOf())}
							<a
								href={`/enroll?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${foundEventDerived.shortName}`).toString()}`}
								class="btn btn-primary btn-md md:btn-lg"
								onclick={(e) => {
									e.stopPropagation();
								}}
							>
								<UserRoundPlus /> Iscriviti
							</a>
						{:else}
							<div class="flex flex-col items-center gap-2">
								<div class="cursor-not-allowed">
									<button
										class="btn btn-disabled btn-md md:btn-lg pointer-events-none"
										onclick={(e) => {
											e.stopPropagation();
										}}
									>
										<UserRoundPlus /> Iscriviti
									</button>
								</div>
								<span class="text-gray-600">Iscrizioni Chiuse</span>
							</div>
						{/if}
					</div>
				</div>

				<dialog id="subscribed-member-list_modal" class="modal modal-bottom sm:modal-middle">
					<div class="modal-box max-w-4xl">
						<div class="mb-4 flex items-start justify-between">
							<div class="flex-1">
								<h3 class="text-xl font-bold md:text-2xl">
									Iscritti all'evento<br class="block md:hidden" />
									{foundEventDerived.name}:
								</h3>
								<p class="text-base-content/70 mt-1 text-xs md:text-sm">
									Totale: {foundEventDerived.numSubscriptions} iscritt{foundEventDerived.numSubscriptions ===
									1
										? 'o'
										: 'i'}
								</p>
							</div>
							<div class="flex items-start gap-2">
								{#if userDerived && userDerived.roles && userDerived.roles.includes(Roles.Admin)}
									<button
										class="btn btn-square btn-ghost btn-md md:btn-lg"
										onclick={downloadParticipantsList}
										title="Scarica lista iscritti"
									>
										<Download class="h-4 w-4 md:h-6 md:w-6" />
									</button>
								{/if}
								<form method="dialog">
									<button class="btn btn-circle btn-md md:btn-lg" title="Chiudi">
										<X class="h-6 w-6 md:h-6 md:w-6" />
									</button>
								</form>
							</div>
						</div>

						<!-- Tabs -->
						<div role="tablist" class="tabs tabs-md md:tabs-lg tabs-lift flex justify-center p-1">
							<button
								role="tab"
								class="tab"
								class:tab-active={activeModalTab === CategoryKind.SoapBox}
								class:text-primary={activeModalTab === CategoryKind.SoapBox}
								onclick={() => (activeModalTab = CategoryKind.SoapBox)}
							>
								SoapBox
								<span class="badge badge-sm ml-2 bg-neutral-100"
									>{eventParticipationsDerived.filter((p) => p.category === CategoryKind.SoapBox)
										.length}</span
								>
							</button>
							<button
								role="tab"
								class="tab"
								class:tab-active={activeModalTab === CategoryKind.DriftTrike}
								class:text-primary={activeModalTab === CategoryKind.DriftTrike}
								onclick={() => (activeModalTab = CategoryKind.DriftTrike)}
							>
								Drift-Trike
								<span class="badge badge-sm ml-2 bg-neutral-100"
									>{eventParticipationsDerived.filter((p) => p.category === CategoryKind.DriftTrike)
										.length}</span
								>
							</button>
						</div>

						<!-- Tab Content -->
						<div class="max-h-96 space-y-2 overflow-y-auto pr-2">
							{#if activeModalTab === CategoryKind.SoapBox}
								{#each eventParticipationsDerived.filter((p) => p.category === CategoryKind.SoapBox) as eventParticipation}
									<EntityCard2
										title={eventParticipation.teamNameAlias &&
										eventParticipation.teamNameAlias != eventParticipation.expand.team.name
											? eventParticipation.teamNameAlias
											: eventParticipation.expand.team.name}
										slug={eventParticipation.expand.team.slug}
										link="/team/{eventParticipation.expand.team.slug}"
									>
										{#snippet backgroundSnippet()}
											{#if eventParticipation.expand.team.bannerCropped}
												<img
													src={eventParticipation.expand.team.bannerCropped}
													alt="Banner di {eventParticipation.expand.team.name}"
													class="h-full w-auto min-w-full object-cover object-left"
												/>
											{/if}
										{/snippet}
										{#snippet iconSnippet()}
											{#if eventParticipation.expand.team.number > 0}
												<span
													class="badge badge-xs border-primary flex w-5.5 justify-center rounded-none"
													>{eventParticipation.expand.team.number}</span
												>
											{/if}
										{/snippet}
										{#snippet picture()}
											<img
												src={eventParticipation.expand.team.logoCropped}
												alt="Logo di {eventParticipation.expand.team.name}"
												class="h-14 w-14 rounded-full object-cover"
											/>
										{/snippet}
									</EntityCard2>
									<!-- <div class="p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
										<div class="font-semibold text-lg">{eventParticipation.expand.team.name}</div>
										<div class="text-sm text-base-content/70">{eventParticipation.teamNameAlias}</div>
									</div> -->
								{:else}
									<div class="text-base-content/70 py-8 text-center">
										Nessun team iscritto in questa categoria
									</div>
								{/each}
							{:else if activeModalTab === CategoryKind.DriftTrike}
								{#each eventParticipationsDerived.filter((p) => p.category === CategoryKind.DriftTrike) as eventParticipation}
									<EntityCard2
										title={eventParticipation.teamNameAlias &&
										eventParticipation.teamNameAlias != eventParticipation.expand.team.name
											? eventParticipation.teamNameAlias
											: eventParticipation.expand.team.name}
										slug={eventParticipation.expand.team.slug}
										link="/team/{eventParticipation.expand.team.slug}"
									>
										{#snippet backgroundSnippet()}
											{#if eventParticipation.expand.team.bannerCropped}
												<img
													src={eventParticipation.expand.team.bannerCropped}
													alt="Banner di {eventParticipation.expand.team.name}"
													class="h-full w-auto min-w-full object-cover object-left"
												/>
											{/if}
										{/snippet}
										{#snippet iconSnippet()}
											{#if eventParticipation.expand.team.number > 0}
												<span
													class="badge badge-xs border-primary flex w-5.5 justify-center rounded-none"
													>{eventParticipation.expand.team.number}</span
												>
											{/if}
										{/snippet}
										{#snippet picture()}
											<img
												src={eventParticipation.expand.team.logoCropped}
												alt="Logo di {eventParticipation.expand.team.name}"
												class="h-14 w-14 rounded-full object-cover"
											/>
										{/snippet}
									</EntityCard2>
									<!-- <div class="p-4 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
										<div class="font-semibold text-lg">{eventParticipation.expand.team.name}</div>
										<div class="text-sm text-base-content/70">{eventParticipation.teamNameAlias}</div>
									</div> -->
								{:else}
									<div class="text-base-content/70 py-8 text-center">
										Nessun team iscritto in questa categoria
									</div>
								{/each}
							{/if}
						</div>
					</div>
				</dialog>
				<form method="dialog" class="modal-backdrop">
					<button>close</button>
				</form>
			</div>

			{#if foundEventDerived.onAir || (!foundEventDerived.onAir && foundEventDerived.results.length > 0)}
				<div class="card bg-base-100 mb-8 shadow-xl transition duration-300 active:scale-98">
					<div class="card-body pb-6">
						<div class="xs:justify-between flex flex-row items-center gap-2">
							<div class="flex flex-row items-center justify-between gap-4">
								<div
									class="xs:flex hidden min-w-24 flex-col items-center gap-1 rounded-md border border-red-500 p-2 shadow-md"
								>
									{#if foundEventDerived.onAir}
										<Radio class="h-6 w-6 animate-pulse text-red-600 md:h-8 md:w-8" />
										<span class="text-xs font-bold tracking-wider text-red-600 uppercase">Live</span
										>
									{:else}
										<Trophy class="h-6 w-6 animate-pulse text-red-600 md:h-8 md:w-8" />
										<span class="text-xs font-bold tracking-wider text-red-600 uppercase"
											>Ended</span
										>
									{/if}
								</div>
								<div>
									<h2 class="card-title text-lg md:text-2xl">Classifica</h2>
									<p class="text-xs text-gray-600 md:text-base">
										{#if foundEventDerived.onAir}
											L'evento è live, guarda la classifica in tempo reale
										{:else}
											L'evento è terminato, consulta la classifica finale
										{/if}
									</p>
								</div>
							</div>
							<a
								href={`/leaderboards?${new URLSearchParams(`championship=${foundChampionshipDerived.name}&event=${foundEventDerived.shortName}`).toString()}`}
								class="btn btn-primary btn-md md:btn-lg cursor-pointer"
							>
								<ChartSpline /> Classifica
							</a>
						</div>
					</div>
				</div>
			{/if}

			{#if sortedNews.length > 0}
				<div class="m-2 flex items-center gap-2">
					<h2 class="text-xl font-bold md:text-2xl">Aggiornamenti:</h2>
					<!-- <ContextualHelp contextualHelp={contextualHelps.events_eventNewsList} stopPropagation={true} /> -->
				</div>
				<div class="card bg-base-100 card-body news shadow-xl">
					<div class="my-2 pl-4 inset-shadow-[1px_0px_0px_rgba(0,0,0,0.1)]">
						<div class="mb-3 flex items-center gap-3">
							<span class="text-base-content/60 shrink-0 text-sm font-medium">
								{new Date(sortedNews[0].created).toLocaleDateString('it-IT', {
									day: 'numeric',
									month: 'long',
									year: 'numeric'
								})}
							</span>
							<div class="h-px flex-1 bg-gray-200"></div>
						</div>
						<div class="richtext max-w-none pl-2">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html sortedNews[0].info}
						</div>
					</div>
					{#if sortedNews.length > 1}
						<button
							class="btn btn-sm m-auto min-w-1/2 gap-2"
							onclick={() => (showAllNews = !showAllNews)}
						>
							<span
								class="inline-flex h-4 w-4 items-center justify-center transition-transform duration-200 ease-out"
								class:rotate-180={showAllNews}
							>
								<ChevronDown class="h-4 w-4" />
							</span>
							<span>
								{#if showAllNews}
									Nascondi aggiornamenti precedenti
								{:else}
									Vedi tutti gli aggiornamenti ({sortedNews.length - 1})
								{/if}
							</span>
						</button>
						{#if showAllNews}
							{#each sortedNews.slice(1) as newsItem}
								<div class="my-2 pl-4 inset-shadow-[1px_0px_0px_rgba(0,0,0,0.1)]">
									<div class="mb-3 flex items-center gap-3">
										<span class="text-base-content/60 shrink-0 text-sm font-medium">
											{new Date(newsItem.created).toLocaleDateString('it-IT', {
												day: 'numeric',
												month: 'long',
												year: 'numeric'
											})}
										</span>
										<div class="h-px flex-1 bg-gray-200"></div>
									</div>
									<div class="richtext max-w-none pl-2">
										<!-- eslint-disable-next-line svelte/no-at-html-tags -->
										{@html newsItem.info}
									</div>
								</div>
							{/each}
						{/if}
					{/if}
				</div>
			{/if}

			<hr class="my-8" />

			<div class="grid grid-cols-1 gap-8 lg:grid-cols-2">
				<div class="space-y-8">
					<!-- Schedule -->
					{#if foundEventDerived.expand.stages && foundEventDerived.expand.stages.length > 0 && !foundEventDerived.canceled}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title mb-4 text-2xl">Programma</h2>
								<div class="space-y-3">
									{#each foundEventDerived.expand.stages as stage}
										<div
											class="bg-base-200 hover:bg-base-300 flex gap-4 rounded-lg p-4 transition-colors"
										>
											<div class="text-primary min-w-15 text-lg font-bold">
												<div class="flex flex-col items-center justify-center">
													{#if stage.startTime}
														<span
															>{new Date(stage.startTime).getDate().toString().padStart(2, '0')}/{(
																new Date(stage.startTime).getMonth() + 1
															)
																.toString()
																.padStart(2, '0')}</span
														>
														<span
															>{new Date(stage.startTime)
																.getHours()
																.toString()
																.padStart(2, '0')}:{new Date(stage.startTime)
																.getMinutes()
																.toString()
																.padStart(2, '0')}</span
														>
													{:else}
														<span>Non</span>
														<span>definito</span>
													{/if}
												</div>
											</div>
											<div class="flex-1">
												<h3 class="mb-1 font-semibold">{stage.name}</h3>
												<p class="text-base-content/70 text-sm">{stage.description}</p>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
					<!-- Track Details -->
					{#if foundEventDerived.expand.track || foundEventDerived.map}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<div class="mb-4 flex items-center justify-between">
									<h2 class="card-title text-2xl">Tracciato</h2>
									{#if foundEventDerived.expand.track.coordinates && !(foundEventDerived.expand.track.coordinates.lat == 0 && foundEventDerived.expand.track.coordinates.lon == 0) && foundEventDerived.map && foundEventDerived.map != ''}
										<div class="flex items-center gap-1">
											<ContextualHelp contextualHelp={contextualHelps.events_changeTrackImage} />

											<label
												class="swap swap-rotate btn btn-sm btn-circle tooltip tooltip-left tooltip-unbold"
												data-tip={showInteractiveMap
													? 'Visualizza cartina'
													: 'Visualizza mappa interattiva'}
											>
												<input type="checkbox" onclick={switchShowInteractiveMap} />
												<MapBase class="swap-on h-5 w-5 text-red-600" />
												<SquarePen class="swap-off h-5 w-5 text-red-600" />
											</label>
										</div>
									{/if}
								</div>
								{#if (foundEventDerived.expand.track.coordinates && !(foundEventDerived.expand.track.coordinates.lat == 0 && foundEventDerived.expand.track.coordinates.lon == 0)) || (foundEventDerived.map && foundEventDerived.map != '')}
									{#if showInteractiveMap}
										<div class="mb-4 h-100 w-full overflow-hidden rounded-lg bg-neutral-100">
											<iframe
												src={trackMapURL}
												width="100%"
												height="100%"
												style="border:0;"
												allowfullscreen={null}
												loading="lazy"
												referrerpolicy="no-referrer-when-downgrade"
												title="Mappa interattiva del tracciato"
											></iframe>
										</div>
									{:else}
										<img
											src={foundEventDerived.map}
											alt="Cartina del tracciato"
											class="mb-4 w-full rounded-lg"
										/>
									{/if}
								{/if}
								<div class="space-y-4">
									<!-- Length -->
									{#if foundEventDerived.expand.track.length}
										<div class="bg-base-200 flex items-center justify-between gap-3 rounded-lg p-3">
											<div class="flex items-center gap-2">
												<Ruler class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="xs:text-xl text-lg font-semibold">Lunghezza</span>
													<span class="text-base-content/70 text-sm">Dalla partenza all'arrivo</span
													>
												</div>
											</div>
											<span
												><span class="text-2xl font-bold"
													>{foundEventDerived.expand.track.length}</span
												>m</span
											>
										</div>
									{/if}
									<!-- Turns -->
									{#if foundEventDerived.expand.track.rightTurns && foundEventDerived.expand.track.leftTurns}
										<div class="bg-base-200 flex items-center justify-between gap-3 rounded-lg p-3">
											<div class="flex items-center gap-2">
												<Route class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="xs:text-xl text-lg font-semibold">Curve</span>
													<span class="text-base-content/70 text-sm">Numero di svolte</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="flex flex-col items-center justify-center">
													<span class="text-2xl font-bold"
														>{foundEventDerived.expand.track.leftTurns}</span
													>
													<span class="text-base-content/70 text-sm">Sinistra</span>
												</div>
												<div class="divider divider-horizontal m-0.5"></div>
												<div class="flex flex-col items-center justify-center">
													<span class="text-2xl font-bold"
														>{foundEventDerived.expand.track.rightTurns}</span
													>
													<span class="text-base-content/70 text-sm">Destra</span>
												</div>
											</div>
										</div>
									{/if}
									<!-- Altitude -->
									{#if foundEventDerived.expand.track.maxAltitude && foundEventDerived.expand.track.minAltitude}
										<div class="bg-base-200 flex items-center justify-between gap-3 rounded-lg p-3">
											<div class="flex items-center gap-2">
												<Mountain class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="xs:text-xl text-lg font-semibold">Altimetria</span>
													<span class="text-base-content/70 text-sm">Quote raggiunte</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="flex flex-col items-center justify-center">
													<span
														><span class="text-2xl font-bold"
															>{foundEventDerived.expand.track.maxAltitude}</span
														>m</span
													>
													<span class="text-base-content/70 text-sm">Max</span>
												</div>
												<div class="divider divider-horizontal m-0.5"></div>
												<div class="flex flex-col items-center justify-center">
													<span
														><span class="text-2xl font-bold"
															>{foundEventDerived.expand.track.minAltitude}</span
														>m</span
													>
													<span class="text-base-content/70 text-sm">Min</span>
												</div>
											</div>
										</div>
									{/if}
									<!-- Slope -->
									{#if foundEventDerived.expand.track.differenceAltitude}
										<div class="bg-base-200 flex items-center justify-between gap-3 rounded-lg p-3">
											<div class="flex items-center gap-2">
												<TriangleRight class="h-6 w-6 -scale-x-100 text-red-600" />
												<div class="flex flex-col">
													<span class="xs:text-xl text-lg font-semibold">Pendenza</span>
													<span class="text-base-content/70 text-sm"
														>Inclinazione del tracciato</span
													>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="flex flex-col items-center justify-center">
													<span
														><span class="text-2xl font-bold"
															>{foundEventDerived.expand.track.differenceAltitude}</span
														>m</span
													>
												</div>
												{#if foundEventDerived.expand.track.length}
													<div class="divider divider-horizontal m-0.5"></div>
													<div class="flex flex-col items-center justify-center">
														<span
															><span class="text-2xl font-bold"
																>{(
																	(foundEventDerived.expand.track.differenceAltitude /
																		foundEventDerived.expand.track.length) *
																	100
																).toPrecision(1)}</span
															>%</span
														>
													</div>
												{/if}
											</div>
										</div>
									{/if}
									<!-- Surface Composition -->
									{#if foundEventDerived.expand.track.surfaces}
										<div class="bg-base-200 flex flex-col justify-between gap-3 rounded-lg p-3">
											<div class="flex items-center gap-2">
												<ChartSpline class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="xs:text-xl text-lg font-semibold">Composizione</span>
													<span class="text-base-content/70 text-sm"
														>Materiali della superficie</span
													>
												</div>
											</div>
											<div class="flex h-4 w-full overflow-hidden rounded-full">
												{#each ToSurfaceInfoExpandArray(foundEventDerived.expand.track.surfaces) as surface}
													<div
														class="flex h-full items-center justify-center text-xs text-white text-shadow-lg"
														style="width: {surface.percentage}%; background-color: {surface.color};"
														title="{surface.name}: {surface.meters}m ({surface.percentage}%)"
													>
														{#if surface.percentage > 10}
															{surface.percentage.toFixed(0)}%
														{/if}
													</div>
												{/each}
											</div>
											<div class="grid grid-cols-2 gap-2">
												{#each ToSurfaceInfoExpandArray(foundEventDerived.expand.track.surfaces) as surface}
													<div class="flex items-center gap-2">
														<div
															class="h-4 w-4 rounded"
															style="background-color: {surface.color};"
														></div>
														<div class="flex-1 text-sm">
															<span class="font-medium">{surface.name}</span>
															<span class="text-base-content/60 ml-1">{surface.meters}m</span>
														</div>
													</div>
												{/each}
											</div>
										</div>
									{/if}
								</div>
							</div>
						</div>
					{/if}
				</div>
				<div class="space-y-8">
					<!-- Poster -->
					{#if foundEventDerived.poster}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<figure class="rounded-lg shadow-lg">
									<img
										src={foundEventDerived.poster}
										alt="Poster dell'evento"
										class="w-full object-cover"
									/>
								</figure>
							</div>
						</div>
					{/if}
					<!-- Regulation -->
					{#if foundEventDerived.regulation}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body items-center text-center">
								<h2 class="card-title text-2xl">Regolamento Evento</h2>
								<p class="text-base-content/70 mb-4">
									Regolamento specifico di {foundEventDerived.shortName} in formato PDF.
								</p>
								<a
									href={foundEventDerived.regulation}
									class="btn btn-primary btn-wide"
									target="_blank"
									rel="noopener noreferrer"
								>
									<FileCheck class="h-4 w-4 text-white md:h-6 md:w-6" />
									Apri PDF
								</a>
							</div>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>

	<!-- Subscribers Modal -->
	<!-- {#if showSubscribersModal}
		<div class="modal modal-open">
			<div class="modal-box max-w-4xl">
				<h3 class="font-bold text-2xl mb-6">Team Iscritti - {eventParticipationsDerived?.length} Totali</h3>
				
				<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div>
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-xl font-semibold">SoapBox</h4>
							<span class="badge badge-primary badge-lg">{eventParticipationsDerived.filter((p) => p.category == CategoryKind.SoapBox)
									.length}</span>
						</div>
						<div class="space-y-2 max-h-100 overflow-y-auto pr-2">
							{#each eventParticipationsDerived.filter((p) => p.category == CategoryKind.SoapBox) as eventParticipation}
								<div class="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
									<div class="font-semibold">{eventParticipation.expand.team.name}</div>
									<div class="text-sm text-base-content/70">{eventParticipation.teamNameAlias}</div>
								</div>
							{/each}
						</div>
					</div>
					<div>
						<div class="flex items-center justify-between mb-4">
							<h4 class="text-xl font-semibold">Drift-Trike</h4>
							<span class="badge badge-primary badge-lg">{eventParticipationsDerived.filter((p) => p.category == CategoryKind.DriftTrike)
									.length}</span>
						</div>
						<div class="space-y-2 max-h-100 overflow-y-auto pr-2">
							{#each eventParticipationsDerived.filter((p) => p.category == CategoryKind.DriftTrike) as eventParticipation}
								<div class="p-3 bg-base-200 rounded-lg hover:bg-base-300 transition-colors">
								<div class="font-semibold">{eventParticipation.expand.team.name}</div>
									<div class="text-sm text-base-content/70">{eventParticipation.teamNameAlias}</div>
								</div>
							{/each}
						</div>
					</div>
				</div>

				<div class="modal-action">
					<button class="btn" onclick={closeSubscribersModal}>Chiudi</button>
				</div>
			</div>
			<div class="modal-backdrop" role="button" tabindex="0" onclick={closeSubscribersModal} onkeypress={(e) => e.key === 'Enter' ? closeSubscribersModal() : null}></div>
		</div>
	{/if} -->
</main>

<style>
	.tooltip-unbold.tooltip::before {
		font-weight: 400;
	}

	.news :global {
		h1 {
			font-size: var(--text-2xl);
		}
		h2 {
			font-size: var(--text-xl);
		}
		h3 {
			font-size: var(--text-lg);
		}
		a {
			color: var(--color-blue-600);
			text-decoration-line: underline;
		}
	}
</style>
