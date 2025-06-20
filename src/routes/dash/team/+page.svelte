<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	const { data } = $props();
	const team = data.teams;
</script>

{#if !team || team.totalItems == 0}
	<p class="text-center">Non sei ancora in nessun team</p>
{:else}
	<h1 class="mb-4 text-3xl font-bold">I tuoi team</h1>

	<!-- search bar -->
	<div class="flex">
		<div class="form-control mb-4">
			<label class="label" for="team-search">
				<span class="label-text">Cerca tra i tuoi team:</span>
			</label>
			<input id="team-search" type="text" disabled placeholder="secondo te funziona ora?" class="input input-bordered" />
		</div>
		<a href="/dash/team/new" class="btn max-w-64 bg-red-600">Crea un Nuovo Team</a>
	</div>
	{#each team.items as t}
		<div class="card bg-base-100 mb-4 w-full shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{t.name}</h2>
				<p>{t.description}</p>
				<div class="card-actions justify-end">
					<a href={`/dash/team/${t.slug}`} class="btn btn-primary">Vai al team</a>
				</div>
			</div>
		</div>
	{/each}
{/if}
