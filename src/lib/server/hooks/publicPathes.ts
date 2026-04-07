/* eslint-disable no-useless-escape */
export const isPublicPath = (path: string): boolean => {
	path = path.toLowerCase();

	const publicPaths = [
		'^\/$',
		'^\/who-is$',
		'^\/login$',
		'^\/register$',
		'^\/forgot-password$',
		'^\/bulletin-board$',
		'^\/calendars$',
		'^\/leaderboards$',
		'^\/leaderboards\/sheetData$',
		'^\/events$',
		'^\/gallery$',
		'^\/docs$',
		'^\/users$',
		'^\/user\/[a-z0-9_-]+',
		'^\/users\/[a-z0-9_-]+',
		'^\/teams$',
		'^\/team\/[a-z0-9_-]+',
		'^\/teams\/[a-z0-9_-]+'
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
