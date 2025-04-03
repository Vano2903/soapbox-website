import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types/user';
import { env } from '$env/dynamic/public';
import { PUBLIC_PB_INSTANCE } from '$env/static/public';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const user = locals.user;
	return { user, pbUri: PUBLIC_PB_INSTANCE } as {
		user: User;
		pbUri: string;
	};
};
