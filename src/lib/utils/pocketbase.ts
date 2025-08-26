import PocketBase from 'pocketbase';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { ChampionshipNonExpand } from '$types/pocketbase/championship';

export const createPocketBaseInstance = (instanceUrl: string): TypedPocketBase => {
	if (!instanceUrl) {
		throw new Error('Pocketbase instance not found');
	}
	const pb = new PocketBase(instanceUrl) as TypedPocketBase;
	// console.log('Creating PocketBase instance:', instanceUrl);
	// pb.autoCancellation(false);
	// pb.health.check({}).catch((err) => {
	// 	console.error('Pocketbase instance is not reachable:', err);
	// 	throw new Error('Pocketbase instance is not reachable');
	// });
	return pb;
};

export const getChampionshipsList = async (
	pb: TypedPocketBase
): Promise<[ChampionshipNonExpand[], number, Error | undefined]> => {
	const [championshipsList, err] = (await goCatch(
		pb.collection('championships').getFullList({ sort: '+startDate' })
	)) as [ChampionshipNonExpand[], undefined] | [undefined, Error];
	if (err || !championshipsList || championshipsList.length === 0) {
		console.error('Error fetching championships: ', err);
		// throw fail(500);
		return [[], -1, err ?? new Error('Error fetching championships')];
	}
	const lastOngoingChampionshipIndex = championshipsList.findLastIndex((v) => {
		return v.ongoing;
	});

	return [championshipsList, lastOngoingChampionshipIndex, undefined];
};
