import type { LayoutServerLoad } from './$types';
import type { User } from '$types/pocketbase/user';
import type { DocsContent } from '$types/documentation';
import { env } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ request, locals }) => {
	const user = locals.user;

	let docsContent: DocsContent = {
		faq: [],
		categories: [],
		contextualHelps: {},
	};
	try {
		const response = await fetch(new URL('/docsContent.json', request.url));
		if (response.ok) {
			docsContent = await response.json();
		}
	} catch (error) {
		console.error('Failed to load docs content:', error);
	}

	return {
		user,
		pbUri: env.PUBLIC_PB_INSTANCE,
		docsContent,
	} as {
		user: User;
		pbUri: string;
		docsContent: DocsContent;
	};
};