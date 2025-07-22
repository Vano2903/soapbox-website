export enum EventKind {
	NextEventKind = 'NextEventKind',
	HighlightKind = 'HighlightKind'
}

export type EventInfoType = {
	id: string;
	kind: EventKind;
	date: Date;
	header: string;
	title: string;
	totalSubscriptions: number;
	currentSubscriptions: number;
	isSubscriptionOpen: boolean;
	isSubscribed: boolean; //unused - and should not used
};

export type EventDataType = {
	id: string;
	date: Date;
	championship: string;
	city: string;
	name: string;
	isOnAir: boolean;
	onAirURL: string | null;
}

export type YearDataType = {
	year: string,
	current: boolean,
	eventsList: string[]
}