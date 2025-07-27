import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	message,
	setError,
	superValidate,
	type SuperValidated,
	type Infer,
	withFiles
} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { TypedPocketBase } from '$lib/types/pocketbase';
import { teamSchema } from '$lib/schemas/teamSchema';
import type { TeamNonexpand } from '$types/team';

const slugSchema = teamSchema.pick({ slug: true });

export const load: PageServerLoad = async ({ locals, parent }) => {
	console.log('locals value', locals);

	const { user, pb } = locals;
	if (!user) {
		redirect(303, '/login');
	}

	const { team } = await parent();

	locals.team = team;

	team.logo = pb.files.getURL(team, team.logo || '') || '';
	team.logoCropped = team.logoCropped || '';
	team.banner = pb.files.getURL(team, team.banner || '') || '';
	team.bannerCropped = pb.files.getURL(team, team.bannerCropped || '') || '';
	const fileUrls = {
		logoOriginal: team.logo,
		logoCropped: team.logoCropped,
		bannerOriginal: team.banner,
		bannerCropped: team.bannerCropped
	};

	const form = await superValidate(
		{
			...team,
			logoCroppedInfo: team.logoCrop,
			bannerCroppedInfo: team.bannerCrop
		},
		zod(teamSchema)
	);

	return { form, fileUrls, user };
};

async function isTeamNickValid(
	form: SuperValidated<Infer<typeof slugSchema>>,
	pb: TypedPocketBase,
	teamId: string
): Promise<boolean> {
	try {
		const query = `id!="${teamId}" &&slug="${form.data.slug}"`;
		console.log('searching team username:', query);
		await pb.collection('teams').getFirstListItem(query);
		setError(form, 'slug', 'Esiste già un team con questo username', {
			overwrite: true
		});
		return false;
	} catch {
		return true;
	}
}

export const actions = {
	updateTeam: async ({ request, locals, params }) => {
		const form = await superValidate(request, zod(teamSchema));
		console.log('form', form);
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}
		console.log(form.data);

		const teamCode = params.slug;
		if (!teamCode) {
			return message(form, {
				type: 'error',
				text: 'Team non trovato'
			});
		}

		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}

		const [team, err] = (await goCatch(
			pb.collection('teams').getFirstListItem(`slug="${teamCode}"`)
		)) as [TeamNonexpand, undefined] | [undefined, Error];
		if (err || !team) {
			console.error('Error seraching team:', err);
			return message(form, {
				type: 'error',
				text: 'Team non trovato'
			});
		}
		locals.team = team;

		const isTeamNickAvailable = await isTeamNickValid(form, pb, team.id);
		console.log('isTeamNickAvailable', isTeamNickAvailable);
		if (!form.valid || !isTeamNickAvailable) return fail(400, withFiles({ form }));

		try {
			const updatedTeam = await pb.collection('teams').update(team.id, {
				name: form.data.name,
				slug: form.data.slug,
				bio: form.data.bio || '',

				banner: form.data.bannerOriginal,
				bannerCropped: form.data.bannerCropped,
				bannerCrop: form.data.bannerCroppedInfo,

				logo: form.data.logoOriginal,
				logoCropped: form.data.logoCropped,
				logoCrop: form.data.logoCroppedInfo
			});
			locals.team = updatedTeam;
			return message(form, {
				type: 'success',
				text: `Team aggiornato con successo torna alla<a href="/team/${updatedTeam.slug}/dash" class="link">dashboard</a>`
			});
		} catch (e) {
			console.log(e);
			return message(
				form,
				{ type: 'error', text: "Errore durante l'aggiornamento del team, riprova più tardi" },
				{
					status: 500
				}
			);
		}
	},

	checkUsername: async ({ request, params, locals }) => {
		const form = await superValidate(request, zod(slugSchema));
		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}

		const teamCode = params.slug;
		if (!teamCode) {
			return message(form, {
				type: 'error',
				text: 'Team non trovato'
			});
		}

		const team = locals.team as TeamNonexpand;
		if (!team) {
			const [team, err] = (await goCatch(
				pb.collection('teams').getFirstListItem(`slug="${teamCode}"`)
			)) as [TeamNonexpand, undefined] | [undefined, Error];
			if (err || !team) {
				console.error('Error seraching team:', err);
				return message(form, {
					type: 'error',
					text: 'Team non trovato'
				});
			}
			locals.team = team;
		}

		const isNickAvailable = await isTeamNickValid(form, pb, team.id);

		if (!form.valid || !isNickAvailable) return fail(400, { form });

		return { form };
	}
};
