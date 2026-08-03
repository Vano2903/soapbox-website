import { GenderKind, UserVisiblityKind } from '$types/pocketbase/user';
import CodiceFiscale from 'codice-fiscale-js';
import { z } from 'zod/v3';
import { cropAreaSchema, croppedImageSchema, originalImageSchema } from './imageFile';

const MAX_AVATAR_ORIGINAL = 5_000_000;
const MAX_AVATAR_CROPPED = 2_000_000;
const MAX_BANNER_ORIGINAL = 8_000_000;
const MAX_BANNER_CROPPED = 3_000_000;

export const userSettingsSchema = z.object({
	name: z.string({
		required_error: 'Il nome è obbligatorio',
		invalid_type_error: 'Il nome deve essere una stringa'
	}),
	lastName: z.string({
		required_error: 'Il cognome è obbligatorio',
		invalid_type_error: 'Il cognome deve essere una stringa'
	}),
	birthDate: z
		.date({
			required_error: 'La data di nascita è obbligatoria',
			invalid_type_error: 'La data di nascita deve essere una data'
		})
		.min(new Date('1900-01-01'), {
			message: 'La data di nascita deve essere successiva al 01/01/1900'
		})
		.max(new Date(), {
			message: 'La data di nascita non può essere futura'
		}),
	gender: z.nativeEnum(GenderKind, {
		errorMap: () => ({ message: 'Il sesso è richiesto, scegliere tra uno dei seguenti' })
	}),
	prefix: z.string({
		required_error: 'Il prefisso è obbligatorio',
		invalid_type_error: 'Il prefisso deve essere una stringa'
	}),
	phone: z.string({
		required_error: 'Il numero di telefono è obbligatorio',
		invalid_type_error: 'Il numero di telefono deve essere una stringa'
	}),
	fiscalCode: z.optional(z.string()).refine(
		(val) => {
			if (!val) return true;
			return CodiceFiscale.check(val.toUpperCase());
		},
		{ message: 'Il codice fiscale inserito non è valido' }
	),
	nick: z
		.string({
			required_error: 'Il nome utente è obbligatorio',
			invalid_type_error: 'Il nome utente deve essere una stringa'
		})
		.min(3, 'Il nome utente deve avere almeno 3 caratteri')
		.max(100, 'Il nome utente deve avere al massimo 100 caratteri')
		.regex(/^[a-z0-9-]+$/, 'Il nome utente può contenere solo minuscole, numeri e trattini'),
	visibility: z.nativeEnum(UserVisiblityKind, {
		errorMap: () => ({
			message: `La visibilità dell'account è richiesta, scegliere tra uno dei seguenti`
		})
	}),
	avatarOriginal: originalImageSchema(MAX_AVATAR_ORIGINAL),
	avatarCroppedInfo: cropAreaSchema,
	avatarCropped: croppedImageSchema(MAX_AVATAR_CROPPED),
	bannerOriginal: originalImageSchema(MAX_BANNER_ORIGINAL),
	bannerCroppedInfo: cropAreaSchema,
	bannerCropped: croppedImageSchema(MAX_BANNER_CROPPED),
	bio: z.optional(
		z
			.string({ invalid_type_error: 'La biografia deve essere una stringa' })
			.max(500, 'La biografia deve avere al massimo 500 caratteri')
	)
});
