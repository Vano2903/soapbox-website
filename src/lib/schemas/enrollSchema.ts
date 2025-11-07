import { z } from 'zod';

export const categoryEnum = z.enum(['Drift Trike', 'SoapBox']);

const defaultEnrollSchema = z.object({
	eventId: z.string({
		required_error: "L'evento è obbligatorio",
		invalid_type_error: "L'evento deve essere una stringa"
	}),
	teamId: z.string({
		required_error: 'Il team è obbligatorio',
		invalid_type_error: 'Il team deve essere una stringa'
	}),
	// category: z
	// 	.enum(
	// 		["Drift Trike", "SoapBox"],
	// 		{
	// 			required_error: 'La categoria è obbligatoria',
	// 			invalid_type_error: 'La categoria non è valida'
	// 		}
	// 	),
	// drivers: z
	// 	.array(
	// 		z.string({
	// 			required_error: 'Il nome del pilota è obbligatorio',
	// 			invalid_type_error: 'Il nome del pilota deve essere una stringa'
	// 		})
	// 	)
	// 	.min(1, 'Almeno un pilota è obbligatorio'),
	teamAlias: z.optional(
		z
			.string({
				invalid_type_error: "L'alias deve essere una stringa"
			})
			.max(60, "L'alias deve avere al massimo 60 caratteri")
	),
	notes: z.optional(
		z
			.string({
				invalid_type_error: 'Le note devono essere una stringa'
			})
			.max(1000, 'Le note devono avere al massimo 1000 caratteri')
	),
	confirmTerms: z
		.boolean({
			required_error: 'La conferma dei dati è obbligatoria',
			invalid_type_error: 'Il campo conferma deve essere un booleano'
		})
		.refine((check) => check === true, {
			message: 'Devi accettare i termini e le condizioni'
		})
});

export const enrollSchema = z.discriminatedUnion('category', [
	z
		.object({
			category: categoryEnum.extract(['SoapBox']),
			drivers: z
				.array(
					z.string({
						required_error: 'Il nome del pilota è obbligatorio',
						invalid_type_error: 'Il nome del pilota deve essere una stringa'
					})
				)
				.min(2, 'Almeno due piloti sono obbligatori')
		})
		.merge(defaultEnrollSchema),
	z
		.object({
			category: categoryEnum.extract(['Drift Trike']),
			drivers: z
				.array(
					z.string({
						required_error: 'Il nome del pilota è obbligatorio',
						invalid_type_error: 'Il nome del pilota deve essere una stringa'
					})
				)
				.min(1, 'Almeno un pilota è obbligatorio')
		})
		.merge(defaultEnrollSchema)
]);
