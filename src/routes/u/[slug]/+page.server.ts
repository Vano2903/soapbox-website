import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, params }) => {
	const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/users');
	}

	try {
		const foundUser = await pb.collection('users').getFirstListItem(`nick="${params.slug}"`);

		if (!team) {
			throw error(404, 'Team not found');
		}

		if (team.members.includes(user.id)) {
			return {
				team
			};
		} else {
			throw error(403, 'You are not a member of this team');
		}
	} catch (error) {
		throw error(404, 'Utente non trovato');
	}
};
