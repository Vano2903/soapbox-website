<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	const { data } = $props();
	const { teams, user } = data;
</script>

{#if !teams || teams.totalItems == 0}
	<p class="text-center">Non sei ancora in nessun team</p>
{:else}
	<h1 class="mb-4 text-3xl font-bold">I tuoi team</h1>

	<!-- search bar -->
	<div class="flex">
		<div class="form-control mb-4">
			<label class="label" for="team-search">
				<span class="label-text">Cerca tra i tuoi team:</span>
			</label>
			<input
				id="team-search"
				type="text"
				disabled
				placeholder="secondo te funziona ora?"
				class="input input-bordered"
			/>
		</div>
		<a href={`/user/${user.nick}/dash/team/new`} class="btn max-w-64 bg-red-600"
			>Crea un Nuovo Team</a
		>
	</div>
	{#each teams.items as t}
		<div class="card bg-base-100 mb-4 w-full shadow-xl">
			<div class="card-body">
				<h2 class="card-title">{t.name}</h2>
				<p>{t.bio}</p>
				<div class="card-actions justify-end">
					<a href={`/team/${t.slug}/dash`} class="btn btn-primary">Vai al team</a>
				</div>
			</div>
		</div>
	{/each}
{/if}
