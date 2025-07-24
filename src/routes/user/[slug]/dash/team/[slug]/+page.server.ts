import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { TeamExpand } from '$types/team';

export const load: PageServerLoad = async ({ params, locals }) => {
	const slug = params.slug;
	if (params.slug === '') {
		redirect(303, '/dash/team');
	}
	const { pb, user } = locals;
	if (!user || !user.person) {
		redirect(303, '/login?redirectTo=/dash/team/' + slug);
	}
	const [team, err] = await goCatch(
		pb.collection('teams').getFirstListItem(
			`slug = "${slug}" && 
			(members:each ?= "${user.person}" || 
			owner.id = "${user.person}")`,
			{
				expand: 'owner, members',
				sort: '-created'
			}
		)
	);

	console.log('Loading team with slug:', slug);
	console.log('team:', team);
	// const team = teams?.items.find((team) => team.slug === params.slug) ?? null;
	if (err || !team) {
		console.log('Error loading team:', err);
		redirect(303, '/dash/team?error=not-found&slug=' + slug);
	}
	return {
		slug: params.slug,
		team: team as TeamExpand,
		title: 'Hello world!',
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
};
