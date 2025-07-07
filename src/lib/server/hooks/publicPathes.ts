import type { Handle } from '@sveltejs/kit';

export const isPublicPath = (path: string): boolean => {
	path = path.toLowerCase();

	const publicPaths = [
		'\/$',
		'\/chi-siamo$',
		'\/login$',
		'\/register$',
		'\/forgot-password$',
		'\/gallery$',
		'\/championships$',
		'\/users$',
		'\/user\/[a-z0-9_-]+$'
	];
	const publicPathsRegex = publicPaths
		// .map((p) => p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))
		.join('|');
	const re = new RegExp(publicPathsRegex, 'i');
	return re.test(path);
	// if (re.test(path)) {
	// 	console.log('Public path accessed:', path);
	// 	return await resolve(event);

	// }

	// console.log('Non-public path accessed:', path);
	// return await sequence(pocketbase, authentication, authorization);
};
