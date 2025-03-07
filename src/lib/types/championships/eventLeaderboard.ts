import type { PositionType, StageKindType, ResultStatusType } from "$lib/types/championships/utils"

export type EventLeaderboardType = {
	event: string
	headers: EventHeaderType[]
	rows: EventRowType[]
}

export type EventHeaderType = {
	stageTitle: string
	stageSubtitle: string
}

export type EventRowType = {
	position: PositionType
	teamId: number
	teamNumber: number
	teamName: string
	results: EventResultType[]
	totalPoints: number
}

export type EventResultType = {
	kind: StageKindType
	performed: boolean
	status: ResultStatusType
	showdown: ShowdownResultType | null
	stage: StageResultType | null
}

export type ShowdownResultType = {
	points: number | null
	position: PositionType
}

export type StageResultType = {
	raceTime: string | null
	penalties: string | null
	finalTime: string | null
	position: PositionType
}