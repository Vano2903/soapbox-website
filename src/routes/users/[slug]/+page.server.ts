// import type { UserPublicInfo } from '$types/pocketbase/user';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	// const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/users');
	}

	redirect(303, '/user/' + params.slug);
};
