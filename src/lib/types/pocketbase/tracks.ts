import type { StageId, Stage } from "./stage";

export type TrackId = string;

export interface SurfaceInfo {
	dirt?: number;
	gravel?: number;
	pebble?: number;
	concrete?: number;
	asphalt?: number;
}

export interface TrackBase {
	id: TrackId;
	name: string;
	length: number;
	maxIncline: number;
	minIncline: number;
	startingAltitude: number;
	arrivalAltitude: number;
	differenceAltitude: number;
	rightTurns: number;
	leftTurns: number;
	surface?: SurfaceInfo;
	stages?: StageId[];
	created: Date;
	updated: Date;
}

export interface TrackExpand extends TrackBase {
	isExpand: true;
	expand: {
		stages: Stage[];
	}
}

export interface TrackNonExpand extends TrackBase {
	isExpand: false;
	expand: undefined;
}

export type Track = TrackNonExpand | TrackExpand;