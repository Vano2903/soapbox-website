import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ params }) => {
	// const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/teams');
	}

	redirect(303, '/team/' + params.slug);
};
