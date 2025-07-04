import { redirect, type Handle } from '@sveltejs/kit';
import type { User } from '$lib/types/user';
import { userPrefersMode } from 'mode-watcher';

function createRandomString(length) {
	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	for (let i = 0; i < length; i++) {
		result += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return result;
}

// Authentication middleware for handling user sessions
const authentication: Handle = async ({ event, resolve }) => {
	const pb = event.locals.pb;

	// Load existing authentication state from cookies
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	if (pb.authStore.isValid) {
		const [_, error] = await goCatch(pb.collection('users').authRefresh());

		// Clear auth store if token refresh fails
		if (error) {
			console.log('ERROR CLEAR', error);
			pb.authStore.clear();
			event.locals.user = undefined;
			return await resolve(event);
		}

		// console.log('authStore after refresh', pb.authStore.record);
		event.locals.user = (pb.authStore.record as unknown as User) || undefined;
		event.locals.user.isexpand = false;
		if (pb.authStore.record) {
			event.locals.user.avatarCropped =
				pb.files.getURL(pb.authStore.record, pb.authStore.record.avatarCropped) ||
				`https://avatar.iran.liara.run/public?username=${pb.authStore.record.name || createRandomString(8)}`;
			event.locals.user.created = new Date(event.locals.user.created);
			event.locals.user.updated = new Date(event.locals.user.updated);
		}
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
