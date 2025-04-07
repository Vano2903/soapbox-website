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

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	// https://gist.github.com/anubhavshrimal/75f6183458db8c453306f93521e93d37?permalink_comment_id=4493502#gistcomment-4493502
	const countryPhoneCodesJson = await fetch('/phonePrefixes.json');
	const countryPhoneCodes = (await countryPhoneCodesJson.json()) as {
		name: string;
		dial_code: string;
		emoji: string;
		code: string;
		default: boolean;
	}[];

	let prefix = user.phone.split('-')[0];
	let currentDefault = countryPhoneCodes.findIndex((countryPhone) => {
		return countryPhone.default;
	});
	currentDefault == -1 ? 0 : currentDefault;
	const newCurrent = countryPhoneCodes.findIndex((phoneCode) => {
		return phoneCode.dial_code == prefix;
	});
	newCurrent == -1 ? 0 : currentDefault;

	countryPhoneCodes[currentDefault].default = false;
	countryPhoneCodes[newCurrent].default = true;
	user.phone = user.phone.split('-')[1];
	const form = await superValidate({ ...user, prefix }, zod(schema));

	// Always return { form } in load functions
	return { form, countryPhoneCodes };
};

async function isUsernameValid(
	user: User,
	form: SuperValidated<Infer<typeof nickSchema>>,
	pb: TypedPocketBase
): Promise<boolean> {
	const bannedUsernames = ['admin', 'root', 'superuser'];
	if (bannedUsernames.includes(form.data.nick)) {
		setError(form, 'nick', 'Il nome utente non è valido', {
			overwrite: true
		});
		return false;
	}
	try {
		console.log('searching:', `id!="${user.id}" && nick="${form.data.nick}"`);

		const data = await pb
			.collection('usernames')
			.getFirstListItem(`id!="${user.id}" && nick="${form.data.nick}"`);
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
	updateAccount: async ({ request, locals }) => {
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

		const isUsernameAvailable = await isUsernameValid(user, form, pb);
		console.log('isUsernameAvailable', isUsernameAvailable);
		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		try {
			let user = locals.user as User;
			console.log('user in onboard action', user);
			locals.user = await pb.collection('users').update(user.id, {
				name: form.data.name,
				lastName: form.data.lastName,
				birthDate: form.data.birthDate,
				fiscalCode: form.data.fiscalCode ?? '',
				gender: form.data.gender,
				visibility: form.data.visibility,
				phone: `${form.data.prefix}-${form.data.phone}`,
				nick: form.data.nick
			});

			return message(form, 'Profilo aggiornato con successo');
		} catch (e) {
			console.log(e);
			return message(form, "Errore durante l'aggiornamento del profilo, riprova più tardi", {
				status: 500
			});
		}
	},

	checkUsername: async ({ request, locals }) => {
		const form = await superValidate(request, zod(nickSchema));
		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}
		const isUsernameAvailable = await isUsernameValid(user, form, pb);

		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		return { form };
	}
};
