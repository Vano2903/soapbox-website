import { z } from 'zod';

const minLength = 8;
const maxLength = 30;
export const schema = z.object({
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
});
