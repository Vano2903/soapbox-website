import { type Load } from '@sveltejs/kit';
import { env } from '$env/dynamic/public';
import { createPocketBaseInstance } from '$lib/utils/pocketbase';
import type { Team } from '$lib/types/team';

export const load: Load = async ({ url }) => {
	console.log('Loading team with slug:', url);

	let error: string | null = null;
	const err = url.searchParams.get('error');
	if (err) {
		switch (err) {
			case 'not-found':
				error = `Il team con slug "${url.searchParams.get('slug')}" non è stato trovato.`;
				break;
			case 'fetch-error':
				error = 'Errore durante il recupero delle informazioni, riprova piú tardi.';
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

	const paginatedTeams = await pb.collection('teams').getList(1, 10, {
		sort: 'slug'
	});

	const expandedTeams = paginatedTeams.items.map((team: Team) => {
		team.logoCropped =
			pb.files.getURL(team, team.logoCropped || '') ||
			`https://avatar.iran.liara.run/public?username=${team.slug}`;
		team.bannerCropped = pb.files.getURL(team, team.bannerCropped || '') || undefined;
		return team;
	});

	return {
		paginatedTeams,
		expandedTeams,
		pb,
		error
	};
};
