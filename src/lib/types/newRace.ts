export enum EventKind {
	NextEventKind = 'NextEventKind',
	HighlightKind = 'HighlightKind'
}

export type EventType = {
	kind: EventKind;
	date: Date;
	header: string;
	title: string;
	totalSubscriptions: number;
	currentSubscriptions: number;
	isSubscriptionOpen: boolean;
	isSubscribed: boolean;
};
