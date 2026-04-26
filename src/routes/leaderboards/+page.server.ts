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

	let onAirEventId: string | null = null;
	try {
		const onAirEvent = await pb.collection('events').getFirstListItem('onAir = true');
		onAirEventId = onAirEvent.id;
	} catch {
		// no onAir event
	}

	return { championshipsList, lastOngoingChampionshipIndex, onAirEventId };
};
