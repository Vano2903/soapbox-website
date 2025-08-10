<script lang="ts">
	const url = new URL(window.location.href);
	console.log(url);
</script>

<main>
	<div class="m-auto mt-10 w-1/2 rounded-md bg-neutral-100 p-4 shadow-md">
		<div class="flex flex-col gap-4 text-center text-base">
			<hr
				class="mx-auto mt-2 mb-1.5 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mt-4"
			/>
			<h2 class="text-2xl font-bold">
				{url.searchParams.get('event')}
			</h2>
			<p>
				La pagina non esiste realmente, volevo solo verificare se la redirect funzionasse
				correttamente.
			</p>
			<div class="mt-4 flex flex-row flex-wrap justify-center gap-6 text-gray-600 underline">
				<a href="/calendars" class="hover:text-red-600">Torna al Calendario</a>
				<a href="/championships" class="hover:text-red-600">Torna al Campionato</a>
			</div>
			<hr
				class="mx-auto mt-2 mb-1.5 h-0.75 w-2/3 max-w-70 rounded-sm border-0 bg-red-600 md:mt-4"
			/>
		</div>
	</div>
</main>

<style>
	a {
		cursor: pointer;
	}
</style>
