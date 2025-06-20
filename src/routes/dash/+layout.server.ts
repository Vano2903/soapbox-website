import { error, fail, redirect, type Load, type ServerLoad } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	const { user, pb } = locals;

	if (!user) {
		redirect(303, '/login');
	}

	console.log("getting user's teams", user.person);
	const res = await pb.collection('teams').getList(1, 10, {
		filter: `members:each ?= "${user.person}" || owner.id = "${user.person}"`,
		expand: 'owner, members',
		sort: '-created'
	});

	locals.teams = res;

	return {
		teams: res
	};
};
