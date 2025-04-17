import PocketBase, { type RecordService } from 'pocketbase';
import type { User } from '$lib/types/user';
import type { Team } from './team';

export interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService; // default fallback for any other collection
	collection(idOrName: 'users'): RecordService<User>;
	collection(idOrName: 'usernames'): RecordService<{ id: string; username: string }>;
	collection(idOrName: 'teams'): RecordService<Team>;
	//   collection(idOrName: "activities"): RecordService<Activity>;
	//   collection(idOrName: "tickets"): RecordService<Ticket>;
	//   collection(idOrName: "registrations"): RecordService<Registration>;
}
