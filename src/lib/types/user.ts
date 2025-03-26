// export type IsoDateString = string;

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
	lastName: string;
	roles: Roles[];
	banned: boolean;
	created: Date;
	updated: Date;
	avatar?: string;
	completed: boolean;
	nick: string;
	fiscalCode: string;
	phone: string;
	gender: GenderKind;
	birthDate: Date;
}

// type User = {
// 	id: string;
// 	email: string;
// 	emailVisibiliy?: boolean;
// 	verified: boolean;
// 	name: string;
// 	roles: Roles[];
// 	banned: boolean;
// 	created: string;
// 	updated: string;
// 	avatar?: string;
// 	completed: boolean;
// 	nick: string;
// 	fiscalCode: string; // redacted
// 	phone: string;
// 	gender: GenderKind;
// 	birthDate: Date;
// };

export enum GenderKind {
	Male = 'male',
	Female = 'female',
	Other = 'other',
	NotDisclosed = 'not-disclosed'
}
