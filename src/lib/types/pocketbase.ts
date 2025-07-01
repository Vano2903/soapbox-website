import PocketBase, { type RecordService } from 'pocketbase';
import type { User } from '$lib/types/user';
import type { Team, TeamInvitation } from './team';

export interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService;
	collection(idOrName: 'users'): RecordService<User>;
	collection(idOrName: 'publicUserInfo'): RecordService<UserPublicInfo>;
	collection(idOrName: 'teams'): RecordService<Team>;
	collection(idOrName: 'teamInvitations'): RecordService<TeamInvitation>;
}
