import type { UserPublicInfo } from '$tsTypes/user';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, params, url }) => {
	const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/users');
	}

	const [foundUser, err] = (await goCatch(
		pb.collection('publicUserInfo').getFirstListItem(`nick="${params.slug}"`)
	)) as [UserPublicInfo, undefined] | [undefined, Error];

	if (err || !foundUser) {
		console.error('User not found:', err);
		throw redirect(303, '/users?error=user-not-found&slug=' + params.slug);
	}

	const startPathname = '/user/' + params.slug;
	const path = url.pathname;
	if (
		(path.startsWith(startPathname + '/dash') || path.startsWith(startPathname + '/settings')) &&
		user?.id !== foundUser.id
	) {
		redirect(303, '/user/' + params.slug);
	}

	console.log('Found user:', foundUser);

	return {
		user: foundUser,
		isCurrentUser: user?.id === foundUser.id,
		slug: params.slug
	};
};
