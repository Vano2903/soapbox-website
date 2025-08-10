import type { PageLoad } from "./$types";

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from "@sveltejs/kit";
// import type { Result } from "$types/pocketbase/results";

export const load: PageLoad = async ({ data, url }) => {
	console.log('Loading calendars:\n > data = ', data, '\n > url = ', url);

	// destructures the data received from the PageServerLoad and prepare the variables
	const { championshipsList, lastOngoingChampionshipIndex } = data;
	const warnings: string[] = [];

	// retrieve the selected championship or, if nullish, the last ongoingChampionship available
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;
	const requestedChampionshipIndex = championshipsList.findIndex((c: { name: string | null; }) => { return (c.name === url.searchParams.get('championship')) });

	if (requestedChampionshipIndex === -1 && url.searchParams.get('championship')) {
		warnings.push(`Il campionato "${url.searchParams.get('championship')}" non è stato trovato.`);
	}
	const researchChampionshipIndex = (requestedChampionshipIndex !== -1 ? requestedChampionshipIndex : lastOngoingChampionshipIndex);

	// retrieve the ChampionshipExpand version (with full events list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb.collection('championships').getFirstListItem(`id="${championshipsList.at(researchChampionshipIndex)?.id}"`, { expand: 'events,events.location' });
	} catch (err) {
		console.error('Championship not found: ', err);
		throw fail(500)
	}

	return { championshipsList, foundChampionship, warnings }
};