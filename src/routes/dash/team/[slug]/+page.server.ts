import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params, locals }) => {
	if (params.slug === '') {
		redirect(303, '/dash/team');
	}
	console.log('Loading team with slug:', params.slug);
	console.log('teams:', locals.teams);
	const team = locals.teams?.items.find((team) => team.slug === params.slug) ?? null;
	if (!team) {
		redirect(303, '/dash/team?error=not-found');
	}
	return {
		slug: params.slug,
		team: team,
		title: 'Hello world!',
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
};
