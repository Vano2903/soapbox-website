import { getFileTypeFromUrl } from './images';

/**
 * Fetch an image URL and wrap it as a single-entry FileList so we can hand it
 * straight to a SvelteKit Superforms file field. Returns `null` on any failure
 * (404, CORS, missing URL, etc.) so callers can `?? null` it cleanly.
 */
export async function urlToFileList(
	url: string | null | undefined,
	desiredName: string
): Promise<FileList | null> {
	if (!url) return null;
	try {
		const res = await fetch(url);
		if (!res.ok) return null;
		const blob = await res.blob();
		const fileType = `image/${getFileTypeFromUrl(url)}`;
		const dt = new DataTransfer();
		dt.items.add(new File([blob], desiredName, { type: fileType }));
		return dt.files;
	} catch (e) {
		console.error('urlToFileList failed for', url, e);
		return null;
	}
}
