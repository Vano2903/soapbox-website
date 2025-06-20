import { fail, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	message,
	setError,
	superValidate,
	type SuperValidated,
	type Infer
} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { TypedPocketBase } from '$tsTypes/pocketbase';
import { schema } from './schema';
import { _ } from '$env/static/private';
import DOMPurify from 'isomorphic-dompurify';

const nickSchema = schema.pick({ slug: true });

export const load: PageServerLoad = async ({ parent }) => {
	const form = await superValidate(zod(schema));

	return { form };
};

async function isTeamNickValid(
	form: SuperValidated<Infer<typeof nickSchema>>,
	pb: TypedPocketBase
): Promise<boolean> {
	try {
		const query = `slug="${form.data.slug}"`;
		console.log('searching team username:', query);
		const data = await pb.collection('teams').getFirstListItem(query);
		setError(form, 'slug', 'Esiste già un team con questo username', {
			overwrite: true
		});
		return false;
	} catch (e) {
		return true;
	}
}

export const actions = {
	createTeam: async ({ request, locals }) => {
		console.log('createTeam');
		const form = await superValidate(request, zod(schema));

		console.log('form', form);
		if (!form.valid) {
			console.log('form is not valid');
			// Return { form } and things will just work.
			return fail(400, { form });
		}
		// console.log(form.data);

		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}

		const isTeamNickAvailable = await isTeamNickValid(form, pb);
		console.log('isTeamNickAvailable', isTeamNickAvailable);
		if (!form.valid || !isTeamNickAvailable) {
			console.log('form is not valid or team slug is not available');
			return fail(400, { form });
		}

		try {
			console.log('creating team');
			const createdTeam = await pb.collection('teams').create({
				name: form.data.name,
				slug: form.data.slug,
				description: DOMPurify.sanitize(form.data.bio || ''),

				banner: form.data.bannerOriginal,
				bannerCropped: form.data.bannerCropped,
				bannerCrop: form.data.bannerCroppedInfo,

				logo: form.data.logoOriginal,
				logoCropped: form.data.logoCropped,
				logoCrop: form.data.logoCroppedInfo
			});

			console.log('createdTeam', createdTeam);
			return message(form, {
				type: 'success',
				text: `Team creato con successo, vai alla sua pagina per invitare altri partecipanti ed iscriverti alle gare: <a href="/dash/team/${createdTeam.slug}">${createdTeam.name}</a>`
			});
		} catch (e) {
			console.log(e);
			return message(
				form,
				{ type: 'error', text: 'Errore durante la creazione del team, riprova più tardi' },
				{
					status: 500
				}
			);
		}
	},

	checkUsername: async ({ request, locals }) => {
		const form = await superValidate(request, zod(nickSchema));

		const { pb } = locals;
		const isUsernameAvailable = await isTeamNickValid(form, pb);
		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		return { form };
	}
};
