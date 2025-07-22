import { z } from 'zod';

const MEGA5 = 5000000;
const MEGA2 = 2000000;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export const teamSchema = z.object({
	name: z
		.string({
			required_error: 'Il nome completo del team è obbligatorio',
			invalid_type_error: 'Il nome completo del team deve essere una stringa'
		})
		.max(60, 'Il nome del team deve avere al massimo 60 caratteri'),
	bio: z
		.string({
			required_error: 'La descrizione del team è obbligatoria',
			invalid_type_error: 'La descrizione del team deve essere una stringa'
		})
		.max(1000, 'La descrizione del team deve avere al massimo 1000 caratteri'),
	// sponsors: z.optional(
	// 	z.array(
	// 		z
	// 			.object({
	// 				name: z.string({
	// 					required_error: 'Il nome dello sponsor è obbligatorio',
	// 					invalid_type_error: 'Il nome dello sponsor deve essere una stringa'
	// 				}),
	// 				url: z.string({
	// 					required_error: "L'url dello sponsor è obbligatorio",
	// 					invalid_type_error: "L'url dello sponsor deve essere una stringa"
	// 				}),
	// 				logo: z
	// 					.instanceof(File)
	// 					.refine((f) => {
	// 						f.size < 2 * 1024 * 1024,
	// 							{
	// 								message: 'Il file deve essere di dimensioni inferiori a 2MB'
	// 							};
	// 					})
	// 					.refine(
	// 						(file) => {
	// 							const validTypes = ['image/jpeg', 'image/png'];
	// 							if (!validTypes.includes(file.type)) {
	// 								return {
	// 									message: "Il file deve essere un'immagine (jpeg, png)"
	// 								};
	// 							}
	// 							return true;
	// 						},
	// 						{
	// 							message: "Il file deve essere un'immagine (jpeg, png)"
	// 						}
	// 					)
	// 					.refine(
	// 						(file) => {
	// 							const img = new Image();
	// 							img.src = URL.createObjectURL(file);
	// 							return new Promise((resolve) => {
	// 								img.onload = () => {
	// 									if (img.width < 100 || img.height < 100) {
	// 										resolve({
	// 											message: "L'immagine deve essere di almeno 100x100px"
	// 										});
	// 									} else if (img.width > 2000 || img.height > 2000) {
	// 										resolve({
	// 											message: "L'immagine deve essere di al massimo 2000x2000px"
	// 										});
	// 									} else {
	// 										resolve(true);
	// 									}
	// 								};
	// 								img.onerror = () => {
	// 									resolve({
	// 										message: "L'immagine non è valida"
	// 									});
	// 								};
	// 							});
	// 						},
	// 						{
	// 							message: "L'immagine deve essere di almeno 100x100px e al massimo 2000x2000px"
	// 						}
	// 					)
	// 			})
	// 			.refine((data) => {
	// 				const { name, url, logo } = data;
	// 				if (!name || !url || !logo) {
	// 					return {
	// 						message: 'Tutti i campi sono obbligatori'
	// 					};
	// 				}
	// 				if (name.length < 3 || name.length > 100) {
	// 					return {
	// 						message: 'Il nome deve avere tra 3 e 100 caratteri'
	// 					};
	// 				}
	// 				if (!/^https?:\/\/.+/i.test(url)) {
	// 					return {
	// 						message: "L'url deve essere valido e iniziare con http:// o https://"
	// 					};
	// 				}
	// 				if (logo.size > 2 * 1024 * 1024) {
	// 					return {
	// 						message: 'Il file deve essere di dimensioni inferiori a 2MB'
	// 					};
	// 				}
	// 				const validTypes = ['image/jpeg', 'image/png'];
	// 				if (!validTypes.includes(logo.type)) {
	// 					return {
	// 						message: "Il file deve essere un'immagine (jpeg, png)"
	// 					};
	// 				}
	// 				const img = new Image();
	// 				img.src = URL.createObjectURL(logo);
	// 			})
	// 	)
	// ),
	slug: z
		.string({
			required_error: "L'username del team è obbligatorio",
			invalid_type_error: "L'username del team deve essere una stringa"
		})
		.min(3, "L'username deve avere almeno 3 caratteri")
		.max(40, "L'username deve avere al massimo 40 caratteri")
		.regex(/^[a-z0-9\-]+$/, "L'username può contenere solo minuscole, numeri e trattini"),
	logoOriginal: z.optional(
		z
			.any()
			.refine((file) => file?.size <= MEGA2, 'Il file deve essere di dimensioni inferiori a 2MB')
			.refine(
				(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
				'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
			)
	),
	logoCroppedInfo: z.optional(
		z.object({
			x: z.number().min(0),
			y: z.number().min(0),
			width: z.number().min(0),
			height: z.number().min(0)
		})
	),
	logoCropped: z.optional(
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
	)
});

// logo: z.optional(
// 	z
// 		.object({
// 			original: z
// 				.any()
// 				.refine(
// 					(file) => file?.size <= MEGA2,
// 					'Il file deve essere di dimensioni inferiori a 2MB'
// 				)
// 				.refine(
// 					(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
// 					'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
// 				),
// 			croppedInfo: z.object({
// 				x: z.number().min(0),
// 				y: z.number().min(0),
// 				width: z.number().min(0),
// 				height: z.number().min(0)
// 			}),
// 			cropped: z
// 				.any()
// 				.refine(
// 					(file) => file?.size <= MEGA2,
// 					'Il file croppato deve essere di dimensioni inferiori a 2MB'
// 				)
// 				.refine(
// 					(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
// 					'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
// 				)
// 		})
// 		.refine(
// 			(data) => {
// 				const { width, height } = data.croppedInfo;
// 				if (width < 100 || height < 100) {
// 					return {
// 						message: "L'immagine deve essere di almeno 100x100px"
// 					};
// 				}
// 				if (width > 2000 || height > 2000) {
// 					return {
// 						message: "L'immagine deve essere di al massimo 2000x2000px"
// 					};
// 				}
// 				return true;
// 			},
// 			{
// 				message: "L'immagine deve essere di almeno 100x100px e al massimo 2000x2000px"
// 			}
// 		)
// ),
// banner: z.optional(
// 	z
// 		.object({
// 			original: z
// 				.any()
// 				.refine(
// 					(file) => file?.size <= MEGA5,
// 					'Il file deve essere di dimensioni inferiori a 5MB'
// 				)
// 				.refine(
// 					(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
// 					'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
// 				),
// 			croppedInfo: z.object({
// 				x: z.number().min(0),
// 				y: z.number().min(0),
// 				width: z.number().min(0),
// 				height: z.number().min(0)
// 			}),
// 			cropped: z
// 				.any()
// 				.refine(
// 					(file) => file?.size <= MEGA5,
// 					'Il file croppato deve essere di dimensioni inferiori a 5MB'
// 				)
// 				.refine(
// 					(file) => ACCEPTED_IMAGE_TYPES.includes(file?.type),
// 					'Solo formati .jpg, .jpeg, .png e .webp sono supportati'
// 				)
// 		})
// 		.refine((data) => {
// 			const { width, height } = data.croppedInfo;
// 			if (width < 100 || height < 100) {
// 				return {
// 					message: "L'immagine deve essere di almeno 100x100px"
// 				};
// 			}
// 			if (width > 2000 || height > 2000) {
// 				return {
// 					message: "L'immagine deve essere di al massimo 2000x2000px"
// 				};
// 			}
// 			return true;
// 		}, "L'immagine deve essere di almeno 100x100px e al massimo 2000x2000px")
// )
