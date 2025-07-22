import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from '../$types';
import type { TeamInvitationExpand, TeamInvitationNonExpand } from '$tsTypes/team';

export const load: LayoutServerLoad = async ({ parent, locals }) => {
	const { user, pb } = locals;

	const { isCurrentOwner, team } = await parent();

	if (!user) {
		redirect(303, '/login');
	}

	if (!isCurrentOwner) {
		return {};
	}

	const invites = (await pb.collection('teamInvitations').getFullList({
		filter: `team="${team.id}"`,
		sort: '-created'
	})) as TeamInvitationNonExpand[];

	return {
		invites
	};
};
