import type { UserPublicInfo } from '$types/pocketbase/user';
import { type Load } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { createPocketBaseInstance } from '$lib/utils/pocketbase';
import { createAvatarUrl } from '$lib/utils/avatar';

export const load: Load = async ({ url, fetch, parent }) => {
	const { docsContent } = await parent();
	console.log('Loading user with slug:', url);

	let error: string | null = null;
	const err = url.searchParams.get('error');
	if (err) {
		switch (err) {
			case 'not-found':
				error = `L'utente con nickname "${url.searchParams.get('slug')}" non è stato trovato.`;
				break;
			case 'teams-fetch-error':
				error = 'Errore durante il recupero dei team.';
				break;
			default:
				error = 'Errore sconosciuto.';
				break;
		}
	}

	const pbEndpoint = env.PUBLIC_PB_INSTANCE;
	const pb = createPocketBaseInstance(pbEndpoint);
	if (!pbEndpoint) {
		throw new Error('Pocketbase instance not found');
	}

	const paginatedUsers = await pb.collection('publicUserInfo').getList(1, 10, {
		sort: 'nick',
		fetch: fetch
	});

	const expandedUsers = paginatedUsers.items.map((user: UserPublicInfo) => {
		user.avatarCropped =
			pb.files.getURL(user, user.avatarCropped || '', { thumb: '64x0' }) ||
			createAvatarUrl(user.nick, 'small');
		user.bannerCropped = pb.files.getURL(user, user.bannerCropped || '') || undefined;
		return user;
	});

	return {
		paginatedUsers,
		expandedUsers,
		pb,
		error,
		contextualHelps: docsContent.contextualHelps
	};
};
