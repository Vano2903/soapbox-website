import { type Handle, redirect } from '@sveltejs/kit';
import { Roles } from '$lib/types/user';
// import hasRole from '$lib/utils/hasRole';
import { error } from '@sveltejs/kit';

// Authorization middleware for route access control
const authorization: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	const path = event.url.pathname;

	const publicPaths = [
		'/',
		'/chi-siamo',
		'/login',
		'/register',
		'/forgot-password',
		'/gallery',
		'/championships'
	];

	// Allow access to public paths without authentication
	if (publicPaths.includes(path)) {
		return await resolve(event);
	}

	if (user?.banned) {
		error(403, `You don't have access to the system :(`);
	}

	// Redirect unauthenticated users to the login page
	if (!user) {
		redirect(302, '/login');
	}

	if (!user.verified) {
		if (!path.startsWith('/dash/verify')) {
		redirect(302, '/dash/verify');
		} else {
			return await resolve(event);
		}
	}

	if (!user.completed && !path.startsWith('/dash/onboarding')) {
		redirect(302, '/dash/onboarding');
	}

	// Redirect authenticated users to the dashboard if they have completed the onboarding process
	if (path.startsWith('/dash/onboarding') && user.completed) {
		redirect(302, '/dash');
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
