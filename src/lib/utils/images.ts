export function getFileTypeFromUrl(url: string): string {
	const extension = url.split('?')[0].split('.').pop()?.toLowerCase() || 'png';

	if (extension === 'jpg') {
		return 'jpeg';
	}

	return extension;
}
