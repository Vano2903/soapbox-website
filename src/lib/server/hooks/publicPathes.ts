/* eslint-disable no-useless-escape */
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
		'\/championships\/sheetData$',
		'\/users$',
		'\/user\/[a-z0-9_-]+',
		'\/users\/[a-z0-9_-]+',
		'\/teams$',
		'\/team\/[a-z0-9_-]+',
		'\/teams\/[a-z0-9_-]+'
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
