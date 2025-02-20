import type { PageLoad } from './$types';
import type { NewRaceType } from '$lib/types/newRace';

export const load: PageLoad = async (): Promise<{ NextRace: NewRaceType }> => {
	const NextRaceType = {
		date: new Date(2024, 2, 24, 14),
		header: 'Campionato 2024',
		title: '11° Cinghial Box Rally',
		totalSubscriptions: 48,
		currentSubscriptions: 24
	} as NewRaceType;
	return { NextRace: NextRaceType };
};
