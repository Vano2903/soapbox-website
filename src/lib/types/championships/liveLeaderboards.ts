import type { PositionType, ResultStatusType } from '$lib/types/championships/utils';

export type LiveLeaderboardsType = {
	event: LiveEventLeaderboardType;
	championship: LiveChampionshipLeaderboardType;
};

export type LiveEventLeaderboardType = {
	race: string;
	stage: string;
	rows: LiveEventRowType[];
};

export type LiveEventRowType = {
	position: PositionType;
	status: ResultStatusType;
	teamId: number;
	teamNumber: number;
	teamName: string;
	// halftimes: HalftimeType[]
	penalties: string | null;
	finalTime: string | null;
	deltaTime: string | null;
};

export type LiveChampionshipLeaderboardType = {
	year: number;
	rows: LiveChampionshipRowType[];
};

export type LiveChampionshipRowType = {
	position: PositionType;
	status: ResultStatusType;
	positionGain: number | null;
	teamId: number;
	teamNumber: number;
	teamName: string;
	points: number;
	pointsGain: number | null;
};
