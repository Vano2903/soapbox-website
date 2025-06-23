import type { UserNonExpand } from '$tsTypes/user';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, params }) => {
	const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/users');
	}

	const [foundUser, err] = (await goCatch(
		pb.collection('users').getFirstListItem(`nick="${params.slug}"`)
	)) as [UserNonExpand, undefined] | [undefined, Error];

	if (err || !foundUser) {
		console.error('User not found:', err);
		throw redirect(303, '/users?error=user-not-found&slug=' + params.slug);
	}

	return {
		user: foundUser,
		slug: params.slug
	};
};
