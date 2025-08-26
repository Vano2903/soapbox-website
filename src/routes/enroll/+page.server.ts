import { fail, error, redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { categoryEnum, enrollSchema } from '$lib/schemas/enrollSchema';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { z } from 'zod';

export const load: PageServerLoad = async ({ locals, url }) => {
	// console.log('Server loading enroll:\n > url = ', url);

	// destructure locals and check if user is authenticated, if not redirect to login
	const { user, pb } = locals;
	if (!user) {
		throw redirect(303, '/login');
	}

	// obtain teams where the owner is the user
	console.log("getting user's teams", user.person);
	const [userTeams, err] = await goCatch(
		pb.collection('teams').getFullList({
			filter: `owner.id = "${user.person}"`,
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
		return error(400, { message: "Campionato ed Evento devono essere specificati durante l'iscrizione" });
	}

	// retrieve the selected ChampionshipExpand version (with full event list)
	let foundChampionship: ChampionshipExpand;
	try {
		foundChampionship = await pb.collection('championships').getFirstListItem(`name="${url.searchParams.get('championship')}"`, { expand: 'events' });
	} catch (err) {
		console.error('Championship not found: ', err);
		return error(404, { message: "Campionato non trovato" })
	}

	// retrieve the selected event or, if nullish, the first event that hasn't yet passed for the requested championship.
	const foundEvent = foundChampionship.expand.events.find((e) => { return (e.shortName === url.searchParams.get('event')) });
	if (!foundEvent) {
		console.error(`Event not found for the championship ${url.searchParams.get('championship')}: `);
		return error(404, { message: "Evento non trovato per il campionato " + url.searchParams.get('championship') })
	}

	let isAlreadyEnrolled = false;
	if (userTeams.length == 1) {
		try {
			await pb.collection('eventParticipations').getFirstListItem(
				`event = "${foundEvent.id}" && team = "${userTeams[0].id}"`,
			);
			isAlreadyEnrolled = true;
		} catch {
			isAlreadyEnrolled = false;
		}
	}

	// set up the form based on the schema
	const defaultData: { eventId: string; category: z.infer<typeof categoryEnum>; teamId?: string; teamAlias?: string } = { eventId: foundEvent.id, category: "SoapBox" };
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
			existingEnrollment = await pb.collection('eventParticipations').getFirstListItem(
				`event = "${form.data.eventId}" && team = "${form.data.teamId}"`,
			);
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
			console.log("User's teams: ", teams, "(", teams?.length, ")");
			console.log("User Enrolling team: ", form.data.teamId);
			console.log("Form data", form.data);
			const newParticipation = await pb.collection('eventParticipations').create({
				event: form.data.eventId,
				team: form.data.teamId,
				category: form.data.category,
				participants: form.data.drivers,
				teamNameAlias: form.data.teamAlias ?? teams?.find((team) => { return team.id === form.data.teamId })?.name ?? "",
				notes: form.data.notes ?? ""
			});

			return message(
				form,
				{
					type: "success",
					text: `Iscrizione avvenuta con successo per il team ${newParticipation.teamNameAlias}!`
				}
			);
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