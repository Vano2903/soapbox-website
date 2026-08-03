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
import { type User } from '$types/pocketbase/user';
import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
import { userSettingsSchema } from '$lib/schemas/userSettingsSchema';
import { countryPhoneCodes } from '$lib/data/countryPhoneCodes';
import { createLogger } from '$lib/utils/logger';
import { ClientResponseError } from 'pocketbase';

const log = createLogger('user-settings');

const nickSchema = userSettingsSchema.pick({ nick: true });

export const load: PageServerLoad = async ({ locals }) => {
	const { user, pb } = locals;
	if (!user) {
		redirect(303, '/login');
	}

	const prefix = user.phone.split('-')[0];
	const prefixes = countryPhoneCodes.map((c) => ({
		...c,
		default: c.dial_code === prefix || (!prefix && c.dial_code === '+39')
	}));

	user.phone = user.phone.split('-')[1] ?? '';

	// File URLs are exposed to the client as URLs (the client converts them to
	// FileList via hydration) but must be kept out of the form *data* itself —
	// superValidate would otherwise see a URL string in a file field and fail
	// the magic-byte refines with "Caricamento non valido".
	const fileUrls = {
		avatarOriginal: pb.files.getURL(user, user.avatar || '') || '',
		avatarCropped: pb.files.getURL(user, user.avatarCropped || '') || '',
		bannerOriginal: pb.files.getURL(user, user.banner || '') || '',
		bannerCropped: pb.files.getURL(user, user.bannerCropped || '') || ''
	};

	const { avatar, avatarCropped, banner, bannerCropped, ...userMinusFiles } = user;

	const form = await superValidate(
		{
			...userMinusFiles,
			avatarCroppedInfo: user.avatarCrop,
			bannerCroppedInfo: user.bannerCrop,
			prefix
		},
		zod(userSettingsSchema)
	);

	return { form, countryPhoneCodes: prefixes, fileUrls, user };
};

async function isUsernameValid(
	user: User,
	form: SuperValidated<Infer<typeof nickSchema>>,
	pb: TypedPocketBase
): Promise<boolean> {
	const bannedUsernames = ['admin', 'root', 'superuser'];
	if (bannedUsernames.includes(form.data.nick)) {
		setError(form, 'nick', 'Il nome utente non è valido', { overwrite: true });
		return false;
	}
	try {
		await pb
			.collection('publicUserInfo')
			.getFirstListItem(`id!="${user.id}" && nick="${form.data.nick}"`);
		setError(form, 'nick', 'Il nome utente non è disponibile', { overwrite: true });
		return false;
	} catch {
		return true;
	}
}

export const actions = {
	updateAccount: async ({ request, locals }) => {
		const form = await superValidate(request, zod(userSettingsSchema));
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const { pb, user } = locals;
		if (!user) {
			redirect(303, '/login');
		}

		const isUsernameAvailable = await isUsernameValid(user, form, pb);
		if (!form.valid || !isUsernameAvailable) return fail(400, withFiles({ form }));

		try {
			const currentUser = locals.user as User;
			const {
				avatarOriginal,
				avatarCropped,
				avatarCroppedInfo,
				bannerOriginal,
				bannerCropped,
				bannerCroppedInfo,
				...rest
			} = form.data;

			// File fields must only reach PocketBase when a new file was actually
			// picked: an untouched slot is `undefined`, which the SDK serializes
			// into FormData as the string "undefined" and PB rejects the whole
			// update with "Invalid new files: [undefined]".
			const isFile = (v: unknown): v is File => v instanceof File && v.size > 0;
			const payload: Record<string, unknown> = {
				...rest,
				fiscalCode: form.data.fiscalCode ?? '',
				phone: `${form.data.prefix}-${form.data.phone}`
			};
			if (isFile(avatarOriginal)) payload.avatar = avatarOriginal;
			if (isFile(avatarCropped)) payload.avatarCropped = avatarCropped;
			if (avatarCroppedInfo) payload.avatarCrop = avatarCroppedInfo;
			if (isFile(bannerOriginal)) payload.banner = bannerOriginal;
			if (isFile(bannerCropped)) payload.bannerCropped = bannerCropped;
			if (bannerCroppedInfo) payload.bannerCrop = bannerCroppedInfo;

			log.info('updateAccount: sending update to PocketBase', {
				user: currentUser.id,
				newAvatar: isFile(avatarOriginal),
				newBanner: isFile(bannerOriginal)
			});
			locals.user = await pb.collection('users').update(currentUser.id, payload);
		} catch (e) {
			// PB's per-field validation errors live in response.data — without them
			// a 400 is undebuggable ("Failed to update record" alone says nothing).
			log.error('updateAccount: PocketBase rejected the update', {
				user: user.id,
				fields: e instanceof ClientResponseError ? e.response?.data : undefined,
				error: e instanceof Error ? e.message : e
			});
			return message(
				form,
				{ type: 'error', text: "Errore durante l'aggiornamento del profilo, riprova più tardi" },
				{ status: 500 }
			);
		}
		redirect(303, `/user/${locals.user?.nick}/dash`);
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
