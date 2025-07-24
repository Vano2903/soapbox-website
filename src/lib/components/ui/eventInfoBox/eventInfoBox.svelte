<script lang="ts">
	import { EventKind, type EventInfoType } from '$lib/types/event';

	let {
		eventInfo,
		locatedOnCarousel
	}: {
		eventInfo: EventInfoType;
		locatedOnCarousel: boolean;
	} = $props();
</script>

{#if locatedOnCarousel}
	<div class="rect">
		<div>
			<span class=" h-12 flex-wrap items-end pb-1 text-base/6 text-red-600 xl:pb-2">
				{#if eventInfo.kind === EventKind.NextEventKind}
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Prossimo</span>
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Evento</span>
				{:else if eventInfo.kind === EventKind.HighlightKind}
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Momenti</span>
					<span class="text-4xl font-bold lg:text-5xl xl:text-6xl">Speciali</span>
				{/if}
			</span>

			<hr class="mt-2 mb-6 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600 lg:mb-8 xl:mb-10" />
		</div>

		<div>
			<p class="text-gray-600 xl:text-lg">{eventInfo.header}</p>
			<p class="pb-2 text-2xl lg:pb-4 xl:pb-6 xl:text-3xl">
				{eventInfo.title}
			</p>
			<p class="text-gray-700 xl:text-lg">Data: {eventInfo.date.toLocaleDateString()}</p>
			<p class="pb-4 text-gray-700 tabular-nums xl:pb-6 xl:text-lg">
				Ora: {eventInfo.date.getHours() < 10
					? '0' + eventInfo.date.getHours()
					: eventInfo.date.getHours()}:{eventInfo.date.getMinutes() < 10
					? '0' + eventInfo.date.getMinutes()
					: eventInfo.date.getMinutes()}
			</p>
			<p class="pb-6 text-gray-700 tabular-nums xl:pb-8 xl:text-lg">
				Iscrizioni: <span class="stacked-fractions">
					{eventInfo.currentSubscriptions}/{eventInfo.totalSubscriptions}</span
				>
			</p>
		</div>

		<button class="btn btn-error text-foreground max-w-70 xl:text-lg"
			>{#if eventInfo.kind === EventKind.NextEventKind}Iscriviti{:else if eventInfo.kind === EventKind.HighlightKind}Guarda{/if}</button
		>

		<!-- class="w-32 cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800" -->
	</div>
{:else}
	<div class="rect items-center text-center">
		<hr class="mx-auto mt-2 mb-8 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600" />

		<div>
			<p class="text-gray-600">{eventInfo.header}</p>
			<p class="pb-4 text-2xl">
				{eventInfo.title}
			</p>
			<p class="text-gray-700">Data: {eventInfo.date.toLocaleDateString()}</p>
			<p class="pb-4 text-gray-700 tabular-nums">
				Ora: {eventInfo.date.getHours() < 10
					? '0' + eventInfo.date.getHours()
					: eventInfo.date.getHours()}:{eventInfo.date.getMinutes() < 10
					? '0' + eventInfo.date.getMinutes()
					: eventInfo.date.getMinutes()}
			</p>
			<p class="text-gray-700 tabular-nums">
				Iscrizioni: <span class="stacked-fractions">
					{eventInfo.currentSubscriptions}/{eventInfo.totalSubscriptions}</span
				>
			</p>
		</div>

		<!--<button class="btn btn-error text-foreground max-w-70">Iscriviti</button>-->
		<hr class="mx-auto mt-8 mb-2 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600" />

		<!-- class="w-32 cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800" -->
	</div>
{/if}
