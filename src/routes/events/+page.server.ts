import type { PageServerLoad } from './$types';
import { fail } from '@sveltejs/kit';
import { getChampionshipsList } from '$lib/utils/pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	const pb = locals.pb;
	const user = locals.user;
	const [championshipsList, lastOngoingChampionshipIndex, err] = await getChampionshipsList(pb);

	if (err || !championshipsList || championshipsList.length === 0) {
		console.error('Error fetching championships: ', err);
		throw fail(500);
	}

	return { championshipsList, lastOngoingChampionshipIndex, user };
};
