import type { PageServerLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async () => {
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	const [currentChampionship, err] = (await goCatch(
		pb
			.collection('championships')
			.getFirstListItem('ongoing=true', { sort: '-startDate', expand: 'events' })
	)) as [ChampionshipExpand, undefined] | [undefined, Error];
	if (err || !currentChampionship) {
		console.error('Error fetching championship: ', err);
		throw fail(500);
	}
	console.log(currentChampionship);

	currentChampionship.expand.events.sort((a, b) => {
		let cmp = 0;
		if (new Date(a.startDate) < new Date(b.startDate)) cmp = -1;
		else if (new Date(a.startDate) > new Date(b.startDate)) cmp = +1;
		return cmp;
	});
	const nextEventIndex = currentChampionship.expand.events.findIndex((e) => {
		return new Date().valueOf() < new Date(e.startDate).valueOf();
	});
	console.log(
		'events.at(' + nextEventIndex + ') = ' + currentChampionship.expand.events.at(nextEventIndex)
	);

	return { currentChampionship, nextEventIndex };
};
