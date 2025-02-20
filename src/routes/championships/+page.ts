import type { PageLoad } from './$types';

import type { LiveLeaderboardsType } from '$tsTypes/championships/liveLeaderboards';
import type { ChampionshipLeaderboardType } from '$tsTypes/championships/championshipLeaderboard';
import type { EventLeaderboardType } from '$tsTypes/championships/eventLeaderboard';

export const load: PageLoad = async ({
	fetch,
	params
}): Promise<{
	liveLeaderboards: LiveLeaderboardsType;
	championshipLeaderboard: ChampionshipLeaderboardType;
	eventLeaderboard: EventLeaderboardType;
}> => {
	const liveLeaderboardsJson = await fetch('test-jsonfiles/liveLeaderboards.json');
	const championshipLeaderboardJson = await fetch('test-jsonfiles/championshipLeaderboard.json');
	const eventLeaderboardJson = await fetch('test-jsonfiles/eventLeaderboard.json');

	const liveLeaderboards = (await liveLeaderboardsJson.json()) as LiveLeaderboardsType;
	const championshipLeaderboard =
		(await championshipLeaderboardJson.json()) as ChampionshipLeaderboardType;
	const eventLeaderboard = (await eventLeaderboardJson.json()) as EventLeaderboardType;

	return {
		liveLeaderboards,
		championshipLeaderboard,
		eventLeaderboard
	};
};
