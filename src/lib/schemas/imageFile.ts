import { filetypemime } from 'magic-bytes.js';
import { z } from 'zod/v3';

const ALLOWED_ORIGINAL_MIMES = ['image/png', 'image/jpeg', 'image/webp'] as const;
const MAX_BYTES_TO_INSPECT = 64;

function isFileLike(value: unknown): value is File {
	return (
		!!value &&
		typeof value === 'object' &&
		'size' in value &&
		'type' in value &&
		'arrayBuffer' in value &&
		typeof (value as File).arrayBuffer === 'function'
	);
}

/**
 * Form file fields can arrive as `File`, `FileList`, `null`, or `undefined`
 * depending on whether the value comes from a `bind:files`, a `fileProxy`,
 * or the multipart request body on the server. Normalize to the underlying
 * `File` (or `null` if absent).
 */
function pickFile(value: unknown): File | null {
	if (value === undefined || value === null) return null;
	if (isFileLike(value)) return value;
	// FileList — index-accessible, length-bearing collection of File.
	if (typeof value === 'object' && 'length' in value && 'item' in value) {
		const list = value as FileList;
		if (list.length === 0) return null;
		const first = list[0];
		return isFileLike(first) ? first : null;
	}
	return null;
}

function isEmptyOrFile(value: unknown): boolean {
	if (value === undefined || value === null) return true;
	if (isFileLike(value)) return true;
	if (typeof value === 'object' && 'length' in value && 'item' in value) return true;
	return false;
}

/**
 * Returns a zod schema for an *original* upload field: png/jpg/webp only,
 * verified by magic-byte signature (not by the browser-reported MIME).
 */
export function originalImageSchema(maxBytes: number) {
	return z
		.any()
		.optional()
		.refine(isEmptyOrFile, { message: 'Caricamento non valido' })
		.refine(
			(value) => {
				const f = pickFile(value);
				return f === null || f.size <= maxBytes;
			},
			{
				message: `Il file deve essere di dimensioni inferiori a ${Math.round(maxBytes / 1_000_000)}MB`
			}
		)
		.refine(
			async (value) => {
				const f = pickFile(value);
				if (!f) return true;
				const slice = await f.slice(0, MAX_BYTES_TO_INSPECT).arrayBuffer();
				const detected = filetypemime(new Uint8Array(slice));
				return detected.some((m) =>
					ALLOWED_ORIGINAL_MIMES.includes(m as (typeof ALLOWED_ORIGINAL_MIMES)[number])
				);
			},
			{
				message:
					"Il contenuto del file non è un'immagine valida (png, jpg, webp). Carica un'immagine reale."
			}
		);
}

/**
 * Returns a zod schema for a *cropped* upload field: must be image/webp,
 * verified by magic-byte signature.
 */
export function croppedImageSchema(maxBytes: number) {
	return z
		.any()
		.optional()
		.refine(isEmptyOrFile, { message: 'Caricamento non valido' })
		.refine(
			(value) => {
				const f = pickFile(value);
				return f === null || f.size <= maxBytes;
			},
			{
				message: `Il file croppato deve essere di dimensioni inferiori a ${Math.round(
					maxBytes / 1_000_000
				)}MB`
			}
		)
		.refine(
			async (value) => {
				const f = pickFile(value);
				if (!f) return true;
				const slice = await f.slice(0, MAX_BYTES_TO_INSPECT).arrayBuffer();
				const detected = filetypemime(new Uint8Array(slice));
				return detected.includes('image/webp');
			},
			{
				message: 'Il file ritagliato deve essere in formato webp (generato dal client).'
			}
		);
}

export const cropAreaSchema = z.optional(
	z.object({
		x: z.number().min(0),
		y: z.number().min(0),
		width: z.number().min(0),
		height: z.number().min(0)
	})
);
