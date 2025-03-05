export type PositionType = {
	status: string
	value: number | null
}

export enum ResultStatusType {
	CLASSIFIED = "CLS", // Classified
	DID_NOT_START = "DNS", // Did Not Start
	DID_NOT_FINISH = "DNF", // Did Not Finish
	NOT_CLASSIFIED = "NC", // Not Classified
}

export enum StageKindType {
	SHOWDOWN = "SHOW", // Showdown
	STAGE = "REGS", // Regular Stage
	SPECIAL_STAGE = "SPCS", // Special Stage
}