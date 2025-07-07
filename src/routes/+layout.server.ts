import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types/user';
import { env } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const user = locals.user;
	return { user, pbUri: env.PUBLIC_PB_INSTANCE } as {
		user: User;
		pbUri: string;
	};
};
