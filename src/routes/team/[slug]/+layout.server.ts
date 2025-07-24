import type { TeamNonexpand } from '$tsTypes/team';
import type { UserPublicInfo } from '$tsTypes/user';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params, url }) => {
	const { user, pb } = locals;

	if (!params.slug) {
		redirect(303, '/teams');
	}

	const [foundTeam, err] = (await goCatch(
		pb.collection('teams').getFirstListItem(`slug="${params.slug}"`)
	)) as [TeamNonexpand, undefined] | [undefined, Error];

	if (err || !foundTeam) {
		console.error('Team not found:', err);
		throw redirect(303, '/teams?error=not-found&slug=' + params.slug);
	}

	const startPathname = '/team/' + params.slug;
	const path = url.pathname;
	const isCurrentOwner = user?.person === foundTeam.owner;
	const isCurrentMember = foundTeam.members.includes(user?.person || '');

	if (path.startsWith(startPathname + '/dash')) {
		if (!isCurrentOwner && !isCurrentMember) {
			redirect(303, '/teams/' + params.slug);
		}
	}
	if (path.startsWith(startPathname + '/settings')) {
		if (!isCurrentOwner) {
			redirect(303, '/teams/' + params.slug);
		}
	}

	console.log('Found user:', foundTeam);
	foundTeam.logoCropped =
		pb.files.getURL(foundTeam, foundTeam.logoCropped || '') ||
		`https://avatar.iran.liara.run/public?username=${foundTeam.slug}`;

	foundTeam.bannerCropped = pb.files.getURL(foundTeam, foundTeam.bannerCropped || '') || undefined;

	let filter = `person="${foundTeam.owner}"`;
	foundTeam.members.forEach((member) => {
		filter += ` || person="${member}"`;
	});

	const [fetchedMembers, errTeam] = (await goCatch(
		pb.collection('publicUserInfo').getFullList({
			filter: filter
			// sort: '-created'
		})
	)) as [UserPublicInfo[], undefined] | [undefined, Error];
	let members = fetchedMembers;

	let error = {};
	if (errTeam || !members) {
		console.log('Error fetching members:', errTeam);
		error = {
			kind: 'members',
			message: 'Errore durante il recupero dei membri.'
		};
		members = [];
	}

	const membersWithAvatars = members.map((member) => {
		member.avatarCropped =
			pb.files.getURL(member, member.avatarCropped || '') ||
			`https://avatar.iran.liara.run/public?username=${member.nick}`;
		member.bannerCropped = pb.files.getURL(member, member.bannerCropped || '') || undefined;
		return member;
	});

	console.log('members:', membersWithAvatars);

	locals.team = foundTeam;

	return {
		team: foundTeam,
		members: membersWithAvatars || [],
		error: error,
		// isCurrentUser: user?.id === foundTeam.id
		isCurrentOwner: user?.person === foundTeam.owner,
		isCurrentMember: foundTeam.members.includes(user?.person || ''),
		slug: params.slug
	};
};
