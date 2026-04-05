export interface ContextualHelp {
	location: string;
	name: string;
	shortContent: string;
	longContent: string;
	docReference: string;
}

export type ContextualHelps = Record<string, ContextualHelp>;
