export type IsoDateString = string;

export enum Roles {
	User = 'user',
	Admin = 'admin'
}

export type UserId = string;

export interface User {
	id: UserId;
	email: string;
	emailVisibiliy?: boolean;
	verified: boolean;
	name: string;
	roles: Roles[];
	banned: boolean;
	created: IsoDateString;
	updated: IsoDateString;
	avatar?: string;
}
