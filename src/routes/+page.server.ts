import type { PageServerLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { resolveHomepageEventState, type HomepageEventState } from '$lib/utils/nextEvent';
import { createLogger } from '$lib/utils/logger';

const log = createLogger('homepage:load');

export type HomepageEventData = HomepageEventState & {
	currentChampionship: ChampionshipExpand | null;
};

export const load: PageServerLoad = async (): Promise<HomepageEventData> => {
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	const [currentChampionship, err] = (await goCatch(
		pb
			.collection('championships')
			.getFirstListItem('ongoing=true', { sort: '-startDate', expand: 'events' })
	)) as [ChampionshipExpand, undefined] | [undefined, Error];

	// No ongoing championship is a data state, not a crash: render the homepage
	// without the event box instead of a 500.
	if (err || !currentChampionship) {
		log.error(
			'no ongoing championship found (championships with ongoing=true); homepage renders without the event box',
			{ pbInstance: env.PUBLIC_PB_INSTANCE, error: err?.message ?? 'empty result' }
		);
		return { currentChampionship: null, nextEvent: null, previousEvent: null, enrollable: false };
	}

	const events = currentChampionship.expand?.events ?? [];
	log.info('ongoing championship loaded', {
		name: currentChampionship.name,
		events: events.length
	});

	if (events.length === 0) {
		log.warn(`championship "${currentChampionship.name}" has no events attached`);
	}

	const state = resolveHomepageEventState(currentChampionship);
	log.info('next-event state resolved', {
		nextEvent: state.nextEvent
			? `${state.nextEvent.shortName} (${state.nextEvent.startDate ?? 'no date'})`
			: 'none — season over',
		previousEvent: state.previousEvent?.shortName ?? 'none',
		enrollable: state.enrollable,
		subscriptionsOpen: state.nextEvent?.subscriptionsOpen ?? false,
		canceled: state.nextEvent?.canceled ?? false,
		subscriptions: state.nextEvent
			? `${state.nextEvent.numSubscriptions}/${state.nextEvent.maxSubscriptions || '∞'}`
			: 'n/a'
	});

	return { currentChampionship, ...state };
};
