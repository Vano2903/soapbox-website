import { type Handle, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { createPocketBaseInstance } from '$lib/utils/pocketbase';
import { createLogger } from '$lib/utils/logger';

const log = createLogger('hooks:pocketbase');

const pocketbase: Handle = async ({ event, resolve }) => {
	try {
		if (!event.locals.pb) {
			event.locals.pb = createPocketBaseInstance(env.PUBLIC_PB_INSTANCE);
		} else {
			log.debug('reusing PocketBase instance already present in locals');
		}

		event.locals.pb.health.check().catch((err) => {
			log.warn('PocketBase health check failed, creating a new instance', {
				instance: env.PUBLIC_PB_INSTANCE,
				path: event.url.pathname,
				error: err instanceof Error ? err.message : err
			});
			const pb = createPocketBaseInstance(env.PUBLIC_PB_INSTANCE);
			event.locals.pb = pb;
		});
	} catch (err) {
		log.error('failed to initialize PocketBase client', {
			instance: env.PUBLIC_PB_INSTANCE,
			error: err instanceof Error ? err.message : err
		});
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
