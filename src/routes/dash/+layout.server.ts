import { error, fail, redirect, type Load, type ServerLoad } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, pb } = locals;

	if (!user) {
		redirect(303, '/login');
	}

	if (!locals.teamsCount) {
		console.log("getting user's teams", user.person);
		const [res, err] = await goCatch(
			pb.collection('teams').getList(1, 1, {
				filter: `members:each ?= "${user.person}" || owner.id = "${user.person}"`
				// expand: 'owner, members',
				// sort: '-created'
			})
		);
		console.log('teams in layout server dash/:', res);
		locals.teamsCount = res?.totalItems ?? 0;
	}

	return {
		teamsCount: locals.teamsCount
	};
};
