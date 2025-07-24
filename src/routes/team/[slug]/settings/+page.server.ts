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

const slugSchema = teamSchema.pick({ slug: true });

export const load: PageServerLoad = async ({ locals, parent }) => {
	console.log('locals value', locals);

	const { user } = locals;
	if (!user) {
		redirect(303, '/login');
	}

	const { team } = await parent();

	locals.team = team;

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
	pb: TypedPocketBase
): Promise<boolean> {
	try {
		const query = `slug="${form.data.slug}"`;
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
	updateTeam: async ({ request, locals }) => {
		const form = await superValidate(request, zod(teamSchema));
		console.log('form', form);
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}
		console.log(form.data);

		const { pb, user } = locals;
		const team = locals.team;
		if (!team) {
			return message(form, {
				type: 'error',
				text: 'Team non trovato'
			});
		}
		if (!user) {
			redirect(303, '/login');
		}

		const isTeamNickAvailable = await isTeamNickValid(form, pb);
		console.log('isTeamNickAvailable', isTeamNickAvailable);
		if (!form.valid || !isTeamNickAvailable) return fail(400, withFiles({ form }));

		try {
			locals.team = await pb.collection('teams').update(team.id, {
				name: form.data.name,
				slug: form.data.slug,
				description: form.data.bio || '',

				banner: form.data.bannerOriginal,
				bannerCropped: form.data.bannerCropped,
				bannerCrop: form.data.bannerCroppedInfo,

				logo: form.data.logoOriginal,
				logoCropped: form.data.logoCropped,
				logoCrop: form.data.logoCroppedInfo
			});
			return message(form, {
				type: 'success',
				text: `Team aggiornato con successo torna alla<a href="/team/dash" class="link">dashboard</a>`
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

	checkUsername: async ({ request, locals }) => {
		const form = await superValidate(request, zod(slugSchema));
		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}
		const isNickAvailable = await isTeamNickValid(form, pb);

		if (!form.valid || !isNickAvailable) return fail(400, { form });

		return { form };
	}
};
