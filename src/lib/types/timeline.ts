export type TimelineType = {
	items: TimelineItemType[];
	prefix?: TimelineExtensionType;
	postfix?: TimelineExtensionType;
};

export type TimelineItemType = {
	year: string;
	content: string;
	active: boolean;
	preActive: boolean;
	postActive: boolean;
};

export type TimelineExtensionType = {
	style: "solid" | "dashed" | "dotted" | "double";
	color: string;
	length: 1 | 2;
}