import { type Handle, redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { isPublicPath } from './publicPathes';

// Authorization middleware for route access control
const authorization: Handle = async ({ event, resolve }) => {
	const user = event.locals.user;
	const path = event.url.pathname.toLowerCase();

	if (isPublicPath(path)) {
		return await resolve(event);
	}

	if (user?.banned) {
		error(403, `You don't have access to the system, womp womp :(`);
	}

	// Redirect unauthenticated users to the login page
	if (!user) {
		let message = 'Devi essere autenticato per accedere a questa pagina';
		if (event.url.searchParams.has('message')) {
			message = event.url.searchParams.get('message') || message;
		}
		redirect(
			302,
			`/login?message=${message}&redirectTo=${encodeURIComponent(path + event.url.search)}`
		);
	}

	if (!user.verified) {
		if (!path.startsWith('/verify')) {
			let message = 'Devi prima verificare il tuo account per poter accedere a questa pagina';
			if (event.url.searchParams.has('message')) {
				message = event.url.searchParams.get('message') || message;
			}
			redirect(302, `/verify?message=${encodeURIComponent(message)}`);
		} else {
			return await resolve(event);
		}
	}

	if (!user.completed) {
		if (!path.startsWith('/onboarding')) {
			let message = 'Devi prima completare la registrazione per poter accedere a questa pagina';
			if (event.url.searchParams.has('message')) {
				message = event.url.searchParams.get('message') || message;
			}
			redirect(302, `/onboarding?message=${encodeURIComponent(message)}`);
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

	if (path.startsWith('/new')) {
		redirect(302, `/user/${user.nick}/dash/new`);
	}

	// if (path.startsWith('/current')) {
	// 	const currentTeam = event.locals.team;
	// 	console.log('locals in AUTHORIZATION:', event.locals);
	// 	console.log('Current team:', currentTeam);
	// 	if (!currentTeam) {
	// 		redirect(302, `/user/${user.nick}/dash`);
	// 	}
	// 	const rest = path.replace('/current', '');
	// 	redirect(302, `/team/${currentTeam.slug}${rest}`);
	// }

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
