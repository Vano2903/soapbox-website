import type { TypedPocketBase } from '$lib/types/pocketbase';
import type { User } from '$lib/types/user';

declare global {
	async function goCatch<T, E extends new (message?: string) => Error>(
		promise: Promise<T>,
		errorsToCatch?: E[] | E
	): Promise<[T, undefined] | [undefined, InstanceType<E>]>;

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
