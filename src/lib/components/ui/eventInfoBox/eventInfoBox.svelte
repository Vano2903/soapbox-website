<script lang="ts">
	import type { ChampionshipExpand } from '$types/pocketbase/championship';
	import { type EventNonExpand } from '$types/pocketbase/event';

	let {
		championshipInfo,
		eventInfo,
		locatedOnCarousel
	}: {
		championshipInfo: ChampionshipExpand;
		eventInfo: EventNonExpand;
		locatedOnCarousel: boolean;
	} = $props();
</script>

{#if locatedOnCarousel}
	<div class="rect">
		<div>
			<span class=" h-12 flex-wrap items-end pb-1 text-base/6 text-red-600 xl:pb-2">
				{#if eventInfo.subscriptionsOpen}
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Prossimo</span><br />
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Evento</span>
				{:else}
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Momenti</span><br />
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Speciali</span>
				{/if}
			</span>

			<hr class="mt-2 mb-4 h-0.75 w-1/2 max-w-75 rounded-sm border-0 bg-red-600 lg:mb-6 xl:mb-8" />
		</div>

		<div>
			<p class="pb-2 text-sm text-gray-600 lg:text-base xl:text-lg">
				Campionato {championshipInfo.name}
			</p>
			<p class="lg:text-lg xl:text-xl">{eventInfo.shortName}</p>
			<p class="pb-2 text-2xl lg:pb-4 xl:pb-6 xl:text-3xl">
				{eventInfo.name}
			</p>
			<p class="text-gray-700 xl:text-lg">
				Data: {eventInfo.startDate
					? new Date(eventInfo.startDate).toLocaleDateString()
					: 'Da definirsi'}
			</p>
			<p class="pb-6 text-gray-700 tabular-nums xl:pb-6 xl:text-lg">
				Ora: {eventInfo.startDate
					? (new Date(eventInfo.startDate).getHours() < 10
							? '0' + new Date(eventInfo.startDate).getHours()
							: new Date(eventInfo.startDate).getHours()) +
						':' +
						(new Date(eventInfo.startDate).getMinutes() < 10
							? '0' + new Date(eventInfo.startDate).getMinutes()
							: new Date(eventInfo.startDate).getMinutes())
					: 'Da definirsi'}
			</p>
			<p class="pb-2 text-gray-700 tabular-nums xl:text-lg">
				<span>
					{#if eventInfo.subscriptionsOpen}
						{eventInfo.numSubscriptions}{(eventInfo.maxSubscriptions ?? 0) > 0
							? `/${eventInfo.maxSubscriptions}`
							: ''} iscrizioni
					{:else}
						Iscrizioni chiuse<br>
						{eventInfo.numSubscriptions} iscritti
					{/if}
				</span>
			</p>
		</div>

		<!-- <button class="btn btn-error text-foreground max-w-70 xl:text-lg"
			onclick={
				eventInfo.subscriptionsOpen ? () => {openSubscriptionFunction} : () => {closedSubscriptionFunction}
			}
			>{#if eventInfo.subscriptionsOpen}Iscriviti{:else}Guarda{/if}</button
		> -->

		<!-- class="w-32 cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800" -->
	</div>
{:else}
	<div class="rect items-center text-center">
		<hr class="mx-auto mt-2 mb-4 h-0.75 w-5/12 max-w-70 rounded-full border-0 bg-red-600" />

		<div>
			<p class="text-gray-600">Campionato {championshipInfo.name}</p>
			<p class="text-lg md:text-xl">— {eventInfo.shortName} —</p>
			<p class="pb-4 text-2xl">
				{eventInfo.name}
			</p>
			<p class="text-gray-700">
				Data: {eventInfo.startDate
					? new Date(eventInfo.startDate).toLocaleDateString()
					: 'Da definirsi'}
			</p>
			<p class="pb-6 text-gray-700 tabular-nums">
				Ora: {eventInfo.startDate
					? (new Date(eventInfo.startDate).getHours() < 10
							? '0' + new Date(eventInfo.startDate).getHours()
							: new Date(eventInfo.startDate).getHours()) +
						':' +
						(new Date(eventInfo.startDate).getMinutes() < 10
							? '0' + new Date(eventInfo.startDate).getMinutes()
							: new Date(eventInfo.startDate).getMinutes())
					: 'Da definirsi'}
			</p>
			<p class="pb-2 text-gray-700 tabular-nums xl:pb-8 xl:text-lg">
				<span>
					{#if eventInfo.subscriptionsOpen}
						{eventInfo.numSubscriptions}{(eventInfo.maxSubscriptions ?? 0) > 0
							? `/${eventInfo.maxSubscriptions}`
							: ''} iscrizioni
					{:else}
						Iscrizioni chiuse<br>
						{eventInfo.numSubscriptions} iscritti
					{/if}
				</span>
			</p>
		</div>

		<!--<button class="btn btn-error text-foreground max-w-70">Iscriviti</button>-->
		<hr class="mx-auto mt-4 mb-2 h-0.75 w-5/12 max-w-70 rounded-full border-0 bg-red-600" />

		<!-- class="w-32 cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800" -->
	</div>
{/if}
