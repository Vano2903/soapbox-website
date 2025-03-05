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
	result: ShowdownResultType | StageResultType
}

export type ShowdownResultType = {
	performed: boolean
	status: ResultStatusType
	points: number | null
	position: PositionType
}

export type StageResultType = {
	performed: boolean
	status: ResultStatusType
	raceTime: string | null
	penalties: string | null
	finalTime: string | null
	finalPosition: PositionType
}