<script lang="ts">
	import { LeaderboardType } from '$types/pocketbase/results';
	import { CategoryKind } from '$types/pocketbase/eventParticipation';
	import { ToSurfaceInfoExpandArray } from '$types/surfaceUtils.js';
	import { CalendarDays, MapPin, LucideRadio, UserRoundCheck, UserRoundPlus, FileCheck, Map as MapBase, SquarePen, Route, Ruler, Mountain, TriangleRight, ChartSpline } from 'lucide-svelte';
	import { string } from 'zod';

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

	// --- Interactive Map management ---
	const mapZoom = 16;
	const trackMapURL = $derived(`https://www.google.com/maps/d/embed?mid=1UhQ2GD9N4TgOZ-KBu2nn7ak-WqbYjuo&hl=it&ll=${foundEventDerived.expand.track?.coordinates?.lat},${foundEventDerived.expand.track?.coordinates?.lon}&z=${mapZoom}&noprof=1`);
	let showInteractiveMap = $state(true);
</script>

<main class="pb-16">
	<div class="min-h-screen bg-base-100">
		<div class="relative h-[30vh] md:h-[40vh] overflow-hidden">
			<img 
				src={foundEventDerived?.cover == ''
							? 'images/calendars/eventCover.png'
							: (foundEventDerived?.cover ?? 'images/calendars/eventCover.png')} 
				alt='event cover'
				class="w-full h-full object-cover"
			/>
			<div class="absolute inset-0 bg-linear-to-t from-base-100 to-transparent to-80% sm:to-60%"></div>
			<div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
				<div class="max-w-7xl mx-auto">
					<h1 class="text-4xl md:text-6xl font-bold drop-shadow-2xl">
						{foundEventDerived.name}
					</h1>
					<p class="text-lg md:text-xl mb-2 drop-shadow-lg">
						— {foundEventDerived.shortName} —
					</p>
					<div class="flex flex-wrap gap-4 drop-shadow">
						<div class="flex items-center gap-2">
							<MapPin class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
							<span class="text-gray-600">
								{#if foundEventDerived?.expand.location.name !== foundEventDerived?.expand.location.city}
									{foundEventDerived?.expand.location.name}, {foundEventDerived?.expand.location.city}
								{:else}
									{foundEventDerived?.expand.location.name}
								{/if}
								{#if foundEventDerived?.expand.location.provinceShort}
									({foundEventDerived?.expand.location.provinceShort})
								{/if}
							</span>
						</div>
						<div class="flex items-center gap-2">
							<CalendarDays class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
							<span class="text-gray-600">Dal {new Date(foundEventDerived?.startDate ?? new Date()).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="max-w-7xl mx-auto px-4 md:px-6 py-8">
			<div 
				class="card bg-base-100 shadow-xl mb-8 cursor-pointer hover:shadow-2xl transition duration-300 hover:bg-neutral-100"
				onclick={() => (document.getElementById('subscribed-member-list_modal') as HTMLDialogElement)?.showModal()}
				onkeypress={(e) => e.key === 'Enter' && (document.getElementById('subscribed-member-list_modal') as HTMLDialogElement)?.showModal()}
				role="button"
				tabindex="0"
			>
				<div class="card-body">
					<div class="flex flex-row items-center xs:justify-between gap-4">
						<div class="flex flex-row items-center gap-4 justify-between">
							<div class="hidden xs:flex flex-col items-center border rounded-md p-2 shadow-md min-w-24">
								<span class="text-lg md:text-4xl font-bold text-primary">{foundEventDerived.numSubscriptions}</span>
								<span class="text-xs md:text-sm text-gray-600">Iscritti</span>
							</div>
							<div>
								<h2 class="card-title text-lg md:text-2xl">Partecipanti</h2>
								<p class="text-xs md:text-base text-gray-600">Clicca per vedere la lista di tutti i team iscritti</p>
							</div>
						</div>
						<button class="btn btn-primary btn-md md:btn-lg" onclick={(e) => {e.stopPropagation();}}>
							Iscriviti
						</button>
					</div>
				</div>

				<dialog
					id="subscribed-member-list_modal"
					class="modal modal-bottom sm:modal-middle"
					>
					<div class="modal-box max-w-4xl">
						<form method="dialog">
							<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
						</form>
						<!-- TODO: Review modal layout: should contain a tab-view, one for each category. Use TeamCard and not a simple template -->
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
					</div>
				</dialog>
			</div>

			<hr class="my-8" />

			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<div class="space-y-8">
					<!-- Schedule -->
					{#if foundEventDerived.expand.stages && foundEventDerived.expand.stages.length > 0}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-4">Programma</h2>
								<div class="space-y-3">
									{#each foundEventDerived.expand.stages as stage}
										<div class="flex gap-4 p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
											<div class="text-primary font-bold text-lg min-w-15">
												<div class="flex flex-col justify-center items-center">
													{#if stage.startTime}
														<span>{new Date(stage.startTime).getDate().toString().padStart(2, '0')}/{(new Date(stage.startTime).getMonth() + 1).toString().padStart(2, '0')}</span>
														<span>{new Date(stage.startTime).getHours().toString().padStart(2, '0')}:{new Date(stage.startTime).getMinutes().toString().padStart(2, '0')}</span>
													{:else}
														<span>Non</span>
														<span>definito</span>
													{/if}
												</div>
											</div>
											<div class="flex-1">
												<h3 class="font-semibold mb-1">{stage.name}</h3>
												<p class="text-sm text-base-content/70">{stage.description}</p>
											</div>
										</div>
									{/each}
								</div>
							</div>
						</div>
					{/if}
					<!-- Track Details -->
					{#if foundEventDerived.expand.track}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<div class="flex items-center justify-between mb-4">
									<h2 class="card-title text-2xl">Tracciato</h2>
									<label class="swap swap-rotate">
										<input type="checkbox" bind:checked={showInteractiveMap} class="tooltip tooltip-left" data-tip={showInteractiveMap ? "Visualizza cartina" : "Visualizza mappa interattiva"}/>
										<MapBase class="swap-off h-6 w-6 text-red-600"/>
										<SquarePen class="swap-on h-6 w-6 text-red-600"/>
									</label>
								</div>
								{#if showInteractiveMap && foundEventDerived.expand.track.coordinates}
									<div class="w-full h-100 rounded-lg mb-4 overflow-hidden bg-neutral-100">
										<iframe
										src={trackMapURL}
										width="100%"
										height="100%"
										style="border:0;"
										allowfullscreen={null}
										loading="lazy"
										referrerpolicy="no-referrer-when-downgrade"
										title="Mappa tracciato"
										></iframe>
									</div>
								{:else if !showInteractiveMap && foundEventDerived.map && foundEventDerived.map != ''}
									<img 
										src={foundEventDerived.map}
										alt="Mappa del tracciato"
										class="w-full rounded-lg mb-4"
									/>
								{/if}
								<div class="space-y-4">
									<!-- Length -->
									{#if foundEventDerived.expand.track.length}
										<div class="flex justify-between items-center gap-3 p-3 bg-base-200 rounded-lg">
											<div class="flex items-center gap-2">
												<Ruler class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="font-semibold text-lg xs:text-xl">Lunghezza</span>
													<span class="text-sm text-base-content/70">Dalla partenza all'arrivo</span>
												</div>
											</div>
											<span><span class="text-2xl font-bold">{foundEventDerived.expand.track.length}</span>m</span>
										</div>
									{/if}
									<!-- Turns -->
									{#if foundEventDerived.expand.track.rightTurns && foundEventDerived.expand.track.leftTurns}
										<div class="flex justify-between items-center gap-3 p-3 bg-base-200 rounded-lg">
											<div class="flex items-center gap-2">
												<Route class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="font-semibold text-lg xs:text-xl">Curve</span>
													<span class="text-sm text-base-content/70">Numero di svolte</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="flex flex-col items-center justify-center">
													<span class="text-2xl font-bold">{foundEventDerived.expand.track.rightTurns}</span>
													<span class="text-sm text-base-content/70">Sinistra</span>
												</div>
												<div class="divider divider-horizontal m-0.5"></div>
												<div class="flex flex-col items-center justify-center">
													<span class="text-2xl font-bold">{foundEventDerived.expand.track.rightTurns}</span>
													<span class="text-sm text-base-content/70">Destra</span>
												</div>
											</div>
										</div>
									{/if}
									<!-- Altitude -->
									{#if foundEventDerived.expand.track.maxAltitude && foundEventDerived.expand.track.minAltitude}
										<div class="flex justify-between items-center gap-3 p-3 bg-base-200 rounded-lg">
											<div class="flex items-center gap-2">
												<Mountain class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="font-semibold text-lg xs:text-xl">Altimetria</span>
													<span class="text-sm text-base-content/70">Quote raggiunte</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="flex flex-col items-center justify-center">
													<span><span class="text-2xl font-bold">{foundEventDerived.expand.track.maxAltitude}</span>m</span>
													<span class="text-sm text-base-content/70">Max</span>
												</div>
												<div class="divider divider-horizontal m-0.5"></div>
												<div class="flex flex-col items-center justify-center">
													<span><span class="text-2xl font-bold">{foundEventDerived.expand.track.minAltitude}</span>m</span>
													<span class="text-sm text-base-content/70">Min</span>
												</div>
											</div>
										</div>
									{/if}
									<!-- Slope -->
									{#if foundEventDerived.expand.track.differenceAltitude}
										<div class="flex justify-between items-center gap-3 p-3 bg-base-200 rounded-lg">
											<div class="flex items-center gap-2">
												<TriangleRight class="h-6 w-6 text-red-600 -scale-x-100" />
												<div class="flex flex-col">
													<span class="font-semibold text-lg xs:text-xl">Pendenza</span>
													<span class="text-sm text-base-content/70">Inclinazione del tracciato</span>
												</div>
											</div>
											<div class="flex items-center gap-2">
												<div class="flex flex-col items-center justify-center">
													<span><span class="text-2xl font-bold">{foundEventDerived.expand.track.differenceAltitude}</span>m</span>
												</div>
												{#if foundEventDerived.expand.track.length}
													<div class="divider divider-horizontal m-0.5"></div>
													<div class="flex flex-col items-center justify-center">
														<span><span class="text-2xl font-bold">{((foundEventDerived.expand.track.differenceAltitude/foundEventDerived.expand.track.length)*100).toPrecision(1)}</span>%</span>
													</div>
												{/if}
											</div>
										</div>
									{/if}
									<!-- Surface Composition -->
									{#if foundEventDerived.expand.track.surfaces}
										<div class="flex flex-col justify-between gap-3 p-3 bg-base-200 rounded-lg">
											<div class="flex items-center gap-2">
												<ChartSpline class="h-6 w-6 text-red-600" />
												<div class="flex flex-col">
													<span class="font-semibold text-lg xs:text-xl">Composizione</span>
													<span class="text-sm text-base-content/70">Materiali della superficie</span>
												</div>
											</div>
											<div class="w-full h-4 rounded-full overflow-hidden flex">
												{#each ToSurfaceInfoExpandArray(foundEventDerived.expand.track.surfaces) as surface}
													<div 
														class="h-full flex items-center justify-center text-xs text-white text-shadow-lg"
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
														<div class="w-4 h-4 rounded" style="background-color: {surface.color};"></div>
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