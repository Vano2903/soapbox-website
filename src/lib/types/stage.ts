import type { EventId, Event } from './event'
import type { TrackId, Track } from './tracks';

export enum StageKind {
	Exhibition = 'exhibition',
	Race = 'race'
}

export type StageId = string;
export interface StageBase {
	id: StageId;
	name: string;
	description: string;
	kind: StageKind;
	startTime: Date;
	trackId: TrackId;
	event: EventId;
	created: Date;
	updated: Date;
}

export interface StageExpand extends StageBase {
	isExpand: true;
	expand: {
		track: Track;
		event: Event;
	}
}

export interface StageNonExpand extends StageBase {
	isExpand: false;
	expand: undefined;
}

export type Stage = StageNonExpand | StageExpand;