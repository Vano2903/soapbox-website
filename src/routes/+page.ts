import type { PageLoad } from './$types';
import type { EventType } from '$lib/types/newRace';
import { EventKind } from '$lib/types/newRace';
import type { OrganizationStatType } from '$lib/types/organizationStat';

export const load: PageLoad = async (): Promise<{ eventInfo: EventType; organizationStats: OrganizationStatType[]; }> => {
	const eventInfo = {
		kind: EventKind.HighlightKind,
		date: new Date(2024, 2, 24, 14),
		header: 'Campionato 2024',
		title: '11° Cinghial Box Rally',
		totalSubscriptions: 48,
		currentSubscriptions: 24
	} as EventType;

	const organizationStats = [
		{ value: 982, subject: 'curve', context: 'affrontate' },
		{ value: 157, subject: 'eventi', context: 'organizzati' },
		{ value: 634, subject: 'trofei', context: 'consegnati' }
	] as OrganizationStatType[];

	return { eventInfo, organizationStats }
};