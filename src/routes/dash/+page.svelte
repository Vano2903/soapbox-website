<script lang="ts">
	import type { TypedPocketBase } from '$tsTypes/pocketbase.js';
	import PocketBase, { type RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	const { data } = $props();
	const pb = new PocketBase(data.pbUri) as TypedPocketBase;
	const teams = data.teams;
	onMount(async () => {
		console.log('teams', teams);
	});

	// 	console.log('subscribed to teams');
	// 	pb.collection('teams').subscribe('*', (e) => {
	// 		console.log('Team event:', e);
	// 	});
	// });
</script>

<div class="p-2">
	<p>
		Ciao <span class="font-bold"
			>{data.user?.name} {data.user?.lastName} aka {data.user?.nick}
		</span>, benvenuto nella tua dashboard.
	</p>

	{#if teams.totalItems > 0}
		<a class="btn" href="/dash/team">Visualizza il tuo team</a>
	{:else}
		<p class="my-4">Non fai parte di nessun team.</p>
		<a class="btn" href="/dash/team/new">Crea un nuovo team</a>
		<button class="btn">Entra a far parte di un nuovo team</button>
	{/if}

	<!-- <button onclick={logout} class="btn btn-info my-4"> logout </button> -->
</div>
