<script lang="ts">
	import { redirect } from '@sveltejs/kit';

	const { data } = $props();
	const team = data.teams;
</script>

{#if !team || team.totalItems == 0}
	<p class="text-center">Non sei ancora in nessun team</p>
{:else}
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
