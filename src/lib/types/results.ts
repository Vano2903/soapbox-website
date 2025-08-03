import type { EventId, Event } from "./event";

export type ResultId = string;
export interface ResultBase {
	id: ResultId;
	name: string;
	leaderboard: string;
	event?: EventId[];
	created: Date;
	updated: Date;
}

export interface ResultExpand extends ResultBase {
	isExpand: true;
	expand: {
		event: Event;
	}
}

export interface ResultNonExpand extends ResultBase {
	isExpand: false;
	expand: undefined;
}

export type Result = ResultNonExpand | ResultExpand;