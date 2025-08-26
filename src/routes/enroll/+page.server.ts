import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import type { EventNonExpand } from '$types/pocketbase/event';

async function findLatestEventWithOpenSubscriptions(pb: TypedPocketBase) {
	const [event, eventErr] = (await goCatch(
		pb.collection('events').getFirstListItem(`subscriptionsOpen=true`, {
			sort: '-startDate'
		})
	)) as [EventNonExpand | undefined, undefined | Error];
	return [event, eventErr] as [EventNonExpand | undefined, undefined | Error];
}

async function findEventByShortName(pb: TypedPocketBase, shortName: string) {
	const [event, eventErr] = (await goCatch(
		pb.collection('events').getFirstListItem(`shortName="${shortName}"`)
	)) as [EventNonExpand | undefined, undefined | Error];
	return [event, eventErr] as [EventNonExpand | undefined, undefined | Error];
}

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, pb } = locals;
	const warnings: string[] = [];

	if (!user) {
		throw redirect(303, '/login');
	}

	if (!locals.teamsCount) {
		console.log("getting user's teams", user.person);
		const [res, teamErr] = await goCatch(
			pb.collection('teams').getList(1, 1, {
				filter: `members:each ?= "${user.person}" || owner.id = "${user.person}"`
			})
		);
		if (teamErr) {
			console.error("error getting user's teams:", teamErr);
			locals.teamsCount = 0;
			// throw error(500, 'Errore nel recupero delle squadre dell\'utente.');
		}
		locals.teamsCount = res?.totalItems ?? 0;
	}

	// const [championshipsList, lastOngoingChampionshipIndex, championshipsError] =
	// 	await getChampionshipsList(pb);

	// if (championshipsError || !championshipsList || championshipsList.length === 0) {
	// 	console.error('Error fetching championships: ', championshipsError);
	// 	throw fail(500);
	// }

	// const selectedYear = url.searchParams.get('year');
	const selectedEvent = url.searchParams.get('event');
	console.log('Selected event:', selectedEvent);

	const [latestEvent, latestEventErr] = await findLatestEventWithOpenSubscriptions(pb);
	if (latestEventErr || !latestEvent) {
		warnings.push('Non sono presenti eventi con le iscrizioni aperte.');
		return {
			// championshipsList,
			// lastOngoingChampionshipIndex,
			event: {
				name: 'nessun evento disponibile'
			} as EventNonExpand,
			teamsCount: locals.teamsCount,
			warnings
		};
	}

	if (!selectedEvent) {
		throw redirect(303, `/enroll?event=${latestEvent.shortName}`);
	}

	let event: EventNonExpand = latestEvent;
	if (selectedEvent) {
		if (selectedEvent !== latestEvent.shortName) {
			// eslint-disable-next-line prefer-const
			let [foundEvent, foundEventErr] = await findEventByShortName(pb, selectedEvent);
			if (foundEventErr || !foundEvent) {
				warnings.push(`L'evento "${selectedEvent}" non è stato trovato.`);
			}
			event = foundEvent || latestEvent;
		}
	}

	if (!event.subscriptionsOpen) {
		warnings.push(`Le iscrizioni per l'evento "${selectedEvent}" sono chiuse.<br><br>
		Attualmente l'evento con le iscrizioni aperte più recente è<br><a class="link" href="/enroll?event=${latestEvent.shortName}">${latestEvent.name}</a>.`);
	} else if (
		(event.startDate && new Date(event.startDate).valueOf() < new Date().valueOf()) ||
		event.numSubscriptions >= (event.maxSubscriptions || 0)
	) {
		warnings.push(`Le iscrizioni per l'evento "${selectedEvent}" sono chiuse.`);
	}

	// const [event, eventErr] = (await goCatch(
	// 	pb.collection('events').getFirstListItem(`shortName="${selectedEvent}"`)
	// )) as [EventNonExpand | undefined, undefined | Error];
	// if (eventErr || !event) {
	// 	warnings.push(`L'evento "${selectedEvent}" non è stato trovato.`);
	// }

	// const [championshipsList, err] = (await goCatch(
	// 	pb.collection('championships').getFullList({ sort: '+startDate' })
	// )) as [ChampionshipNonExpand[], undefined] | [undefined, Error];
	// if (championshipsError || !championshipsList || championshipsList.length === 0) {
	// 	console.error('Error fetching championships: ', championshipsError);
	// 	throw fail(500);
	// }
	// const lastOngoingChampionshipIndex = championshipsList.findLastIndex((v) => {
	// 	return v.ongoing;
	// });

	// return { championshipsList, lastOngoingChampionshipIndex };
	console.log('event in load', event);
	return {
		// championshipsList,
		// lastOngoingChampionshipIndex,
		event,
		teamsCount: locals.teamsCount,
		warnings
	};
};
