import { disableScrollHandling } from '$app/navigation';
import { GenderKind, UserVisiblityKind } from '$tsTypes/user';
import CodiceFiscale from 'codice-fiscale-js';
import { z } from 'zod';

export const schema = z.object({
	name: z.string({
		required_error: 'Il nome completo del team è obbligatorio',
		invalid_type_error: 'Il nome completo del team deve essere una stringa'
	}),
	description: z.string({
		required_error: 'La descrizione del team è obbligatoria',
		invalid_type_error: 'La descrizione del team deve essere una stringa'
	}),
	nick: z
		.string({
			required_error: "L'username del team è obbligatorio",
			invalid_type_error: "L'username del team deve essere una stringa"
		})
		.min(3, {
			message: "L'username deve avere almeno 3 caratteri"
		})
		.max(40, {
			message: "L'username deve avere al massimo 40 caratteri"
		})
		.regex(/^[a-z0-9\-]+$/, {
			message: "L'username può contenere solo minuscole, numeri e trattini"
		}),
	logo: z.optional(
		z
			.object({
				file: z.instanceof(File).refine((f) => {
					f.size < 2 * 1024 * 1024,
						{
							message: 'Il file deve essere di dimensioni inferiori a 2MB'
						};
				}),
				cropped: z.object({
					x: z.number().min(0),
					y: z.number().min(0),
					width: z.number().min(0),
					height: z.number().min(0)
				})
			})
			.refine(
				(data) => {
					const { width, height } = data.cropped;
					if (width < 100 || height < 100) {
						return {
							message: "L'immagine deve essere di almeno 100x100px"
						};
					}
					if (width > 2000 || height > 2000) {
						return {
							message: "L'immagine deve essere di al massimo 2000x2000px"
						};
					}
					return true;
				},
				{
					message: "L'immagine deve essere di almeno 100x100px e al massimo 2000x2000px"
				}
			)
			.refine(
				(data) => {
					const { file } = data;
					const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
					if (!validTypes.includes(file.type)) {
						return {
							message: "Il file deve essere un'immagine (jpeg, png, gif)"
						};
					}
					return true;
				},
				{
					message: "Il file deve essere un'immagine (jpeg, png, gif)"
				}
			)
	),
	banner: z.optional(
		z.instanceof(File).refine((f) => {
			f.size < 5 * 1024 * 1024,
				{
					message: 'Il file deve essere di dimensioni inferiori a 5MB'
				};
		})
	)
});
