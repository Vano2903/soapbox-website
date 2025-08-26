import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { registerSchema } from '$lib/schemas/registerSchema.js';
import type { PageServerLoad } from './$types.js';
import { Roles, UserVisiblityKind } from '$types/pocketbase/user.js';
// import { object } from 'zod';

export const load: PageServerLoad = async () => {
	const form = await superValidate(zod(registerSchema));

	return { form };
};

export const actions = {
	register: async ({ request, locals }) => {
		const form = await superValidate(request, zod(registerSchema));
		console.log('form', form);
		if (!form.valid) {
			return fail(400, { form });
		}

		const pb = locals.pb;

		try {
			await pb.collection('users').create({
				email: form.data.email,
				password: form.data.password,
				passwordConfirm: form.data.confirmPassword,
				role: [Roles.User],
				visibility: UserVisiblityKind.Public
			});
			const user = await pb
				.collection('users')
				.authWithPassword(form.data.email, form.data.password);
			console.log('created user:', user);
			pb.collection('users').requestVerification(form.data.email);
			locals.user = user.record;

			// if (!user) {
			// 	return message(form, 'Login effettuato con successo!');
			// }
			// let user = locals.user as User;

			return message(form, {
				type: 'success',
				text: 'Registrato, varifica la tua email per completare la registrazione'
			});
		} catch (e) {
			console.log(e);
			return message(
				form,
				{
					type: 'error',
					text: '<span>Si é verificato un errore durante la registrazione</span>'
				},
				{
					status: 400
				}
			);
		}
	}
};
