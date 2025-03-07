import { type Handle, error } from '@sveltejs/kit';
import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/pocketbase';
import { PUBLIC_PB_INSTANCE } from '$env/static/public';

const pocketbase: Handle = async ({ event, resolve }) => {
	if (!PUBLIC_PB_INSTANCE) {
		error(500, 'Pocketbase instance not found');
	}

	const pb = new PocketBase(PUBLIC_PB_INSTANCE) as TypedPocketBase;

	event.locals.pb = pb;

	return await resolve(event);
};

export default pocketbase;
