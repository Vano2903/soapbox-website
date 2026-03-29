export interface ContextualHelp {
	name: string;
	shortContent: string;
	longContent: string;
	docReference: string;
}

export type ContextualHelps = Record<string, ContextualHelp>;
