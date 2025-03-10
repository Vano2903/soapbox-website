import { redirect, type Handle } from '@sveltejs/kit';
import type { User } from '$lib/types/user';

// Authentication middleware for handling user sessions
const authentication: Handle = async ({ event, resolve }) => {
	const pb = event.locals.pb;

	// Load existing authentication state from cookies
	console.log('cookies', event.request.headers.get('cookie'));
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (pb.authStore.isValid) {
		console.log('authStore', pb.authStore.record);
		// Attempt to refresh the authentication token

		// try {
		// 	await pb.collection('users').authRefresh();
		// } catch (error) {
		// 	pb.authStore.clear();
		// }
		const [_, error] = await goCatch(pb.collection('users').authRefresh());

		// Clear auth store if token refresh fails
		if (error) {
			console.log('ERROR CLEAR', error);
			pb.authStore.clear();
		}
		// // Clear auth store if token refresh fails
		// if (error) {
		// }

		// Attach user information to the event locals
		console.log('authStore after refresh', pb.authStore.record);
		event.locals.user = (pb.authStore.record as unknown as User) || undefined;
		if (pb.authStore.record) {
			event.locals.user.avatar =
				pb.files.getURL(pb.authStore.record, pb.authStore.record.avatar) ??
				`https://avatar.iran.liara.run/public/boy?username=${pb.authStore.record.name}`;
			console.log('avatar', event.locals.user.avatar);
		}
		console.log('user', event.locals.user);
	} else {
		console.log('No authStore');
	}

	const response = await resolve(event);

	// Send back the pb_auth cookie with the latest store state
	response.headers.append(
		'set-cookie',
		pb.authStore.exportToCookie({
			httpOnly: false,
			secure: true,
			sameSite: 'strict'
		})
	);

	return response;
};

export default authentication;
