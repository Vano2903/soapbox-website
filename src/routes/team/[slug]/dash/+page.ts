import { env } from '$env/dynamic/public';
import { createPocketBaseInstance } from '$lib/utils/pocketbase';
import type { TeamInvitationNonExpand } from '$types/pocketbase/team';
import type { Load } from '@sveltejs/kit';

export const load: Load = async ({ parent, data }) => {
	const { isCurrentOwner, team } = await parent();

	// if (!user) {
	// 	const message = 'Devi essere autenticato prima di poter accedere al team';
	// 	redirect(303, `/login?message=${message}&redirectTo=/team/${team.slug}/dash`);
	// }
	if (!isCurrentOwner || !data) {
		return {};
	}

	const uri = env.PUBLIC_PB_INSTANCE;
	const pb = createPocketBaseInstance(uri);
	pb.authStore.save(data.token, data.user);
	const invites = (await pb.collection('teamInvitations').getFullList({
		filter: `team="${team.id}"`,
		sort: '-created'
	})) as TeamInvitationNonExpand[];

	console.log('Invites:', invites);

	return {
		pb,
		invites
	};
};
