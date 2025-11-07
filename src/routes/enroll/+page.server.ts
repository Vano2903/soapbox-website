import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { categoryEnum, enrollSchema } from '$lib/schemas/enrollSchema';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { z } from 'zod';

// import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
// import type { EventNonExpand } from '$types/pocketbase/event';

// async function findLatestEventWithOpenSubscriptions(pb: TypedPocketBase) {
// 	const [event, eventErr] = (await goCatch(
// 		pb.collection('events').getFirstListItem(`subscriptionsOpen=true`, {
// 			sort: '-startDate'
// 		})
// 	)) as [EventNonExpand | undefined, undefined | Error];
// 	return [event, eventErr] as [EventNonExpand | undefined, undefined | Error];
// }

// async function findEventByShortName(pb: TypedPocketBase, shortName: string) {
// 	const [event, eventErr] = (await goCatch(
// 		pb.collection('events').getFirstListItem(`shortName="${shortName}"`)
// 	)) as [EventNonExpand | undefined, undefined | Error];
// 	return [event, eventErr] as [EventNonExpand | undefined, undefined | Error];
// }

export const load: PageServerLoad = async ({ locals, url }) => {
	const { user, pb } = locals;
	//const warnings: string[] = [];

	if (!user) {
		throw redirect(303, '/login');
	}

	// obtain teams where the user is a member
	console.log("getting user's teams", user.person);
	const [userTeams, err] = await goCatch(
		pb.collection('teams').getFullList({
			filter: `members.id ?= "${user.person}"`,
			expand: 'members'
		})
	);
	if (err) {
		console.error("error getting user's teams", err);
		throw fail(500);
	}

	// check if the url contains championship and event parameters (to make the fetch) used in enrollment
	if (!url.searchParams.get('championship') || !url.searchParams.get('event')) {
		console.error('Championship and Event must be specified during enrollment');
		return error(400, {
			message: "Campionato ed Evento devono essere specificati durante l'iscrizione"
		});
	}

	// retrieve the selected ChampionshipExpand version (with full event list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb
			.collection('championships')
			.getFirstListItem(`name="${url.searchParams.get('championship')}"`, { expand: 'events' });
	} catch (err) {
		console.error('Championship not found: ', err);
		return error(404, { message: 'Campionato non trovato' });
	}

	// retrieve the selected event or, if nullish, the first event that hasn't yet passed for the requested championship.
	const foundEvent = foundChampionship.expand.events.find((e) => {
		return e.shortName === url.searchParams.get('event');
	});
	if (!foundEvent) {
		console.error(`Event not found for the championship ${url.searchParams.get('championship')}: `);
		return error(404, {
			message: 'Evento non trovato per il campionato ' + url.searchParams.get('championship')
		});
	}

	let isAlreadyEnrolled = false;
	if (userTeams.length == 1) {
		try {
			await pb
				.collection('eventParticipations')
				.getFirstListItem(`event = "${foundEvent.id}" && team = "${userTeams[0].id}"`);
			isAlreadyEnrolled = true;
		} catch {
			isAlreadyEnrolled = false;
		}
	}

	// set up the form based on the schema
	const defaultData: {
		eventId: string;
		category: z.infer<typeof categoryEnum>;
		teamId?: string;
		teamAlias?: string;
	} = { eventId: foundEvent.id, category: 'SoapBox' };
	if (userTeams.length == 1) {
		defaultData.teamId = userTeams[0].id;
		defaultData.teamAlias = userTeams[0].name;
	}
	const form = await superValidate(defaultData, zod(enrollSchema));

	return {
		form,
		userTeams,
		foundChampionship,
		foundEvent,
		isAlreadyEnrolled
	};

	// // const selectedYear = url.searchParams.get('year');
	// const selectedEvent = url.searchParams.get('event');
	// console.log('Selected event:', selectedEvent);

	// const [latestEvent, latestEventErr] = await findLatestEventWithOpenSubscriptions(pb);
	// if (latestEventErr || !latestEvent) {
	// 	warnings.push('Non sono presenti eventi con le iscrizioni aperte.');
	// 	return {
	// 		// championshipsList,
	// 		// lastOngoingChampionshipIndex,
	// 		event: {
	// 			name: 'nessun evento disponibile'
	// 		} as EventNonExpand,
	// 		teamsCount: locals.teamsCount,
	// 		warnings
	// 	};
	// }

	// if (!selectedEvent) {
	// 	throw redirect(303, `/enroll?event=${latestEvent.shortName}`);
	// }

	// let event: EventNonExpand = latestEvent;
	// if (selectedEvent) {
	// 	if (selectedEvent !== latestEvent.shortName) {
	// 		// eslint-disable-next-line prefer-const
	// 		let [foundEvent, foundEventErr] = await findEventByShortName(pb, selectedEvent);
	// 		if (foundEventErr || !foundEvent) {
	// 			warnings.push(`L'evento "${selectedEvent}" non è stato trovato.`);
	// 		}
	// 		event = foundEvent || latestEvent;
	// 	}
	// }

	// if (!event.subscriptionsOpen) {
	// 	warnings.push(`Le iscrizioni per l'evento "${selectedEvent}" sono chiuse.<br><br>
	// 	Attualmente l'evento con le iscrizioni aperte più recente è<br><a class="link" href="/enroll?event=${latestEvent.shortName}">${latestEvent.name}</a>.`);
	// } else if (
	// 	(event.startDate && new Date(event.startDate).valueOf() < new Date().valueOf()) ||
	// 	event.numSubscriptions >= (event.maxSubscriptions || 0)
	// ) {
	// 	warnings.push(`Le iscrizioni per l'evento "${selectedEvent}" sono chiuse.`);
	// }

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
	// console.log('event in load', event);
	// return {
	// 	// championshipsList,
	// 	// lastOngoingChampionshipIndex,
	// 	event,
	// 	teamsCount: locals.teamsCount,
	// 	warnings
	// };
};

export const actions: Actions = {
	enroll: async ({ request, locals }) => {
		// destructure locals and check if user is authenticated, if not redirect to login
		const { user, pb } = locals;
		if (!user) {
			throw redirect(303, '/login');
		}

		// set up the form based on the schema
		const form = await superValidate(request, zod(enrollSchema));
		if (!form.valid) {
			console.log('Form not valid: ', form);
			return fail(400, { form });
		}

		let existingEnrollment;
		try {
			existingEnrollment = await pb
				.collection('eventParticipations')
				.getFirstListItem(`event = "${form.data.eventId}" && team = "${form.data.teamId}"`);
		} catch {
			//console.log("Checking existing enrollment:");
		}

		if (existingEnrollment) {
			return message(
				form,
				{ type: 'error', text: 'Il team è già iscritto a questo evento.' },
				{ status: 400 }
			);
		}

		// obtain teams where the owner is the user
		console.log("getting user's teams", user.person);
		const [teams, err] = await goCatch(
			pb.collection('teams').getFullList({
				filter: `owner.id = "${user.person}"`,
				expand: 'members'
			})
		);
		if (err) {
			console.error("error getting user's teams", err);
			return fail(500);
		}

		try {
			console.log("User's teams: ", teams, '(', teams?.length, ')');
			console.log('User Enrolling team: ', form.data.teamId);
			console.log('Form data', form.data);
			const newParticipation = await pb.collection('eventParticipations').create({
				event: form.data.eventId,
				team: form.data.teamId,
				category: form.data.category,
				participants: form.data.drivers,
				teamNameAlias:
					form.data.teamAlias ??
					teams?.find((team) => {
						return team.id === form.data.teamId;
					})?.name ??
					'',
				notes: form.data.notes ?? ''
			});

			return message(form, {
				type: 'success',
				text: `Iscrizione avvenuta con successo per il team ${newParticipation.teamNameAlias}!`
			});
		} catch (error) {
			console.error('Error enrolling in event:', error);
			console.log('Error enrolling in event:', error);
			return message(
				form,
				{ type: 'error', text: `Errore durante l'iscrizione: ${error}` },
				{ status: 500 }
			);
		}
	}
};
