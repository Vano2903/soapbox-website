import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ parent, locals }) => {
	const { isCurrentOwner, team } = await parent();

	if (!isCurrentOwner) {
		return {};
	}
	const pb = locals.pb;
	const token = pb.authStore.token;

	return {
		token,
		team,
		user: locals.user
	};
};
