import type { User } from './user';

export type Team = {
	id: string;
	slug: string;
	name: string;
	description: string;
	number: number;
	created: Date;
	updated: Date;
	expanded: boolean; // if expanded it means that members is of type User[]
	// if not expanded it means that members is of type string[]
	members: string[] | User[];
	owner: string | User;
	logo?: string;
	banner?: string;
};

export type TeamInvitation = {
	team: string | Team;
	// max number of users that can join the team with this invatation, -1 for unlimited
	uses: number;
	expiration: Date;
	expanded: boolean;
	joined?: string[] | User[];
	//can de disabled by the user and it's equivalent to deleting the invitation
	// it will be marked as disabled when the expiration date is reached or
	// when the joined users are equal to the uses
	disabled: boolean;

	created: Date;
	updated: Date;
};
