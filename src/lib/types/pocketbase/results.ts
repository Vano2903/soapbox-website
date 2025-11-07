import type { EventId, Event } from './event';

export enum LeaderboardType {
	Stage = 'Stage',
	Event = 'Event',
	Championship = 'Championship'
}

export enum CategoryType {
	SoapBox = 'SoapBox',
	DriftTrike = 'DriftTrike'
}

export type ResultId = string;
export interface ResultBase {
	id: ResultId;
	shortName: string;
	name: string;
	leaderboardType: LeaderboardType;
	categoryType: CategoryType;
	leaderboard: string;
	event?: EventId[];
	created: Date;
	updated: Date;
}

export interface ResultExpand extends ResultBase {
	isExpand: true;
	expand: {
		event: Event;
	};
}

export interface ResultNonExpand extends ResultBase {
	isExpand: false;
	expand: undefined;
}

export type Result = ResultNonExpand | ResultExpand;
