import type { LayoutServerLoad } from './$types';
import type { User } from '$types/pocketbase/user';
import type { ContextualHelps } from '$lib/types/contextualHelp';
import { env } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const user = locals.user;

	let contextualHelps: ContextualHelps = {};
	try {
		const response = await fetch(new URL('/contextualHelps.json', request.url));
		if (response.ok) {
			contextualHelps = await response.json();
		}
	} catch (error) {
		console.error('Failed to load contextual helps:', error);
	}

	return {
		user,
		pbUri: env.PUBLIC_PB_INSTANCE,
		contextualHelps
	} as {
		user: User;
		pbUri: string;
		contextualHelps: ContextualHelps;
	};
};