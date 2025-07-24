import type { PageServerLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase';
import type { ChampionshipNonExpand } from '$types/championship';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	const [championshipsList, err] = (await goCatch(pb.collection('championships').getFullList({ sort: '+startDate' }))) as [ChampionshipNonExpand[], undefined] | [undefined, Error];
	if (err || !championshipsList || championshipsList.length === 0) {
		console.error('Error fetching championships: ', err);
		throw fail(500)
	}
	const lastOngoingChampionshipIndex = championshipsList.findLastIndex((v) => { return v.ongoing })

	return { championshipsList, lastOngoingChampionshipIndex }
}