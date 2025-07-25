import { fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	message,
	setError,
	superValidate,
	type SuperValidated,
	type Infer
} from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { type User } from '$lib/types/user';
import type { TypedPocketBase } from '$lib/types/pocketbase';
import { onboardingSchema } from '$lib/schemas/onboardingSchema';

const usernameSchema = onboardingSchema.pick({ username: true });

export const load: PageServerLoad = async ({ fetch, parent }) => {
	const { user } = await parent();

	const name = user.name.split(' ').slice(0, -1).join(' ');
	const surname = user.name.split(' ').slice(-1).join(' ');
	user.name = name;
	user.lastName = surname;
	const form = await superValidate({ ...user, prefix: '+39' }, zod(onboardingSchema));

	const countryPhoneCodesJson = await fetch('/phonePrefixes.json');
	const countryPhoneCodes = (await countryPhoneCodesJson.json()) as {
		name: string;
		dial_code: string;
		emoji: string;
		code: string;
		default: boolean;
	}[];

	// Always return { form } in load functions
	return { form, countryPhoneCodes };
};

async function isUsernameValid(
	form: SuperValidated<Infer<typeof usernameSchema>>,
	pb: TypedPocketBase
): Promise<boolean> {
	const bannedUsernames = ['admin', 'root', 'superuser', 'user', 'guest', 'test', 'users', 'dash'];
	if (bannedUsernames.includes(form.data.username)) {
		setError(form, 'username', 'Il nome utente non è valido', {
			overwrite: true
		});
		return false;
	}
	try {
		await pb.collection('publicUserInfo').getFirstListItem(`nick="${form.data.username}"`);
		setError(form, 'username', 'Il nome utente non è disponibile', {
			overwrite: true
		});
		return false;
	} catch (e) {
		console.log('error searching for username in isUsernameValid:', e);
		return true;
	}
}

export const actions = {
	onboard: async ({ request, locals }) => {
		const form = await superValidate(request, zod(onboardingSchema));
		console.log('form', form);
		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, { form });
		}
		console.log(form.data);

		const pb = locals.pb;

		const isUsernameAvailable = await isUsernameValid(form, pb);
		console.log('isUsernameAvailable', isUsernameAvailable);
		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		try {
			const user = locals.user as User;
			console.log('user in onboard action', user);
			locals.user = await pb.collection('users').update(user.id, {
				completed: true,

				name: form.data.name,
				lastName: form.data.lastName,
				birthDate: form.data.birthDate,
				fiscalCode: form.data.fiscalCode ?? '',
				gender: form.data.gender,
				phone: `${form.data.prefix}-${form.data.phone}`,

				visibility: form.data.visibility,
				nick: form.data.username
				// avatar: form.data.avatarOriginal,
				// avatarCropped: form.data.avatarCropped,
				// avatarCrop: form.data.avatarCroppedInfo,
				// banner: form.data.bannerOriginal,
				// bannerCropped: form.data.bannerCropped,
				// bannerCrop: form.data.bannerCroppedInfo
			});

			return message(form, {
				type: 'success',
				text: 'Hai completato la registrazione, benvenuto pilota!'
			});
		} catch (e) {
			console.log(e);
			return message(
				form,
				{ type: 'error', text: 'Errore durante la registrazione del pilota, riprova più tardi' },
				{
					status: 500
				}
			);
		}
	},

	checkUsername: async ({ request, locals }) => {
		const form = await superValidate(request, zod(usernameSchema));
		const pb = locals.pb;
		const isUsernameAvailable = await isUsernameValid(form, pb);

		if (!form.valid || !isUsernameAvailable) return fail(400, { form });

		return { form };
	}
};
