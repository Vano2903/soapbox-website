<script lang="ts">
	import type { EventType } from '$tsTypes/newRace';
	import { EventKind } from '$tsTypes/newRace';

	interface Props {
		event: EventType;
	}

	//let { event }: Props = $props();
	let { event, deviceSize } = $props();
</script>

<div class="rect">
	<div>
		<span class=" h-12 flex-wrap items-end pb-1 text-base/6 text-red-600">
			{#if event.kind === EventKind.NextEventKind}
				<span class="text-5xl font-bold">Prossimo</span>
				<span class="text-5xl font-bold">Evento</span>
			{:else if event.kind === EventKind.HighlightKind}
				<span class="text-5xl font-bold">Momenti</span>
				<span class="text-5xl font-bold">Speciali</span>
			{/if}
		</span>

		<hr class="mt-2 mb-8 h-0.75 w-1/3 max-w-70 rounded-sm border-0 bg-red-600" />
	</div>

	<div>
		<p class="text-gray-600">{event.header}</p>
		<p class="pb-4 text-2xl">
			{event.title}
		</p>
		<p class="text-gray-700">Data: {event.date.toLocaleDateString()}</p>
		<p class="pb-4 text-gray-700 tabular-nums">
			Ora: {event.date.getHours() < 10
				? '0' + event.date.getHours()
				: event.date.getHours()}:{event.date.getMinutes() < 10
				? '0' + event.date.getMinutes()
				: event.date.getMinutes()}
		</p>
		<p class="pb-8 text-gray-700 tabular-nums">
			Iscrizioni: <span class="stacked-fractions">
				{event.currentSubscriptions}/{event.totalSubscriptions}</span
			>
		</p>
	</div>

	<button class="btn btn-error text-foreground max-w-70">Iscriviti</button>

	<!-- class="w-32 cursor-pointer rounded bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-800" -->
</div>

<style>
</style>
