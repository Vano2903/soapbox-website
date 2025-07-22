import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async ({ params }) => {
	if (!params.code) {
		redirect(303, '');
	}
};
