import type { PageLoad } from "./$types";

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from "@sveltejs/kit";

export const load: PageLoad = async ({ data, url }) => {
	console.log('Loading enroll:\n > data = ', data, '\n > url = ', url);

	if (!url.searchParams.get('championship') || !url.searchParams.get('event')) {
		console.error('Championship and Event must be specified during enrollment');
		throw fail(500)
	}

	// retrieve the selected ChampionshipExpand version (with full event list)
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb.collection('championships').getFirstListItem(`name="${url.searchParams.get('championship')}"`, { expand: 'events' });
	} catch (err) {
		console.error('Championship not found: ', err);
		throw fail(500)
	}

	// retrieve the selected event or, if nullish, the first event that hasn't yet passed for the requested championship.
	const foundEvent = foundChampionship.expand.events.find((e) => { return (e.shortName === url.searchParams.get('event')) });
	if (!foundEvent) {
		console.error(`Event not found for the championship ${url.searchParams.get('championship')}: `);
		throw fail(500)
	}

	return { ...data, foundChampionship, foundEvent }
};