<script lang="ts">
	import { LeaderboardType } from '$types/pocketbase/results';
	import { CategoryKind } from '$types/pocketbase/eventParticipation';
	import { ToSurfaceArray } from '$types/pocketbase/tracks';
	import { CalendarDays, MapPin, LucideRadio, UserRoundCheck, UserRoundPlus, FileCheck } from 'lucide-svelte';

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

	// function formatDate(date: Date | undefined) {
	// 	if (!date) return '';

	// 	const newDate = new Date(date);
	// 	return newDate.toLocaleDateString('it-IT', { 
	// 		day: 'numeric', 
	// 		month: 'long', 
	// 		year: 'numeric' 
	// 	});
	// }

	let showSubscribersModal = $state(false);
	function openSubscribersModal() {
		showSubscribersModal = true;
	}
	function closeSubscribersModal() {
		showSubscribersModal = false;
	}
</script>

<main class="pb-16">
	<div class="min-h-screen bg-base-200">
		<div class="relative h-[30vh] md:h-[40vh] overflow-hidden">
			<img 
				src={foundEventDerived?.cover == ''
							? 'images/calendars/eventCover.png'
							: (foundEventDerived?.cover ?? 'images/calendars/eventCover.png')} 
				alt='event cover'
				class="w-full h-full object-cover"
			/>
			<div class="absolute inset-0 bg-linear-to-t from-base-300 to-transparent to-50%"></div>
			<div class="absolute bottom-0 left-0 right-0 p-6 md:p-10">
				<div class="max-w-7xl mx-auto">
					<h1 class="text-4xl md:text-6xl font-bold drop-shadow-lg">
						{foundEventDerived.name}
					</h1>
					<p class="text-lg md:text-xl mb-2 drop-shadow">
						— {foundEventDerived.shortName} —
					</p>
					<div class="flex flex-wrap gap-4 drop-shadow">
						<div class="flex items-center gap-2">
							<MapPin class="h-4 w-4 text-red-600 md:h-6 md:w-6" />
							<span class="text-gray-600">
								{foundEventDerived?.expand.location.name}
								{#if foundEventDerived?.expand.location.name !== foundEventDerived?.expand.location.city}
									, {foundEventDerived?.expand.location.city}
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
			
			<!-- Subscription Card -->
			<div 
				class="card bg-base-100 shadow-xl mb-8 cursor-pointer hover:shadow-2xl transition-shadow"
				onclick={openSubscribersModal}
				onkeypress={(e) => e.key === 'Enter' && openSubscribersModal()}
				role="button"
				tabindex="0"
			>
				<div class="card-body">
					<div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div>
							<h2 class="card-title text-2xl mb-2">Iscrizioni</h2>
							<p class="text-base-content/70">Clicca per vedere tutti i team iscritti</p>
						</div>
						<div class="flex items-center gap-4">
							<div class="stats shadow">
								<div class="stat place-items-center py-4 px-6">
									<div class="stat-title">Team Iscritti</div>
									<div class="stat-value text-primary">{foundEventDerived.numSubscriptions}</div>
								</div>
							</div>
							<button class="btn btn-primary btn-lg" onclick={(e) => {e.stopPropagation();}}>
								Iscriviti
							</button>
						</div>
					</div>
				</div>

				<dialog
					id="subscribed-member-list_modal"
					class="modal modal-bottom sm:modal-middle"
					>
					<div class="modal-box">
						<!-- TODO: Do the dialog here and fix the track placement problem -->
					</div>
				</dialog>
			</div>

			<!-- Two Column Layout -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				
				<!-- Left Column: Program & Track -->
				<div class="space-y-8">
					
					<!-- Event Program -->
					{#if foundEventDerived.expand.stages && foundEventDerived.expand.stages.length > 0}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-4">Programma</h2>
								<div class="space-y-3">
									{#each foundEventDerived.expand.stages as stage}
										<div class="flex gap-4 p-4 rounded-lg bg-base-200 hover:bg-base-300 transition-colors">
											<div class="text-primary font-bold text-lg min-w-15">
												{stage.startTime}
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

					<!-- Track Map & Details -->
					{#if foundEventDerived.expand.track}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body">
								<h2 class="card-title text-2xl mb-4">Tracciato</h2>
								
								<img 
									src='images/calendars/mappabergamoprova.jpeg'
									alt="Mappa del tracciato"
									class="w-full rounded-lg mb-4"
								/>

								<div class="grid grid-cols-2 gap-4">
									<div class="stat bg-base-200 rounded-lg p-4">
										<div class="stat-title text-xs">Curve</div>
										<div class="stat-value text-2xl text-primary">{(foundEventDerived.expand.track.rightTurns ?? 0) + (foundEventDerived.expand.track.leftTurns ?? 0)}</div>
									</div>
									
									<div class="stat bg-base-200 rounded-lg p-4">
										<div class="stat-title text-xs">Lunghezza</div>
										<div class="stat-value text-2xl text-primary">{foundEventDerived.expand.track.length ?? 0}m</div>
									</div>

									<div class="stat bg-base-200 rounded-lg p-4">
										<div class="stat-title text-xs">Alt. Massima</div>
										<div class="stat-value text-2xl">{foundEventDerived.expand.track.maxAltitude ?? 0}m</div>
									</div>

									<div class="stat bg-base-200 rounded-lg p-4">
										<div class="stat-title text-xs">Alt. Minima</div>
										<div class="stat-value text-2xl">{foundEventDerived.expand.track.minAltitude ?? 0}m</div>
									</div>

									<div class="stat bg-base-200 rounded-lg p-4 col-span-2">
										<div class="stat-title text-xs">Dislivello</div>
										<div class="stat-value text-3xl text-accent">{foundEventDerived.expand.track.differenceAltitude ?? 0}m</div>
									</div>
								</div>

								<div class="mt-4">
									<h3 class="font-semibold mb-3">Composizione Fondo</h3>
									<div class="space-y-2">
											{#each ToSurfaceArray(foundEventDerived.expand.track?.surfaces) as surface}
												<div>
													<div class="flex justify-between text-sm mb-1">
														<span>{surface.name}</span>
														<span class="font-semibold">{surface.value}m</span>
													</div>
													<progress 
														class="progress progress-primary w-full" 
														value={surface.percentage} 
														max="100"
													></progress>
												</div>
											{/each}
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>

				<!-- Right Column: Poster & Regulations -->
				<div class="space-y-8">
					
					<!-- Event Poster -->
					{#if foundEventDerived.poster}
						<div class="card bg-base-100 shadow-xl">
							<figure>
								<img 
									src={foundEventDerived.poster} 
									alt="Poster dell'evento"
									class="w-full object-cover"
								/>
							</figure>
						</div>
					{/if}

					<!-- Regulations Document -->
					{#if foundEventDerived.regulation}
						<div class="card bg-base-100 shadow-xl">
							<div class="card-body items-center text-center">
								<h2 class="card-title">Regolamento Evento</h2>
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
	{#if showSubscribersModal}
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
	{/if}
</main>