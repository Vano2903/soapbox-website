export type TrackId = string;

export interface SurfaceInfo {
	dirt?: number;
	gravel?: number;
	pebble?: number;
	concrete?: number;
	asphalt?: number;
}

export interface CoordinatesInfo {
	lon?: number;
	lat?: number;
}

export interface Track {
	id: TrackId;
	name: string;
	length: number;
	maxIncline: number;
	minIncline: number;
	startingAltitude: number;
	arrivalAltitude: number;
	differenceAltitude: number;
	maxAltitude: number;
	minAltitude: number;
	rightTurns: number;
	leftTurns: number;
	surfaces?: SurfaceInfo;
	coordinates?: CoordinatesInfo;
	created: Date;
	updated: Date;
}