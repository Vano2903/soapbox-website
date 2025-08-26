<script lang="ts">
	let { data } = $props();
	console.log('date in enroll page', data);
	let warnings = $derived(data.warnings);
	let event = $derived(data.event);

	function formatDate(date: Date | undefined) {
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

<main>
	<div class="m-auto mt-10 rounded-md bg-neutral-100 p-2 shadow-md md:w-2/3 md:p-4 lg:w-1/2">
		<div class="flex flex-col gap-4 overflow-hidden text-center text-base">
			<div class="relative h-1/3">
				<img
					src="/images/calendars/eventCover.png"
					alt={event.name}
					class="h-full w-full object-cover"
				/>
			</div>
			<div class="flex flex-col content-between items-center p-1 text-center">
				<hr
					class="mx-auto mt-1.5 mb-2 h-0.75 w-[80%] max-w-[20rem] rounded-sm border-0 bg-red-600 md:mb-4 md:w-2/3 md:max-w-70"
				/>
				<div class="space-y-2">
					<p class="hidden text-xl text-gray-600 md:block">— {event.shortName} —</p>
					<h3 class="text-2xl font-bold md:px-5 md:text-3xl">{event.name}</h3>
					<div class="mt-2 text-lg text-gray-500 md:mt-4 md:text-base">
						<div class="block md:hidden">
							<p>{formatDate(event.startDate)}</p>
						</div>
						<div class="hidden md:block">
							<p>dal: {formatDate(event.startDate)}</p>
							{#if event.endDate}
								<p>al: {formatDate(event.endDate)}</p>
							{:else}
								<p>&nbsp</p>
							{/if}
						</div>
					</div>
					<p class="text-md mt-2 text-gray-500 md:text-base">
						{event.numSubscriptions}{(event.maxSubscriptions ?? 0) > 0
							? `/${event.maxSubscriptions}`
							: ''} iscrizioni
					</p>
				</div>
				<hr
					class="mx-auto mt-2 mb-1.5 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mt-4"
				/>
			</div>
		</div>

		<div class="mb-4 flex flex-col items-center justify-center gap-4">
			{#each warnings as warning}
				<span class="rounded-md bg-amber-100 p-5">
					{@html warning}
				</span>
			{/each}
		</div>

		<div class="mb-4 flex flex-row flex-wrap justify-center gap-6 text-gray-600 underline">
			<a href="/calendars" class="hover:text-red-600">Torna al Calendario</a>
			<a href="/championships" class="hover:text-red-600">Torna al Campionato</a>
		</div>
		<hr class="mx-auto mt-2 mb-1.5 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mt-4" />
	</div>
</main>

<style>
	a {
		cursor: pointer;
	}
</style>
