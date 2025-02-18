import type { PositionType } from "$lib/types/championships/utils"

export type ChampionshipLeaderboardType = {
	year: number
	header: ChampionshipHeaderType[]
	rows: ChampionshipRowType[]
}

export type ChampionshipHeaderType = {
	title: string
	subtitle: string
}

export type ChampionshipRowType = {
	position: PositionType
	teamId: number
	teamNumber: number
	teamName: string
	results: EventResultType[]
	totalResult: number
}

export type EventResultType = {
	performed: boolean
	points: number | null
	position: PositionType
}