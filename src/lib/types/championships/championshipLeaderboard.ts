import type { PositionType, ResultStatusType } from "$lib/types/championships/utils"

export type ChampionshipLeaderboardType = {
	year: number
	headers: ChampionshipHeaderType[]
	rows: ChampionshipRowType[]
}

export type ChampionshipHeaderType = {
	eventTitle: string
	eventSubtitle: string
}

export type ChampionshipRowType = {
	position: PositionType
	teamId: number
	teamNumber: number
	teamName: string
	results: EventResultType[]
	totalPoints: number
}

export type EventResultType = {
	performed: boolean
	status: ResultStatusType
	points: number | null
	position: PositionType
}