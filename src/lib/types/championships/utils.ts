export type PositionType = {
	status: string
	value: number | null
}

export enum ResultStatusType {
	FINISHED = "Finished",
	DNS = "Did Not Start",
	DNF = "Did Not Finish",
}