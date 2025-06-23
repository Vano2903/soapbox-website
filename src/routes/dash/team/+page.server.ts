import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TeamNonexpand } from '$tsTypes/team';
import type { ListResult } from 'pocketbase';

export const load: PageServerLoad = async ({ locals }) => {
	const { user, pb } = locals;

	if (!user) {
		redirect(303, '/login');
	}

	console.log("getting user's teams", user.person);
	const [res, err] = await goCatch(
		pb.collection('teams').getList(1, 10, {
			filter: `members:each ?= "${user.person}" || owner.id = "${user.person}"`,
			// expand: 'owner, members',
			sort: '-created'
		})
	);
	console.log('teams in layout server dash/:', res);
	locals.teamsCount = res?.totalItems ?? 0;

	if (err || !res) {
		console.error('Error fetching teams:', err);
		redirect(303, '/dash/team?error=fetching-teams');
	}

	if (res.items.length === 1) {
		// If there's only one team, redirect to that team's page
		redirect(303, `/dash/team/${res.items[0].slug}`);
	}

	return {
		teams: res as ListResult<TeamNonexpand>
	};
};
