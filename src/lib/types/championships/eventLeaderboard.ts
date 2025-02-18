import type { PositionType } from "$lib/types/championships/utils"

export type EventLeaderboardType = {
	race: string
	header: EventHeaderType[]
	rows: EventRowType[]
}

export type EventHeaderType = {
	title: string
	subtitle: string
}

export type EventRowType = {
	position: PositionType
	teamId: number
	teamNumber: number
	teamName: string
	results: StageResultType[]
	totalResult: number
}

export type StageResultType = {
	performed: boolean
	raceTime: string | null
	penalties: string | null
	finalTime: string | null
	finalPosition: PositionType
}