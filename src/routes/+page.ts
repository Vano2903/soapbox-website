import type { PageLoad } from './$types';
import { EventKind, type EventInfoType } from '$lib/types/event';
import type { OrganizationStatType } from '$lib/types/organizationStat';

export const load: PageLoad = async (): Promise<{ eventInfo: EventInfoType; organizationStats: OrganizationStatType[]; }> => {
	const eventInfo = {
		id: '2025-7',
		kind: EventKind.NextEventKind,
		date: new Date(2025, 7, 27, 14, 30),
		header: 'Campionato 2025',
		title: '3° Soap BoXXico Rally',
		totalSubscriptions: 48,
		currentSubscriptions: 24
	} as EventInfoType;

	const organizationStats = [
		{ value: 982, subject: 'curve', context: 'affrontate' },
		{ value: 157, subject: 'eventi', context: 'organizzati' },
		{ value: 634, subject: 'trofei', context: 'consegnati' }
	] as OrganizationStatType[];

	return { eventInfo, organizationStats }
};