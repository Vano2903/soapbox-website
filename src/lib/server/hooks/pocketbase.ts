import { type Handle, error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/pocketbase';
import { PB_INSTANCE } from '$env/static/private';

const pocketbase: Handle = async ({ event, resolve }) => {
	if (!PB_INSTANCE) {
		error(500, 'Pocketbase instance not found');
	}

	const pb = new PocketBase(PB_INSTANCE) as TypedPocketBase;

	event.locals.pb = pb;

	return await resolve(event);
};

export default pocketbase;
