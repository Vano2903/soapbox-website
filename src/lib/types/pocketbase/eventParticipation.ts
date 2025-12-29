import type { EventId, Event } from './event'
import type { Team } from './team'
import type { UserId, Person } from './user'

export enum CategoryKind {
	DriftTrike = 'Drift Trike',
	SoapBox = 'SoapBox',
}

export type EventParticipationId = string;
export interface EventParticipationBase {
	id: EventParticipationId;
	event: EventId;
	team: string;
	category: CategoryKind;
	participants: UserId[];
	teamNameAlias: string;
	notes: string;
	created: Date;
	updated: Date;
}

export interface EventParticipationExpand extends EventParticipationBase {
	isExpand: true;
	expand: {
		event: Event;
		team: Team;
		participants: Person[];
	}
}

export interface EventParticipationNonExpand extends EventParticipationBase {
	isExpand: false;
	expand: undefined;
}

export type EventParticipation = EventParticipationNonExpand | EventParticipationExpand;