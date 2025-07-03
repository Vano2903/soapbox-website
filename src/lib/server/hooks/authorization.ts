import { type Handle, redirect } from '@sveltejs/kit';
import { Roles } from '$lib/types/user';
// import hasRole from '$lib/utils/hasRole';
import { error } from '@sveltejs/kit';

// Authorization middleware for route access control
const authorization: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	const path = event.url.pathname.toLowerCase();

	const publicPaths = [
		'\/$',
		'\/chi-siamo$',
		'\/login$',
		'\/register$',
		'\/forgot-password$',
		'\/gallery$',
		'\/championships$',
		'\/users$',
		'\/user/[a-z0-9_-]+$'
	];
	const publicPathsRegex = publicPaths
		// .map((p) => p.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&'))
		.join('|');
	console.log('Public paths regex:', publicPathsRegex);
	const re = new RegExp(publicPathsRegex, 'i');
	if (re.test(path)) {
		console.log('Public path accessed:', path);
		return await resolve(event);
	}

	if (user?.banned) {
		error(403, `You don't have access to the system, womp womp :(`);
	}

	// Redirect unauthenticated users to the login page
	if (!user) {
		redirect(302, '/login?redirect=' + encodeURIComponent(path));
	}

	if (!user.verified) {
		if (!path.startsWith('/verify')) {
			redirect(302, '/verify');
		} else {
			return await resolve(event);
		}
	}

	if (!user.completed) {
		if (!path.startsWith('/onboarding')) {
			redirect(302, '/onboarding');
		}
		return await resolve(event);
	}

	// Redirect authenticated users to the dashboard if they have completed the onboarding process
	if (path.startsWith('/onboarding')) {
		redirect(302, `/user/${user.nick}/`);
	}

	if (path.startsWith('/dash')) {
		const rest = path.replace('/dash', '');
		redirect(302, `/user/${user.nick}/dash${rest}`);
	}

	if (path.startsWith('/settings')) {
		const rest = path.replace('/settings', '');
		redirect(302, `/user/${user.nick}/settings${rest}`);
	}

	if (path.startsWith('/me')) {
		redirect(302, `/user/${user.nick}/`);
	}

	// Role-based access control mapping for different routes
	// const routePermissions = Object.entries({
	// 	'/cogestione/registration': !hasRole(user, Roles.Staff, Roles.Docente),
	// 	'/cogestione/ticket': !hasRole(user, Roles.Staff, Roles.Docente),
	// 	'/cogestione/admin': hasRole(user, Roles.Admin),
	// 	'/cogestione/classes': hasRole(user, Roles.Rappresentante, Roles.Admin),
	// 	'/cogestione/activities': hasRole(user, Roles.Organizzatore, Roles.Admin, Roles.Docente),
	// 	'/security': hasRole(user, Roles.Security, Roles.Staff, Roles.Admin, Roles.Docente),
	// 	'/cogestione/staff': hasRole(user, Roles.Staff, Roles.Admin)
	// });

	// // Redirect unauthorized users to the login page
	// for (const [route, permission] of routePermissions) {
	// 	if (path.startsWith(route) && !permission) {
	// 		redirect(302, '/login');
	// 	}
	// }

	return await resolve(event);
};

export default authorization;
