import type { User } from './user';

export type Team = {
	id: string;
	name: string;
	description: string;
	number: number;
	created: Date;
	updated: Date;
	members: string[] | User[];
	owner: string | User;
	logo?: string;
	banner?: string;
};
