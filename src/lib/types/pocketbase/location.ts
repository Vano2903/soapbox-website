export type LocationId = string;

export interface Location {
	id: LocationId;
	name: string;
	description: string;
	city: string;
	province: string;
	region: string;
	country: string;
	created: Date;
	updated: Date;
}