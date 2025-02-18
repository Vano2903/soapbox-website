import type { PageServerLoad } from './$types';

import type { LiveLeaderboardsType } from '$tsTypes/championships/liveLeaderboards';
import type { ChampionshipLeaderboardType } from '$tsTypes/championships/championshipLeaderboard';
import type { EventLeaderboardType } from '$tsTypes/championships/eventLeaderboard';

export const load: PageServerLoad = async ({ params }) => {

	let liveLeaderboardsJson = await fetch('/static/test-jsonfiles/liveLeaderboards.json')
	let championshipLeaderboardJson = await fetch('/static/test-jsonfiles/championshipLeaderboard.json')
	let eventLeaderboardJson = await fetch('/static/test-jsonfiles/eventLeaderboard.json')

	let liveLeaderboards = await liveLeaderboardsJson.json() as LiveLeaderboardsType;
	let championshipLeaderboard = await championshipLeaderboardJson.json() as ChampionshipLeaderboardType;
	let eventLeaderboard = await eventLeaderboardJson.json() as EventLeaderboardType;

	return {
		liveLeaderboards,
		championshipLeaderboard,
		eventLeaderboard
	};
}