export type LocationId = string;

export interface Location {
	id: LocationId;
	name: string;
	description: string;
	city: string;
	province: string;
	provinceShort?: string;
	region: string;
	country: string;
	countryShort?: string;
	created: Date;
	updated: Date;
}