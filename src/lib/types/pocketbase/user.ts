// export type IsoDateString = string;

export enum Roles {
	User = 'user',
	Admin = 'admin'
}

export type UserId = string;

export interface CropInfo {
	x: number;
	y: number;
	width: number;
	height: number;
}

export interface UserBase {
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
	avatarCropped?: string;
	avatarCrop: CropInfo;
	banner?: string;
	bannerCropped?: string;
	bannerCrop: CropInfo;
	completed: boolean;
	nick: string;
	visibilty: UserVisiblityKind;
	fiscalCode: string;
	person: UserId;
	phone: string;
	gender: GenderKind;
	birthDate: Date;
	bio: string;
}

export interface UserPublicInfo {
	id: UserId;
	name: string;
	lastName: string;
	avatarCropped?: string;
	bannerCropped?: string;
	bio: string;
	nick: string;
	visibilty: UserVisiblityKind;
	person: UserId;
}

export interface Person {
	id: UserId;
	name: string;
	lastName: string;
	email: string;
	user: string;
	created: Date;
	updated: Date;
}
export interface UserExpand extends UserBase {
	isexpand: true;
	expand: { person: Person };
}

export interface UserNonExpand extends UserBase {
	isexpand: false;
	expand: undefined;
}

export type User = UserNonExpand | UserExpand;

export enum UserVisiblityKind {
	Public = 'public',
	Private = 'private'
}

export enum GenderKind {
	Male = 'male',
	Female = 'female',
	Other = 'other',
	NotDisclosed = 'not-disclosed'
}
