<script lang="ts">
	import type { PageProps } from './$types';

	const { liveLeaderboards, championshipLeaderboard, eventLeaderboard } = $props();
</script>

<!-- #ich -->
{#if liveLeaderboards != null}
	<h1>LIVE</h1>
{/if}
{#if championshipLeaderboard != null}
	<h1>CAMPIONATO</h1>
{/if}
{#if eventLeaderboard != null}
	<h1>EVENTO</h1>
{/if}
