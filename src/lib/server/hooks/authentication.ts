import { type Handle } from '@sveltejs/kit';
import { type User } from '$types/pocketbase/user';
import { createAvatarUrl } from '$lib/utils/avatar';

// function createRandomString(length: number = 8): string {
// 	const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
// 	let result = '';
// 	for (let i = 0; i < length; i++) {
// 		result += chars.charAt(Math.floor(Math.random() * chars.length));
// 	}
// 	return result;
// }

// function createAvatarUrl(name: string, lastname: string = '', gender?: GenderKind): string {
// 	const baseUrl = 'https://avatar.iran.liara.run/public';
// 	// const initials = `${name.charAt(0).toUpperCase()}${lastname.charAt(0).toUpperCase()}`;
// 	console.log('createAvatarUrl', name, lastname, gender);
// 	let avatarUrl = baseUrl;
// 	if (gender) {
// 		if (gender == GenderKind.Male) {
// 			avatarUrl += `/boy`;
// 		} else if (gender == GenderKind.Female) {
// 			avatarUrl += `/girl`;
// 		}
// 	}
// 	if (name == '' && lastname == '') {
// 		avatarUrl += `/username="user+${createRandomString(6)}"`;
// 	} else if (!avatarUrl) {
// 		avatarUrl += `/username="${name}+${lastname ? ` +${lastname}` : ''}"`;
// 	}
// 	return avatarUrl;
// }

// Authentication middleware for handling user sessions
const authentication: Handle = async ({ event, resolve }) => {
	const pb = event.locals.pb;

	// const userId = '';
	// if (userId) {
	// 	await pb
	// 		.collection('_superusers')
	// 		.authWithPassword('email', 'password');

	// 	// impersonate
	// 	const impersonateClient = await pb.collection('users').impersonate(userId, 3600);

	// 	pb.authStore.save(impersonateClient.authStore.token, impersonateClient.authStore.record);
	// } else {
	// 	pb.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');
	// }
	pb.authStore.loadFromCookie(event.request.headers.get('cookie') ?? '');

	if (pb.authStore.isValid) {
		const [, error] = await goCatch(pb.collection('users').authRefresh());

		// Clear auth store if token refresh fails
		if (error) {
			console.log('ERROR CLEAR', error);
			pb.authStore.clear();
			event.cookies.set('pb_auth', '', {
				expires: new Date(0),
				path: '/'
			});
			event.locals.user = undefined;
			return await resolve(event);
		}

		// console.log('authStore after refresh', pb.authStore.record);
		event.locals.user = structuredClone(pb.authStore.record as unknown as User) || undefined;
		event.locals.user.isexpand = false;
		if (pb.authStore.record) {
			event.locals.user.avatarCropped =
				pb.files.getURL(pb.authStore.record, pb.authStore.record.avatarCropped, {
					thumb: '64x0'
				}) || //IMPORTANT: DO NOT CHANGE THIS || IT IS CORRECT, IF USING ?? IT WILL NOT WORK AND RETURN EMPTY STRING
				createAvatarUrl(event.locals.user.nick, 'small');

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
