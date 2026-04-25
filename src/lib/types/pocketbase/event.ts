import type { StageId, Stage } from './stage';
import type { LocationId, Location } from './location';
import type { ResultId, Result } from './results';
import type { ChampionshipId, Championship } from './championship';
import type { TrackId, Track } from './tracks';
import type { EventNewsId, EventNews } from './eventNews';

export enum EventKind {
	Rally = 'rally'
}

export enum EventCategory {
	SoapBox = 'SoapBox',
	Pinocchio = 'Pinocchio',
	Trike = 'Trike',
	Junior = 'Junior',
	Other = 'Altro'
}

export enum EventLeaderboard {
	Creativity = 'Creatività',
	Technical = 'Tecnica',
	Audience = 'Pubblico',
	Originality = 'Originalità',
	PreStage = 'Pre-Stage',
	Stage1 = 'Stage 1',
	Stage2 = 'Stage 2',
	Speed = 'Finale Velocità',
	Final = 'Gran Combinata'
}

export type EventAvailableLeaderboards = Partial<Record<EventCategory, EventLeaderboard[]>>;

export type EventId = string;
export interface EventBase {
	id: EventId;
	name: string;
	shortName: string;
	kind: EventKind;
	startDate?: Date;
	endDate?: Date;
	stages?: StageId[];
	location: LocationId;
	track?: TrackId;
	numSubscriptions: number;
	maxSubscriptions: number | null;
	availableLeaderboards: EventAvailableLeaderboards;
	subscriptionsOpen: boolean;
	onAir: boolean;
	news?: EventNewsId[];
	results: ResultId[];
	cover?: string;
	poster?: string;
	regulation?: string;
	map?: string;
	championship: ChampionshipId;
	created: Date;
	updated: Date;
}

export interface EventExpand extends EventBase {
	isExpand: true;
	expand: {
		stages: Stage[];
		location: Location;
		track: Track;
		results: Result[];
		championship: Championship;
		news?: EventNews[];
	};
}

export interface EventNonExpand extends EventBase {
	isExpand: false;
	expand: undefined;
}

export type Event = EventNonExpand | EventExpand;

// Below are the data structures used "statically" on other pages, retained to prevent errors from occurring throughout the site.
// With the database integration on those pages, these data structures must be removed.
// In the meanwhile, a function toEventDataType is provided to convert the Event type to the EventDataType type, if possible.

export function toEventInfoType(event: Event | undefined): EventInfoType {
	return {
		id: event?.id ?? '',
		kind: OldEventKind.NextEventKind,
		date: new Date(event?.startDate ?? ''),
		header: `Campionato ${new Date(event?.startDate ?? '').getFullYear()}`,
		title: event?.name ?? 'Evento sconosciuto',
		totalSubscriptions: event?.maxSubscriptions ?? 100,
		currentSubscriptions: event?.numSubscriptions ?? 0,
		isSubscriptionOpen: event?.subscriptionsOpen ?? false,
		isSubscribed: false // This field is not used in the current context
	};
}

export enum OldEventKind {
	NextEventKind = 'NextEventKind',
	HighlightKind = 'HighlightKind'
}

export type EventInfoType = {
	id: string;
	kind: OldEventKind;
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
};

export type YearDataType = {
	year: string;
	current: boolean;
	eventsList: string[];
};
