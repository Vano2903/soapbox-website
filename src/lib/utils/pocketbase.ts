import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/pocketbase';

export const createPocketBaseInstance = (instanceUrl: string): TypedPocketBase => {
	if (!instanceUrl) {
		throw new Error('Pocketbase instance not found');
	}
	const pb = new PocketBase(instanceUrl) as TypedPocketBase;
	console.log('Creating PocketBase instance:', instanceUrl);
	// pb.autoCancellation(false);
	// pb.health.check({}).catch((err) => {
	// 	console.error('Pocketbase instance is not reachable:', err);
	// 	throw new Error('Pocketbase instance is not reachable');
	// });
	return pb;
};
