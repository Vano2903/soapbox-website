import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, pb } = locals;

	if (!user) {
		throw redirect(303, '/login');
	}

	if (!locals.teamsCount) {
		console.log("getting user's teams", user.person);
		const [res, err] = await goCatch(
			pb.collection('teams').getList(1, 1, {
				filter: `members:each ?= "${user.person}" || owner.id = "${user.person}"`
			})
		);
		console.log('teams in layout server dash/:', res);
		locals.teamsCount = res?.totalItems ?? 0;
	}

	return {
		teamsCount: locals.teamsCount
	};
};
