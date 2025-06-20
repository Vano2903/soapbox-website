import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = ({ params }) => {
	if (params.slug === '') {
		redirect(303, '/dash/team');
	}
	// error(404, 'Not found');

	return {
		slug: params.slug,
		title: 'Hello world!',
		content: 'Welcome to our blog. Lorem ipsum dolor sit amet...'
	};
};
