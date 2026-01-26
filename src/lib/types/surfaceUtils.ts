import type { SurfaceInfo } from "./pocketbase/tracks";

export type SurfaceColor = string;

export const SurfaceColors = new Map<string, string>([
	['Asfalto', '#8a939e'],
	['Cemento', '#8b857b'],
	['Sampietrini', '#cac2b2'],
	['Ghiaia', '#d7d7d7'],
	['Sterrato', '#a89070']
]);

export type SurfaceInfoExpand = {
	name: string;
	meters: number;
	percentage: number;
	color: SurfaceColor;
}

export function ToSurfaceInfoExpandArray(surface: SurfaceInfo | undefined): Array<SurfaceInfoExpand> {
	const result: Array<SurfaceInfoExpand> = [];
	if (!surface) {
		return result;
	}

	const totalSurface = (surface.asphalt ?? 0) + (surface.concrete ?? 0) + (surface.pebble ?? 0) + (surface.gravel ?? 0) + (surface.dirt ?? 0);
	if (surface.asphalt) result.push({ name: 'Asfalto', meters: surface.asphalt, percentage: (surface.asphalt / totalSurface) * 100, color: SurfaceColors.get('Asfalto') ?? '#000000' });
	if (surface.concrete) result.push({ name: 'Cemento', meters: surface.concrete, percentage: (surface.concrete / totalSurface) * 100, color: SurfaceColors.get('Cemento') ?? '#000000' });
	if (surface.pebble) result.push({ name: 'Sampietrini', meters: surface.pebble, percentage: (surface.pebble / totalSurface) * 100, color: SurfaceColors.get('Sampietrini') ?? '#000000' });
	if (surface.gravel) result.push({ name: 'Ghiaia', meters: surface.gravel, percentage: (surface.gravel / totalSurface) * 100, color: SurfaceColors.get('Ghiaia') ?? '#000000' });
	if (surface.dirt) result.push({ name: 'Sterrato', meters: surface.dirt, percentage: (surface.dirt / totalSurface) * 100, color: SurfaceColors.get('Sterrato') ?? '#000000' });
	return result;
}