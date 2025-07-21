import { z } from 'zod';

const minLength = 8;
const maxLength = 64;
export const registerSchema = z
	.object({
		email: z
			.string({
				required_error: 'La mail è obbligatoria',
				invalid_type_error: 'La mail deve essere una stringa'
			})
			.email('La mail non è valida'),
		password: z
			.string({
				required_error: 'La password è obbligatoria',
				invalid_type_error: 'La password deve essere una stringa'
			})
			.min(minLength, `La password deve contenere almeno ${minLength} caratteri`)
			.max(maxLength, `La password non può superare i ${maxLength} caratteri`)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&-_])[A-Za-z\d@$!%*?&-_]{8,}$/,
				'La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale'
			),
		confirmPassword: z.string({
			required_error: 'La conferma della password è obbligatoria',
			invalid_type_error: 'La conferma della password deve essere una stringa'
		})
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Le password non corrispondono',
		path: ['confirmPassword']
	});
