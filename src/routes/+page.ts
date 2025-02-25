import type { PageLoad } from './$types';
import type { EventType } from '$lib/types/newRace';
import { EventKind } from '$lib/types/newRace';

export const load: PageLoad = async (): Promise<{ NextRace: EventType }> => {
	const NextRaceType = {
		kind: EventKind.NextEventKind,
		date: new Date(2024, 2, 24, 14),
		header: 'Campionato 2024',
		title: '11° Cinghial Box Rally',
		totalSubscriptions: 48,
		currentSubscriptions: 24
	} as EventType;
	return { NextRace: NextRaceType };
};
