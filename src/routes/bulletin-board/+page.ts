import type { PageLoad } from './$types';

import pocketbase from 'pocketbase';
import { env } from '$env/dynamic/public';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { fail } from '@sveltejs/kit';
// import type { Result } from "$types/pocketbase/results";

export const load: PageLoad = async ({ data, url, fetch }) => {
	console.log('Loading bulletin-board:\n > data = ', data, '\n > url = ', url);

	// destructures the data received from the PageServerLoad
	const { championshipsList, lastOngoingChampionshipIndex } = data;

	// retrieve the selected championship or, if nullish, the last ongoingChampionship available
	const pb = new pocketbase(env.PUBLIC_PB_INSTANCE) as TypedPocketBase;
	const requestedChampionshipIndex = championshipsList.findIndex((c: { name: string | null }) => {
		return c.name === url.searchParams.get('championship');
	});

	const researchChampionshipIndex =
		requestedChampionshipIndex !== -1 ? requestedChampionshipIndex : lastOngoingChampionshipIndex;

	// retrieve the ChampionshipExpand version (with full documents list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb
			.collection('championships')
			.getFirstListItem(`id="${championshipsList.at(researchChampionshipIndex)?.id}"`, {
				fetch: fetch,
				expand: 'documents'
			});
	} catch (err) {
		console.error('Championship not found: ', err);
		throw fail(500);
	}

	console.log('Found championship: ', foundChampionship);

	let championshipDocuments;
	if (foundChampionship.expand && foundChampionship.expand.documents && foundChampionship.expand.documents.length > 0) {
		championshipDocuments = foundChampionship.expand.documents.map((document) => {
			return {
				publicUrl: pb.files.getURL(document, document.file),
				data: {
					...document,
					formattedCreated: new Date(document.created).toLocaleDateString('it-IT', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit'
					}),
					formattedUpdated: new Date(document.updated).toLocaleDateString('it-IT', {
						year: 'numeric',
						month: '2-digit',
						day: '2-digit',
						hour: '2-digit',
						minute: '2-digit'
					})
				}
			};
		});
	}

	console.log('Prepared championship documents: ', championshipDocuments);

	return { championshipsList, foundChampionship, championshipDocuments };
};
