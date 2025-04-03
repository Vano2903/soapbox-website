import { error, fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { schema } from './schema.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({}) => {
	const form = await superValidate(zod(schema));

	return { form };
};

export const actions = {
	login: async ({ request, locals }) => {
		const form = await superValidate(request, zod(schema));
		console.log('form', form);
		if (!form.valid) {
			return fail(400, { form });
		}

		const pb = locals.pb;

		try {
			const user = await pb
				.collection('users')
				.authWithPassword(form.data.email, form.data.password);
			// if (!user) {
			// 	return message(form, 'Login effettuato con successo!');
			// }
			// let user = locals.user as User;

			return message(form, 'Loggato');
		} catch (e) {
			console.log(e);
			return message(
				form,
				'<span>Credenziali errate, se hai dimenticato la password puoi richiederne una nuova <a class="link" href="/forgot-password">qui</a></span>',
				{
					status: 400
				}
			);
		}
	}
};
