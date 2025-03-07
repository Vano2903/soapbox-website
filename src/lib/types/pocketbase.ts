import PocketBase, { type RecordService } from 'pocketbase';
import type { User } from '$lib/types/user';

export interface TypedPocketBase extends PocketBase {
	collection(idOrName: string): RecordService; // default fallback for any other collection
	collection(idOrName: 'users'): RecordService<User>;
	//   collection(idOrName: "activities"): RecordService<Activity>;
	//   collection(idOrName: "tickets"): RecordService<Ticket>;
	//   collection(idOrName: "registrations"): RecordService<Registration>;
}
