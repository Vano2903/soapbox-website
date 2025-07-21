import type { User } from './user';

interface TeamBase {
	id: string;
	slug: string;
	name: string;
	description: string;
	number: number;
	created: Date;
	updated: Date;
	members: string[];
	owner: string;
	logo?: string;
	logoCropped?: string;
	logoCrop?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
	banner?: string;
	bannerCropped?: string;
	bannerCrop?: {
		x: number;
		y: number;
		width: number;
		height: number;
	};
}

export interface TeamNonexpand extends TeamBase {
	isexpand?: false;
	expand?: undefined;
}

export interface TeamExpand extends TeamBase {
	isexpand: true;
	expand: { members: User[]; owner: User };
}

export type Team = TeamExpand | TeamNonexpand;

interface TeamInvitationBase {
	code: string; // unique code for the invitation

	team: string | Team;
	// max number of users that can join the team with this invatation, -1 for unlimited
	uses: number;
	expiration: Date;
	joined: string[]; //ids of the users that have joined the team with this invitation

	// can de disabled by the user and it's equivalent to deleting the invitation
	// it will be marked as disabled when the expiration date is reached or
	// when the joined users are equal to the uses
	disabled: boolean;

	created: Date;
	updated: Date;
}

export interface TeamInvitationExpand extends TeamInvitationBase {
	isexpand: true;
	expand: { joined: User[]; team: Team };
}

export interface TeamInvitationNonExpand extends TeamInvitationBase {
	isexpand: false;
	expand: undefined;
}

export type TeamInvitation = TeamInvitationExpand | TeamInvitationNonExpand;
