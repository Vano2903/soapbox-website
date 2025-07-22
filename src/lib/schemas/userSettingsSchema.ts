import { GenderKind, UserVisiblityKind } from '$tsTypes/user';
import CodiceFiscale from 'codice-fiscale-js';
import { Biohazard } from 'lucide-svelte';
import { z } from 'zod';

const MEGA5 = 5000000;
const MEGA2 = 2000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

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
		errorMap: (gender, _ctx) => {
			switch (gender.code) {
				case 'invalid_type':
					return { message: 'Il sesso è richiesto, scegliere tra uno dei seguenti' };
				case 'invalid_enum_value':
					return { message: 'Il sesso è richiesto, scegliere tra uno dei seguenti' };
				default:
					return { message: 'Il sesso è richiesto, scegliere tra uno dei seguenti' };
			}
		}
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
			if (!val) return true; // Skip validation if value is not provided
			console.log('checking cf', val, CodiceFiscale.check(val.toUpperCase()));
			return CodiceFiscale.check(val.toUpperCase());
		},
		{
			message: 'Il codice fiscale inserito non è valido'
		}
	),
	nick: z
		.string({
			required_error: 'Il nome utente è obbligatorio',
			invalid_type_error: 'Il nome utente deve essere una stringa'
		})
		.min(3, {
			message: 'Il nome utente deve avere almeno 3 caratteri'
		})
		.max(100, {
			message: 'Il nome utente deve avere al massimo 100 caratteri'
		})
		.regex(/^[a-z0-9\-]+$/, {
			message: 'Il nome utente può contenere solo minuscole, numeri e trattini'
		}),
	visibility: z.nativeEnum(UserVisiblityKind, {
		errorMap: (gender, _ctx) => {
			switch (gender.code) {
				case 'invalid_type':
					return {
						message: `La visibilità dell'account è richiesta, scegliere tra uno dei seguenti`
					};
				case 'invalid_enum_value':
					return {
						message: `La visibilità dell'account è richiesta, scegliere tra uno dei seguenti`
					};
				default:
					return {
						message: `La visibilità dell'account è richiesta, scegliere tra uno dei seguenti`
					};
			}
		}
	}),
	avatarOriginal: z.optional(
		z
			.any()
			.refine((file) => file?.size <= MEGA2, 'Il file deve essere di dimensioni inferiori a 2MB')
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
			)
	),
	avatarCroppedInfo: z.optional(
		z.object({
			x: z.number().min(0),
			y: z.number().min(0),
			width: z.number().min(0),
			height: z.number().min(0)
		})
	),
	avatarCropped: z.optional(
		z
			.any()
			.refine(
				(file) => file?.size <= MEGA2,
				'Il file croppato deve essere di dimensioni inferiori a 2MB'
			)
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
			)
	),
	bannerOriginal: z.optional(
		z
			.any()
			.refine((file) => file?.size <= MEGA2, 'Il file deve essere di dimensioni inferiori a 2MB')
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
			)
	),
	bannerCroppedInfo: z.optional(
		z.object({
			x: z.number().min(0),
			y: z.number().min(0),
			width: z.number().min(0),
			height: z.number().min(0)
		})
	),
	bannerCropped: z.optional(
		z
			.any()
			.refine(
				(file) => file?.size <= MEGA2,
				'Il file croppato deve essere di dimensioni inferiori a 2MB'
			)
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
			)
	),
	bio: z.optional(
		z
			.string({
				required_error: 'La biografia è obbligatoria',
				invalid_type_error: 'La biografia deve essere una stringa'
			})
			.max(500, {
				message: 'La biografia deve avere al massimo 500 caratteri'
			})
	)
});
