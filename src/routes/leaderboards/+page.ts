import type { PageLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from '@sveltejs/kit';
import type { Result } from '$types/pocketbase/results';

export const load: PageLoad = async ({ data, url, fetch, parent }) => {
	console.log('Loading championships:\n > data = ', data, '\n > url = ', url);
	const warnings: string[] = [];
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	// destructures the data received from the PageServerLoad and prepare the variables
	const { docsContent } = await parent();
	const { championshipsList, lastOngoingChampionshipIndex } = data;

	// retrieve the selected championship or, if nullish, the last ongoingChampionship available
	const requestedChampionshipIndex = championshipsList.findIndex((c: { name: string | null }) => {
		return c.name === url.searchParams.get('championship');
	});

	if (requestedChampionshipIndex === -1 && url.searchParams.get('championship')) {
		const searchedChampionship = Number(url.searchParams.get('championship'));
		if (Number(championshipsList.at(lastOngoingChampionshipIndex)?.name) < searchedChampionship) {
			warnings.push(
				`Il campionato "${url.searchParams.get('championship')}" non è ancora iniziato.`
			);
		} else {
			warnings.push(`Il campionato "${url.searchParams.get('championship')}" non è stato trovato.`);
		}
	}

	const researchChampionshipIndex =
		requestedChampionshipIndex !== -1 ? requestedChampionshipIndex : lastOngoingChampionshipIndex;

	// retrieve the ChampionshipExpand version (with full event list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb
			.collection('championships')
			.getFirstListItem(`id="${championshipsList.at(researchChampionshipIndex)?.id}"`, {
				expand: 'events'
				// fetch: fetch
			});
	} catch (err) {
		console.error('Championship not found: ', err);
		throw fail(500);
	}

	// retrieve the selected event or, if nullish, the first event that hasn't yet passed for the requested championship.
	let requestedEventIndex = foundChampionship.expand.events.findIndex((e) => {
		return e.shortName === url.searchParams.get('event');
	});
	if (requestedEventIndex === -1) {
		if (url.searchParams.get('event')) {
			warnings.push(
				`L'evento "${url.searchParams.get('event')}" non esiste per il campionato "${url.searchParams.get('championship') || championshipsList.at(researchChampionshipIndex)?.name}".`
			);
		}
		requestedEventIndex = foundChampionship.expand.events.findIndex((e) => {
			return new Date().valueOf() < new Date(e.startDate).valueOf();
		});
	}
	const researchEventIndex = requestedEventIndex;
	const foundEvent = foundChampionship.expand.events.at(researchEventIndex);

	let responseEventResults: Result[] | undefined;
	if (foundEvent && foundEvent.results.length > 0) {
		try {
			const expandedEvent = await pb
				.collection('events')
				.getFirstListItem(`id="${foundEvent.id}"`, {
					expand: 'results'
					// , fetch: fetch
				});
			responseEventResults = expandedEvent.expand?.results;
		} catch (err) {
			console.error('Event not found: ', err);
			throw fail(500);
		}
	}

	let eventResults;
	if (responseEventResults) {
		eventResults = responseEventResults.map((result) => {
			return {
				publicUrl: pb.files.getURL(result, result.leaderboard),
				data: {
					...result,
					formattedCreated: new Date(result.created).toLocaleDateString('it-IT', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit'
					}),
					formattedUpdated: new Date(result.updated).toLocaleDateString('it-IT', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			};
		});
	}

	return {
		championshipsList,
		foundChampionship,
		foundEvent,
		eventResults,
		warnings,
		contextualHelps: docsContent.contextualHelps
	};
};
