import type { PageLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from '@sveltejs/kit';
import type { Result } from '$types/pocketbase/results';
import { addDays } from '$lib/utils';
import { DefaultEventAvailableLeaderboards, ToEventAvailableCategoriesArray } from '$lib/utils/eventUtils';

export const load: PageLoad = async ({ data, url, fetch, parent }) => {
	console.log('Loading championships:\n > data = ', data, '\n > url = ', url);
	const warnings: string[] = [];
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	// destructures the data received from the PageServerLoad and prepare the variables
	const { docsContent } = await parent();
	const { championshipsList, lastOngoingChampionshipIndex, onAirEventId } = data;

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
		// Priority 1: currently on-air event (resolved server-side with auth)
		if (onAirEventId) {
			requestedEventIndex = foundChampionship.expand.events.findIndex((e) => e.id === onAirEventId);
		}
		// Priority 2: event that started within the last 2 days (same window as homepage)
		if (requestedEventIndex === -1) {
			requestedEventIndex = foundChampionship.expand.events.findIndex((e) => {
				return addDays(new Date(), -2).valueOf() < new Date(e.startDate ?? '').valueOf();
			});
		}
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

	if (foundEvent && ToEventAvailableCategoriesArray(foundEvent.availableLeaderboards).length === 0) {
		console.log(`Available leaderboards = `, foundEvent.availableLeaderboards);
		console.log(`Event "${foundEvent.shortName}" does not have availableLeaderboards configured, using default ones.`);
		foundEvent.availableLeaderboards = DefaultEventAvailableLeaderboards;
	}

	// retrieve the selected category or, if nullish, the first category available for the selected event.
	const availableCategories = ToEventAvailableCategoriesArray(foundEvent?.availableLeaderboards);
	let requestedCategoryIndex = availableCategories.findIndex((category) => {
		return category === url.searchParams.get('category')
	});
	if (requestedCategoryIndex === -1) {
		if (url.searchParams.get('category')) {
			warnings.push(
				`La categoria "${url.searchParams.get('category')}" non è disponibile per l'evento "${url.searchParams.get('event') || foundEvent?.shortName}".`
			);
		}
		requestedCategoryIndex = 0;
	}
	const foundCategory = availableCategories[requestedCategoryIndex];

	// retrieve the selected leaderboard or, if nullish, the first leaderboard available for the selected category.
	const availableLeaderboards = foundEvent?.availableLeaderboards?.[foundCategory];
	let requestedLeaderboardIndex = availableLeaderboards?.findIndex((leaderboard) => {
		return leaderboard === url.searchParams.get('leaderboard')
	}) ?? -1;
	if (requestedLeaderboardIndex === -1) {
		if (url.searchParams.get('leaderboard')) {
			warnings.push(
				`La classifica "${url.searchParams.get('leaderboard')}" non è disponibile per la categoria "${foundCategory}" dell'evento "${url.searchParams.get('event') || foundEvent?.shortName}".`
			);
		}
		requestedLeaderboardIndex = 0;
	}
	const foundLeaderboard = availableLeaderboards?.[requestedLeaderboardIndex];



	return {
		championshipsList,
		foundChampionship,
		foundEvent,
		eventResults,
		foundCategory,
		foundLeaderboard,
		warnings,
		contextualHelps: docsContent.contextualHelps
	};
};
