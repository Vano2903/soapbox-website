import type { EventId, Event } from './event'
import type { DocumentId, Document } from './document';

export type ChampionshipId = string;

export interface ChampionshipBase {
	id: ChampionshipId;
	name: string; //unique
	description: string;
	startDate: Date;
	endDate: Date;
	ongoing: boolean;
	events: EventId[];
	documents: DocumentId[];
	created: Date;
	updated: Date;
}

export interface ChampionshipExpand extends ChampionshipBase {
	isExpand: true;
	expand: { events: Event[]; documents: Document[] };
}

export interface ChampionshipNonExpand extends ChampionshipBase {
	isExpand: false;
	expand: undefined;
}

export type Championship = ChampionshipNonExpand | ChampionshipExpand;