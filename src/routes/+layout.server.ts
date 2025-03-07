import type { LayoutServerLoad } from './$types';
import type { User } from '$lib/types/user';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const user = locals.user;

	return { user } as {
		user: User;
	};
};
