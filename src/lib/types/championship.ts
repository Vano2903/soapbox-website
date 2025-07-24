import type { EventId, EventNonExpand } from './event'

export type ChampionshipId = string;

export interface ChampionshipBase {
	id: ChampionshipId;
	name: string; //unique
	description: string;
	startDate: Date;
	endDate: Date;
	ongoing: boolean;
	events: EventId[];
	created: Date;
	updated: Date;
}

export interface ChampionshipExpand extends ChampionshipBase {
	isExpand: true;
	expand: { events: EventNonExpand[] };
}

export interface ChampionshipNonExpand extends ChampionshipBase {
	isExpand: false;
	expand: undefined;
}

export type Championship = ChampionshipNonExpand | ChampionshipExpand;