import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getChampionshipsList } from '$lib/utils/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	const [championshipsList, lastOngoingChampionshipIndex, err] = await getChampionshipsList(pb);

	if (err || !championshipsList || championshipsList.length === 0) {
		console.error('Error fetching championships: ', err);
		throw fail(500);
	}

	let championshipsIdsWithOnAirEvents: string[] = [];
	try {
		const liveEvents = await pb.collection('events').getFullList({
			filter: 'onAir = true'
		});

		championshipsIdsWithOnAirEvents = [...new Set(liveEvents.flatMap((event) => event.championships))];
	} catch {
		// no onAir events
	}

	return { championshipsList, lastOngoingChampionshipIndex, championshipsIdsWithOnAirEvents };
};
