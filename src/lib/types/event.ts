import type { StageId, Stage } from './stage'
import type { LocationId, Location } from './location'

export enum EventKind {
	NextEventKind = 'NextEventKind',
	HighlightKind = 'HighlightKind'
}

export type EventId = string;

export interface EventBase {
	id: EventId;
	name: string;
	shortName: string;
	kind: EventKind;
	date: Date;
	stages: StageId[];
	location: LocationId;
	numSubscriptions: number;
	maxSubscriptions: number | null;
	subscriptionsOpen: boolean;
	onAir: boolean;
	created: Date;
	updated: Date;
}

export interface EventExpand extends EventBase {
	isExpand: true;
	expand: {
		stages: Stage[];
		location: Location;
	}
}

export interface EventNonExpand extends EventBase {
	isExpand: false;
	expand: undefined;
}

export type Event = EventNonExpand | EventExpand;

// Below are the data structures used "statically" on other pages, retained to prevent errors from occurring throughout the site.
// With the database integration on those pages, these data structures must be removed.

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
	shortName: string;
	fullName: string;
	isOnAir: boolean;
}

export type YearDataType = {
	year: string,
	current: boolean,
	eventsList: string[]
}