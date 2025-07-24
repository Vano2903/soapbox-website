import type { TeamNonexpand } from '$lib/types/team';
import type { UserPublicInfo } from '$lib/types/user';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ locals, params, url }) => {
	const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/users');
	}

	const [foundUser, err] = (await goCatch(
		pb.collection('publicUserInfo').getFirstListItem(`nick="${params.slug}"`)
	)) as [UserPublicInfo, undefined] | [undefined, Error];

	if (err || !foundUser) {
		console.error('User not found:', err);
		throw redirect(303, '/users?error=not-found&slug=' + params.slug);
	}

	const startPathname = '/user/' + params.slug;
	const path = url.pathname;
	if (
		(path.startsWith(startPathname + '/dash') ||
			path.startsWith(startPathname + '/settings') ||
			path.startsWith(startPathname + '/new')) &&
		user?.id !== foundUser.id
	) {
		redirect(303, '/user/' + params.slug);
	}

	console.log('Found user:', foundUser);
	foundUser.avatarCropped =
		pb.files.getURL(foundUser, foundUser.avatarCropped || '') ||
		`https://avatar.iran.liara.run/public?username=${foundUser.nick}`;

	foundUser.bannerCropped = pb.files.getURL(foundUser, foundUser.bannerCropped || '') || undefined;

	const [teamsInitial, errTeam] = (await goCatch(
		pb.collection('teams').getFullList({
			filter: `members.id?="${foundUser.person}" ||
				owner.id="${foundUser.person}"`,
			sort: '-created'
		})
	)) as [TeamNonexpand[], undefined] | [undefined, Error];
	let teams = teamsInitial;

	// if (errTeam) {
	// 	console.error('Error fetching teams:', errTeam);
	// 	throw redirect(303, '/users?error=teams-fetch-error');
	// }

	let error = {};
	if (errTeam || !teams) {
		console.log('Error fetching teams:', errTeam);
		error = {
			kind: 'teams',
			message: 'Errore durante il recupero dei team.'
		};
		teams = [];
	}

	const teamsWithAvatars = teams.map((team) => {
		team.logoCropped = pb.files.getURL(team, team.logoCropped || '') || undefined;
		return team;
	});

	console.log('teams:', teamsWithAvatars);

	return {
		user: foundUser,
		teams: teamsWithAvatars || [],
		error: error,
		isCurrentUser: user?.id === foundUser.id,
		slug: params.slug
	};
};
