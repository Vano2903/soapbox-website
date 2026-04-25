export type EventNewsId = string;

export interface EventNews {
	id: EventNewsId;
	info: string;
	hidden: boolean;
	created: string;
	updated: string;
}
