import { redirect, fail } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';

export const load: PageServerLoad = async ({ params, locals, url }) => {
	const code = params.code;
	if (!code) {
		redirect(303, '/');
	}
	const { user, pb } = locals;
	if (!user) {
		const message = 'Devi essere autenticato prima di poter accedere al team';
		const fromPath = url.pathname + url.search;
		redirect(303, `/login?message=${message}&redirectTo=${fromPath}`);
	}

	try {
		const invite = await pb.collection('teamInvitations').getFirstListItem(`code="${code}"`, {
			expand: 'team'
		});

		const team = invite.expand?.team;
		if (!team) {
			redirect(303, '/404');
		}
		team.logoCropped = pb.files.getURL(team, team.logoCropped || '') || undefined;
		team.bannerCropped = pb.files.getURL(team, team.bannerCropped || '') || undefined;

		const teams = await pb.collection('teams').getFullList({
			filter: `members.id?="${user.person}"`
		});

		const isAlreadyMember = !!teams.find((team) => team.id === invite.team);

		return { invite, isAlreadyMember, team };
	} catch (error) {
		console.error('Error fetching invitation:', error);
		redirect(303, '/404');
	}
};

export const actions: Actions = {
	join: async ({ request, locals, params }) => {
		const { user, pb } = locals;

		if (!user) {
			const message = 'Devi essere autenticato prima di poter accedere al team';
			const fromPath = `/join/${params.code}`;
			redirect(303, `/login?message=${message}&redirectTo=${fromPath}`);
		}

		const data = await request.formData();
		const id = data.get('inviteId') as string;
		let teamCode = '';
		try {
			// Get the invitation
			console.log('getting invite');
			const invite = await pb.collection('teamInvitations').getOne(id, {
				expand: 'team'
			});
			console.log('got invite', invite);
			// Check if invitation is valid
			const isExpired = new Date(invite.expiration) < new Date();
			const isUseLimitReached = invite.uses !== -1 && invite.joined.length >= invite.uses;

			if (invite.disabled || isExpired || isUseLimitReached) {
				return fail(400, { error: `L'invito non è più valido` });
			}
			console.log('invito valido');
			// Check if user is already a member
			const teams = await pb.collection('teams').getFullList({
				filter: `members.id?="${user.person}"`
			});
			console.log('teams', teams);

			const isAlreadyMember = !!teams.find((team) => team.id === invite.team);
			if (isAlreadyMember) {
				return fail(400, { error: 'fai già parte di questo team' });
			}
			console.log('non membro');

			// Update invitation with new joined user
			await pb.collection('teamInvitations').update(id, {
				'joined+': [user.id]
			});
			console.log('update done');

			teamCode = invite.expand?.team.slug || '';
			// Redirect to team page
		} catch (error) {
			console.error('Error joining team:', error);
			return fail(500, { error: 'Failed to join team' });
		}
		redirect(303, `/team/${teamCode}/dash`);
	}
};
