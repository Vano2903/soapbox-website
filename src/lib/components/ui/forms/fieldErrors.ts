export type FieldErrors =
	| string
	| string[]
	| { _errors?: string[] }
	| undefined
	| null;

export function normalizeErrors(errors: FieldErrors): string[] {
	if (!errors) return [];
	if (typeof errors === 'string') return [errors];
	if (Array.isArray(errors)) return errors.filter((e): e is string => typeof e === 'string');
	if (typeof errors === 'object' && '_errors' in errors && Array.isArray(errors._errors)) {
		return errors._errors;
	}
	return [];
}
