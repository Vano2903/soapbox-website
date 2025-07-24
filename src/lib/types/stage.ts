import type { EventId } from './event'

export type StageId = string;

export interface Stage {
	id: StageId;
	name: string;
	description: string;
	event: EventId;
	created: Date;
	updated: Date;
}