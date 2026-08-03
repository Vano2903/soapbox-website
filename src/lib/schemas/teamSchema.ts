import { z } from 'zod/v3';
import { cropAreaSchema, croppedImageSchema, originalImageSchema } from './imageFile';

const MAX_LOGO_ORIGINAL = 5_000_000;
const MAX_LOGO_CROPPED = 2_000_000;
const MAX_BANNER_ORIGINAL = 8_000_000;
const MAX_BANNER_CROPPED = 3_000_000;

export const teamSchema = z.object({
	name: z
		.string({
			required_error: 'Il nome completo del team è obbligatorio',
			invalid_type_error: 'Il nome completo del team deve essere una stringa'
		})
		.max(60, 'Il nome del team deve avere al massimo 60 caratteri'),
	bio: z.optional(
		z
			.string({ invalid_type_error: 'La descrizione del team deve essere una stringa' })
			.max(1000, 'La descrizione del team deve avere al massimo 1000 caratteri')
	),
	slug: z
		.string({
			required_error: "L'username del team è obbligatorio",
			invalid_type_error: "L'username del team deve essere una stringa"
		})
		.min(3, "L'username deve avere almeno 3 caratteri")
		.max(40, "L'username deve avere al massimo 40 caratteri")
		.regex(/^[a-z0-9-]+$/, "L'username può contenere solo minuscole, numeri e trattini"),
	logoOriginal: originalImageSchema(MAX_LOGO_ORIGINAL),
	logoCroppedInfo: cropAreaSchema,
	logoCropped: croppedImageSchema(MAX_LOGO_CROPPED),
	bannerOriginal: originalImageSchema(MAX_BANNER_ORIGINAL),
	bannerCroppedInfo: cropAreaSchema,
	bannerCropped: croppedImageSchema(MAX_BANNER_CROPPED)
});
