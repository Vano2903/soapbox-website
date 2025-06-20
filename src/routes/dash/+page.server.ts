import { error, fail, redirect, type Load, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals }) => {
	const { user, pb, teams } = locals;
	console.log('am i loading');
	if (!user) {
		redirect(303, '/login');
	}
};
