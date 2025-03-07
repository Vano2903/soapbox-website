import { PUBLIC_PB_INSTANCE } from '$env/static/public';
import { error } from '@sveltejs/kit';

import type { PageLoad } from './$types';
import pocketbase from 'pocketbase';
import type { TypedPocketBase } from '$tsTypes/pocketbase';

export const load: PageLoad = async ({}) => {
	const pb = new pocketbase(PUBLIC_PB_INSTANCE) as TypedPocketBase;

	try {
		const authList = await pb.collection('users').listAuthMethods();
		return {
			authMethods: authList,
			pbUri: PUBLIC_PB_INSTANCE
		};
	} catch (err) {
		console.error('An error occurred:', err);
		error(500, { message: "Errore interno del server, contattare l'amministratore" });
	}
};
