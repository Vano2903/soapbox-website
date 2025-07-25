import { env } from '$env/dynamic/public';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import pocketbase from 'pocketbase';
import type { TypedPocketBase } from '$lib/types/pocketbase';

export const load: PageLoad = async ({ data }) => {
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;

	try {
		const authList = await pb.collection('users').listAuthMethods();
		return {
			...data,
			authMethods: authList
		};
	} catch (err) {
		console.error('An error occurred in page load, getting list auth methods:', err);
		error(500, { message: "Errore interno del server, contattare l'amministratore" });
	}
};
