import { type Handle, error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/pocketbase';
import { env } from '$env/dynamic/public';
import { createPocketBaseInstance } from '$lib/utils/pocketbase';

const pocketbase: Handle = async ({ event, resolve }) => {
	try {
		if (!event.locals.pb) {
			event.locals.pb = createPocketBaseInstance(env.PUBLIC_PB_INSTANCE);
		} else {
			console.log('pocketbaese instance already exists in locals');
		}

		event.locals.pb.health.check().catch((err) => {
			console.log('not reachable, creating new instance', err);
			const pb = createPocketBaseInstance(env.PUBLIC_PB_INSTANCE);
			event.locals.pb = pb;
		});
	} catch (err) {
		console.error('Error initializing PocketBase:', err);
		error(500, 'Failed to initialize PocketBase');
	}
	// 	event.locals.pb.health.check().catch(() => {
	// 		const PUBLIC_PB_INSTANCE = env.PUBLIC_PB_INSTANCE;
	// 		if (!PUBLIC_PB_INSTANCE) {
	// 			error(500, 'Pocketbase instance not found');
	// 		}
	// 		const pb = new PocketBase(PUBLIC_PB_INSTANCE) as TypedPocketBase;
	// 		pb.health.check().catch(() => {
	// 			error(500, 'Pocketbase instance is not reachable');
	// 		});
	// 		event.locals.pb = pb;
	// 	});
	// }

	// const pb = new PocketBase(PUBLIC_PB_INSTANCE) as TypedPocketBase;
	// pb.health.check().catch(() => {
	// 	error(500, 'Pocketbase instance is not reachable');
	// });
	// event.locals.pb = pb;

	return await resolve(event);
};

export default pocketbase;
