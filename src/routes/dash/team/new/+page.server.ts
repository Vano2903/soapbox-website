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
import { Roles, type User } from '$tsTypes/user';
import type { TypedPocketBase } from '$tsTypes/pocketbase';
import { schema } from './schema';
import { _ } from '$env/static/private';

const nickSchema = schema.pick({ nick: true });

export const load: PageServerLoad = async ({ parent }) => {
	const form = await superValidate(zod(schema));
	return { form };
};

async function isUsernameValid(
	form: SuperValidated<Infer<typeof nickSchema>>,
	pb: TypedPocketBase
): Promise<boolean> {
	// const bannedUsernames = ['admin', 'root', 'superuser'];
	// if (bannedUsernames.includes(form.data.nick)) {
	// 	setError(form, 'nick', 'Il nome utente non è valido', {
	// 		overwrite: true
	// 	});
	// 	return false;
	// }
	try {
		const query = `nick="${form.data.nick}"`;
		console.log('searching team username:', query);
		const data = await pb.collection('teams').getFirstListItem(query);
		setError(form, 'nick', 'Il nome utente non è disponibile', {
			overwrite: true
		});
		return false;
	} catch (e) {
		console.log('error seraching for username in isUsernameValid:', e);
		return true;
	}
}

export const actions = {
	createTeam: async ({ request, locals }) => {
		console.log('createTeam');
		const form = await superValidate(request, zod(schema));
		console.log('form', form);
		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, { form });
		}
		console.log(form.data);

		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}

		const isUsernameAvailable = await isUsernameValid(form, pb);
		console.log('isUsernameAvailable', isUsernameAvailable);
		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		try {
			await pb.collection('teams').create({
				name: form.data.name,
				nick: form.data.nick,
				description: form.data.description,
				owner: user.id,
				members: [user.id],
				logo: form.data.logo,
				banner: form.data.banner
			});

			return message(form, 'Team creato con successo');
		} catch (e) {
			console.log(e);
			return message(form, 'Errore durante la creazione del team, riprova più tardi', {
				status: 500
			});
		}
	},

	checkUsername: async ({ request, locals }) => {
		const form = await superValidate(request, zod(nickSchema));
		const { pb } = locals;
		const isUsernameAvailable = await isUsernameValid(form, pb);

		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		return { form };
	}
};
