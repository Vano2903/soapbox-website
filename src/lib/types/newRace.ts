export enum EventKind {
	NextEventKind = 'NextEventKind',
	HighlightKind = 'HighlightKind'
}

export type EventType = {
	id: string;
	kind: EventKind;
	date: Date;
	header: string;
	title: string;
	totalSubscriptions: number;
	currentSubscriptions: number;
	isSubscriptionOpen: boolean;
	isSubscribed: boolean;
};
