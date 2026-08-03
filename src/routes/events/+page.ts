import type { PageLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from '@sveltejs/kit';
import type { EventExpand } from '$types/pocketbase/event';
import type { EventParticipationExpand } from '$types/pocketbase/eventParticipation';
import { createAvatarUrl } from '$lib/utils/avatar';

export const load: PageLoad = async ({ data, url, fetch, parent }) => {
	console.log('Loading championships:\n > data = ', data, '\n > url = ', url);
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	// destructures the data received from the PageServerLoad and prepare the variables
	const { docsContent } = await parent();
	const { championshipsList } = data;

	// retrieve the selected championship or, if nullish, the last ongoingChampionship available
	const researchChampionshipIndex = championshipsList.findIndex((c: { name: string | null }) => {
		return c.name === url.searchParams.get('championship');
	});

	if (researchChampionshipIndex === -1 || !url.searchParams.get('championship')) {
		console.error('Error fetching championship: invalid or missing championship name');
		throw fail(404);
	}

	// retrieve the ChampionshipExpand version (with full event list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb
			.collection('championships')
			.getFirstListItem(`id="${championshipsList.at(researchChampionshipIndex)?.id}"`, {
				fetch: fetch,
				expand: 'events'
			});
	} catch (err) {
		console.error('Championship not found: ', err);
		throw fail(500);
	}

	// retrieve the selected event or, if nullish, the first event that hasn't yet passed for the requested championship.
	const researchEventIndex = foundChampionship.expand.events.findIndex((e) => {
		return e.shortName === url.searchParams.get('event');
	});
	if (researchEventIndex === -1 || !url.searchParams.get('event')) {
		console.error('Error fetching event: invalid or missing event shortName');
		throw fail(404);
	}
	const researchedEvent = foundChampionship.expand.events.at(researchEventIndex);

	let foundEvent: EventExpand;
	if (researchedEvent) {
		try {
			foundEvent = await pb.collection('events').getFirstListItem(`id="${researchedEvent.id}"`, {
				fetch: fetch,
				expand: 'results,stages,location,track,news'
			});
		} catch (err) {
			console.error('Event not found: ', err);
			throw fail(500);
		}
	} else {
		console.error('Event not found: researchedEvent is undefined');
		throw fail(404);
	}

	if (foundEvent?.cover) {
		foundEvent.cover = pb.files.getURL(foundEvent, foundEvent.cover);
	}
	if (foundEvent?.poster) {
		foundEvent.poster = pb.files.getURL(foundEvent, foundEvent.poster);
	}
	if (foundEvent?.regulation) {
		foundEvent.regulation = pb.files.getURL(foundEvent, foundEvent.regulation);
	}
	if (foundEvent?.map) {
		foundEvent.map = pb.files.getURL(foundEvent, foundEvent.map);
	}

	// retrieve the event participations
	let eventParticipations: EventParticipationExpand[];
	try {
		eventParticipations = await pb.collection('eventParticipations').getFullList({
			fetch: fetch,
			filter: `event="${foundEvent.id}"`,
			expand: 'team,participants'
		});
	} catch (err) {
		console.error('Event participations not found: ', err);
		throw fail(500);
	}

	eventParticipations = eventParticipations
		.filter((ep) => !!ep.expand.team)
		.map((ep) => {
			ep.expand.team.logoCropped =
				pb.files.getURL(ep.expand.team, ep.expand.team.logoCropped || '') ||
				createAvatarUrl(ep.expand.team.slug, 'small');

			ep.expand.team.bannerCropped =
				pb.files.getURL(ep.expand.team, ep.expand.team.bannerCropped || '') || undefined;
			return ep;
		});

	return {
		championshipsList,
		foundChampionship,
		foundEvent,
		eventParticipations,
		contextualHelps: docsContent.contextualHelps
	};
};
