import type { PageLoad } from "./$types";

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$tsTypes/pocketbase';
import type { ChampionshipExpand } from '$tsTypes/championship';
import { fail } from "@sveltejs/kit";

export const load: PageLoad = async ({ data, url }) => {
	console.log('Loading championships:\n > data = ', data, '\n > url = ', url);

	// destructures the data received from the PageServerLoad and prepare the variables
	const { championshipsList, lastOngoingChampionshipIndex } = data;
	const warnings: string[] = [];

	// retrieve the selected championship or, if nullish, the last ongoingChampionship available
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;
	const requestedChampionshipIndex = championshipsList.findIndex((v: { name: string | null; }) => { return (v.name === url.searchParams.get('championship')) });

	if (requestedChampionshipIndex === -1 && url.searchParams.get('championship')) {
		warnings.push(`Il campionato "${url.searchParams.get('championship')}" non è stato trovato.`);
	}
	const researchChampionshipIndex = (requestedChampionshipIndex !== -1 ? requestedChampionshipIndex : lastOngoingChampionshipIndex);

	// retrieve the ChampionshipExpand version (with full event list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb.collection('championships').getFirstListItem(`id="${championshipsList.at(researchChampionshipIndex)?.id}"`, { expand: 'events' });
	} catch (err) {
		console.error('Championship not found: ', err);
		throw fail(500)
	}

	// retrieve the selected event or, if nullish, the last event available for the requested championship.
	const requestedEventIndex = foundChampionship.expand.events.findIndex((v) => { return (v.shortName === url.searchParams.get('event')) });
	if (requestedEventIndex === -1 && url.searchParams.get('event')) {
		warnings.push(`L'evento "${url.searchParams.get('event')}" non esiste per il campionato "${url.searchParams.get('championship')}".`);
	}
	const researchEventIndex = requestedEventIndex;
	const foundEvent = foundChampionship.expand.events.at(researchEventIndex);

	// console.log('[+page.ts] >> championshipsList = ', championshipsList);
	// console.log('[+page.ts] >> foundChampionship = ', foundChampionship);
	// console.log('[+page.ts] >> foundEvent = ', foundEvent);
	// console.log('[+page.ts] >> warnings = ', warnings);

	return { championshipsList, foundChampionship, foundEvent, warnings }
};