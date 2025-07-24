import PocketBase, { type RecordService } from 'pocketbase';
import type { User, UserPublicInfo } from '$lib/types/user';
import type { Team, TeamInvitation } from './team';
import type { Championship } from './championship';
import type { Event } from './event';
import type { Stage } from './stage';
import type { Location } from './location';

export interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService;
	collection(idOrName: 'users'): RecordService<User>;
	collection(idOrName: 'publicUserInfo'): RecordService<UserPublicInfo>;
	collection(idOrName: 'teams'): RecordService<Team>;
	collection(idOrName: 'teamInvitations'): RecordService<TeamInvitation>;
	collection(idOrName: 'championships'): RecordService<Championship>;
	collection(idOrName: 'events'): RecordService<Event>;
	collection(idOrName: 'stages'): RecordService<Stage>;
	collection(idOrName: 'locations'): RecordService<Location>;
}
