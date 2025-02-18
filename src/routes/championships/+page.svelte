<script lang="ts">
	import type {
		ChampionshipHeaderType,
		ChampionshipLeaderboardType
	} from '$tsTypes/championships/championshipLeaderboard';
	import type { EventLeaderboardType } from '$tsTypes/championships/eventLeaderboard';
	import type { LiveLeaderboardsType } from '$tsTypes/championships/liveLeaderboards';
	import type { PageProps } from './$types';

	const { data } = $props();

	const {
		liveLeaderboards,
		championshipLeaderboard,
		eventLeaderboard
	}: {
		liveLeaderboards: LiveLeaderboardsType;
		championshipLeaderboard: ChampionshipLeaderboardType;
		eventLeaderboard: EventLeaderboardType;
	} = data;

	console.log('liveLeaderboards', liveLeaderboards);
	console.log('championshipLeaderboard', championshipLeaderboard);
	console.log('eventLeaderboard', eventLeaderboard);
</script>

<!-- #ich -->
{#if liveLeaderboards}
	<h1>LIVE</h1>
{/if}
{#if championshipLeaderboard != null}
	<h1>CAMPIONATO</h1>
{/if}
{#if eventLeaderboard != null}
	<h1>EVENTO</h1>
{/if}
