import type { EventId, Event } from './event'

export enum StageKind {
	Sealing = 'sealing',
	Exhibition = 'exhibition',
	Stage = 'stage',
	SpecialStage = 'special stage'
}

export type StageId = string;
export interface StageBase {
	id: StageId;
	name: string;
	description?: string;
	kind: StageKind;
	startTime?: Date;
	onAir: boolean;
	event?: EventId;
	created: Date;
	updated: Date;
}
export interface StageExpand extends StageBase {
	isExpand: true;
	expand: {
		event: Event;
	}
}
export interface StageNonExpand extends StageBase {
	isExpand: false;
	expand: undefined;
}

export type Stage = StageNonExpand | StageExpand;