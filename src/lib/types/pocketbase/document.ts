export type DocumentId = string;

export enum DocumentCategory {
	Regulation = 'Regolamento',
	Module = 'Modulo',
	Comunication = 'Comunicazione',
	Investigation = 'Investigazione'
}

export interface Document {
	id: DocumentId;
	category: DocumentCategory;
	name: string;
	enabled: boolean;
	file: string;
	created: Date;
	updated: Date;
}