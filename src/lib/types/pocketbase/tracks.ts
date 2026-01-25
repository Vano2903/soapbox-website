export type TrackId = string;

export interface SurfaceInfo {
	dirt?: number;
	gravel?: number;
	pebble?: number;
	concrete?: number;
	asphalt?: number;
}

export function ToSurfaceArray(surface: SurfaceInfo | undefined): Array<{ name: string; value: number; percentage: number }> {
	const result: Array<{ name: string; value: number, percentage: number }> = [];
	if (!surface) {
		return result;
	}

	const totalSurface = (surface.asphalt ?? 0) + (surface.concrete ?? 0) + (surface.pebble ?? 0) + (surface.gravel ?? 0) + (surface.dirt ?? 0);
	if (surface.asphalt) result.push({ name: 'Asfalto', value: surface.asphalt, percentage: (surface.asphalt / totalSurface) * 100 });
	if (surface.concrete) result.push({ name: 'Cemento', value: surface.concrete, percentage: (surface.concrete / totalSurface) * 100 });
	if (surface.pebble) result.push({ name: 'Sampietrini', value: surface.pebble, percentage: (surface.pebble / totalSurface) * 100 });
	if (surface.gravel) result.push({ name: 'Ghiaia', value: surface.gravel, percentage: (surface.gravel / totalSurface) * 100 });
	if (surface.dirt) result.push({ name: 'Sterrato', value: surface.dirt, percentage: (surface.dirt / totalSurface) * 100 });
	return result;
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
	created: Date;
	updated: Date;
}