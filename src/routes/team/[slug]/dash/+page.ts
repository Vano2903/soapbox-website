import type { LayoutServerLoad } from '../$types';
import type { TeamInvitationNonExpand } from '$types/pocketbase/team';
import { createPocketBaseInstance } from '$lib/utils/pocketbase';
import { env } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ parent, locals }) => {
	// const { user, pb } = locals;

	const { isCurrentOwner, team } = await parent();

	// if (!user) {
	// 	const message = 'Devi essere autenticato prima di poter accedere al team';
	// 	redirect(303, `/login?message=${message}&redirectTo=/team/${team.slug}/dash`);
	// }

	if (!isCurrentOwner) {
		return {};
	}

	const uri = env.PUBLIC_PB_INSTANCE;
	const pb = createPocketBaseInstance(uri);
	const invites = (await pb.collection('teamInvitations').getFullList({
		filter: `team="${team.id}"`,
		sort: '-created'
	})) as TeamInvitationNonExpand[];

	console.log('Invites:', invites);

	return {
		invites
	};
};
