export type DocumentId = string;

export enum DocumentKind {
	Regulation = 'regulation'
}

export interface Document {
	id: DocumentId;
	kind: DocumentKind;
	name: string;
	category: string;
	enabled: boolean;
	file: string;
	created: Date;
	updated: Date;
}