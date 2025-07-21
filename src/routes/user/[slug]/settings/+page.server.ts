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
import { type User } from '$tsTypes/user';
import type { TypedPocketBase } from '$tsTypes/pocketbase';
import { userSettingsSchema } from '$lib/schemas/userSettingsSchema';

const nickSchema = userSettingsSchema.pick({ nick: true });

export const load: PageServerLoad = async ({ fetch, locals }) => {
	const { user, pb } = locals;
	if (!user) {
		redirect(303, '/login');
	}

	// https://gist.github.com/anubhavshrimal/75f6183458db8c453306f93521e93d37?permalink_comment_id=4493502#gistcomment-4493502
	const countryPhoneCodesJson = await fetch('/phonePrefixes.json');
	const countryPhoneCodes = (await countryPhoneCodesJson.json()) as {
		name: string;
		dial_code: string;
		emoji: string;
		code: string;
		default: boolean;
	}[];

	const prefix = user.phone.split('-')[0];
	let currentDefault = countryPhoneCodes.findIndex((countryPhone) => {
		return countryPhone.default;
	});
	currentDefault = currentDefault == -1 ? 0 : currentDefault;
	let newCurrent = countryPhoneCodes.findIndex((phoneCode) => {
		return phoneCode.dial_code == prefix;
	});
	newCurrent = newCurrent == -1 ? 0 : currentDefault;

	countryPhoneCodes[currentDefault].default = false;
	countryPhoneCodes[newCurrent].default = true;
	user.phone = user.phone.split('-')[1];
	console.log('user in load', user);
	user.avatar = pb.files.getURL(user, user.avatar || '') || '';
	user.avatarCropped = user.avatarCropped || '';
	user.banner = pb.files.getURL(user, user.banner || '') || '';
	user.bannerCropped = pb.files.getURL(user, user.bannerCropped || '') || '';

	const fileUrls = {
		avatarOriginal: user.avatar,
		avatarCropped: user.avatarCropped,
		bannerOriginal: user.banner,
		bannerCropped: user.bannerCropped
	};

	const form = await superValidate(
		{
			...user,
			avatarCroppedInfo: user.avatarCrop,
			bannerCroppedInfo: user.bannerCrop,
			prefix
		},
		zod(userSettingsSchema)
	);

	return { form, countryPhoneCodes, fileUrls, user };
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

		await pb
			.collection('publicUserInfo')
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
		const form = await superValidate(request, zod(userSettingsSchema));
		console.log('form', form);
		if (!form.valid) {
			// Return { form } and things will just work.
			return fail(400, withFiles({ form }));
		}
		console.log(form.data);

		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}

		const isUsernameAvailable = await isUsernameValid(user, form, pb);
		console.log('isUsernameAvailable', isUsernameAvailable);
		if (!form.valid || !isUsernameAvailable) return fail(400, withFiles({ form }));

		try {
			const user = locals.user as User;
			console.log('user in onboard action', user);
			locals.user = await pb.collection('users').update(user.id, {
				name: form.data.name,
				lastName: form.data.lastName,
				birthDate: form.data.birthDate,
				fiscalCode: form.data.fiscalCode ?? '',
				phone: `${form.data.prefix}-${form.data.phone}`,
				gender: form.data.gender,

				visibility: form.data.visibility,
				nick: form.data.nick,
				avatar: form.data.avatarOriginal,
				avatarCropped: form.data.avatarCropped,
				avatarCrop: form.data.avatarCroppedInfo,
				banner: form.data.bannerOriginal,
				bannerCropped: form.data.bannerCropped,
				bannerCrop: form.data.bannerCroppedInfo,
				bio: form.data.bio
			});

			return message(form, {
				type: 'success',
				text: `Profilo aggiornato con successo torna alla<a href="/dash" class="link">dashboard</a>`
			});
		} catch (e) {
			console.log(e);
			return message(
				form,
				{ type: 'error', text: "Errore durante l'aggiornamento del profilo, riprova più tardi" },
				{
					status: 500
				}
			);
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
