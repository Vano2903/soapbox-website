<script lang="ts">
	import type { ChampionshipNonExpand } from '$types/pocketbase/championship.js';
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideCalendarCheck, LucideRadio, LucideLock } from 'lucide-svelte';
	import { goto } from '$app/navigation';

	// constant that defines how many elements to show on each side of the current element of the ElementSelection component
	const championshipsListOffset: number = 3;

	// destructures the data received from the PageLoad and prepares it to be derived (reactive to changes in value)
	const { data } = $props();
	const championshipsListDerived = $derived(data.championshipsList);
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const championshipDocumentsDerived = $derived(data.championshipDocuments);

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

	// Function to transform the championship list into a format suitable for ElementSelection (with extra empty boundaries for cool UI effects)
	function transformToElementList(championshipList: ChampionshipNonExpand[]) {
		let elementsList = championshipList.map((v) => {
			return {
				value: v.name,
				current: v.name === foundChampionshipDerived.name,
				disabled: false,
				icon: new Date(v.endDate) > new Date() ? null : LucideCalendarCheck,
				iconProps: {}
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

	function formatDate(date: Date | (Date | undefined)) {
		if (!date) {
			return null;
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
	<header class="flex flex-col items-center space-y-2 px-8 py-15 text-center">
		<span class="text-5xl font-bold"> Bacheca </span>
		<p class="text-neutral-500">
			La nostra board è come il vecchio tabellone di paese: ogni foglio racconta un pezzo del campionato.
			Avvisi, regole e info utili, ma sempre con la stessa dose di entusiasmo che ci facorrere giù per le strade.
		</p>
	</header>

	<div class="flex flex-col">
		<div class="mt-5 mb-13 flex justify-center">
			<ElementSelection
				offset={championshipsListOffset}
				elements={transformToElementList(championshipsListDerived)}
				handleSelection={selectionYear}
				keysInteraction={true}
			/>
		</div>
	</div>

	<div class="space-y-8">
		<section class="flex flex-wrap justify-center gap-4">
			{#if championshipDocumentsDerived && championshipDocumentsDerived.length > 0}
				{#each championshipDocumentsDerived as document}
					<div
						class="h-52 w-50 overflow-hidden rounded-xl bg-white shadow-md transition duration-300 hover:scale-105 hover:bg-neutral-100 md:h-70 md:w-80"
					>
						<div class="flex flex-col content-between items-center p-1 text-center">
							<hr
								class="mx-auto mt-1.5 mb-2 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mb-4"
							/>
							<div>
								<p class="text-base text-gray-600 md:text-xl">— {document.data.category} —</p>
								<h3 class="text-xl font-bold md:px-5 md:text-3xl">{document.data.name}</h3>
								<div class="mt-2 md:mt-8">
									{#if document.data.enabled}
										<a
											target="_blank"
											href={document.publicUrl}
											class="btn btn-error text-foreground max-w-5/12 text-xs md:text-lg"
										>
											Visualizza
										</a>
									{:else}
										<button
											class="btn btn-disabled flex-nowrap text-xs text-nowrap text-gray-600 md:text-lg"
										>
											Visualizza
										</button>
									{/if}
								</div>
								<div class="mt-2 text-sm text-gray-500 md:mt-4 md:text-base">
									<div class="flex flex-col gap-1">
										<p>Aggiornato il:</p>
										<p>{document.data.formattedUpdated}</p>
									</div>
								</div>
							</div>
							<hr
								class="mx-auto mt-2 mb-1.5 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mt-4"
							/>
						</div>
					</div>
				{/each}
			{:else}
				<div
					class="xs:m-auto xs:w-9/10 flex flex-col justify-center rounded-md bg-neutral-50 px-4 py-8 shadow-md lg:w-7/10"
				>
					<p class="text-center">
						Per questo campionato non sono ancora stati annunciati regolamenti.
					</p>
				</div>
			{/if}
		</section>
	</div>
</main>

<style>
	button,
	a {
		cursor: pointer;
	}
</style>
