import { error, fail, redirect, type Load, type ServerLoad } from '@sveltejs/kit';

const load: ServerLoad = async ({ locals }) => {
	const { user, pb } = locals;

	if (!user) {
		redirect(303, '/login');
	}

	
};
