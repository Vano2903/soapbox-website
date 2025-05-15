<script lang="ts">
	type Area = { x: number; y: number; width: number; height: number };

	let {
		blobUrl,
		cropArea,
		shape
		// originalWidth,
		// originalHeight
	}: {
		blobUrl: string;
		cropArea: Area;
		shape: string;
		// originalWidth: number;
		// originalHeight: number;
	} = $props();

	const createImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.setAttribute('crossOrigin', 'anonymous'); // Needed for canvas Tainted check
			image.src = url;
		});

	async function getCroppedImg(
		imageSrc: string,
		pixelCrop: Area,
		outputWidth: number = pixelCrop.width, // Optional: specify output size
		outputHeight: number = pixelCrop.height
	): Promise<Blob | null> {
		try {
			const image = await createImage(imageSrc);
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return null;
			}

			// Set canvas size to desired output size
			canvas.width = outputWidth;
			canvas.height = outputHeight;

			// Draw the cropped image onto the canvas
			ctx.drawImage(
				image,
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
				0,
				0,
				outputWidth, // Draw onto the output size
				outputHeight
			);

			// Convert canvas to blob
			return new Promise((resolve) => {
				canvas.toBlob((blob) => {
					resolve(blob);
				}, 'image/jpeg'); // Specify format and quality if needed
			});
		} catch (error) {
			console.error('Error in getCroppedImg:', error);
			return null;
		}
	}

	let croppedImage = $derived.by(async () => {
		if (blobUrl) {
			const blob = await getCroppedImg(blobUrl, cropArea, cropArea.width, cropArea.height);
			if (blob) {
				return URL.createObjectURL(blob);
			}
			return null;
		}
	});
</script>

<div class="relative h-44">
	{#await croppedImage}
		<p>Loading...</p>
	{:then croppedImage}
		{#if !croppedImage}
			<p>Oops! c'è stato un errore nel tagliare l'immagine</p>
			{console.error('Error cropping image')}
		{:else}
			<img
				src={croppedImage}
				alt="Cropped result"
				class:rounded-full={shape === 'round'}
				class="max-h-full max-w-full border object-contain"
			/>
		{/if}
	{:catch error}
		<p>Oops! c'è stato un errore nel tagliare l'immagine</p>
		{console.error('Error cropping image', error)}
	{/await}
</div>
