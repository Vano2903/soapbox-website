import type { TypedPocketBase } from '$lib/types/pocketbase';
import type { User } from '$lib/types/user';

declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
		interface Locals {
			pb: TypedPocketBase;
			user: User | undefined;
		}
	}
}

export {};
