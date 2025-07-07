import type { Handle, HandleServerError } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import pocketbase from '$lib/server/hooks/pocketbase';
import authentication from '$lib/server/hooks/authentication';
import authorization from '$lib/server/hooks/authorization';
import { isPublicPath } from '$lib/server/hooks/publicPathes';
// import errorsHandler from '$lib/server/hooks/errors';

import goCatch from '$lib/utils/goCatch';

globalThis.goCatch = goCatch;

// export const handle: Handle = ({ event, resolve }) => {
// 	// let response = null;
// 	if (isPublicPath(event.url.pathname)) {
// 		resolve(event);
// 	}

// 	return sequence(pocketbase, authentication, authorization)({ event, resolve });
// };
export const handle: Handle = sequence(pocketbase, authentication, authorization);

export const handleError = async ({ error, status, event }) => {
	// console.error('error', error);
	console.error('error', { error, status, event });
	// console.error('status', status);
	// console.error('event', event);
	// return errorsHandler({ error, status, event });
};
