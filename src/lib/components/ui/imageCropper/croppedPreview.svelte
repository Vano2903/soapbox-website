<script lang="ts">
	type Area = { x: number; y: number; width: number; height: number };

	let {
		blobUrl,
		fileName,
		cropArea,
		shape,
		fileType,
		cropped = $bindable()
	}: {
		blobUrl: string;
		cropArea: Area;
		fileName: string;
		shape: string;
		fileType: string;
		cropped: FileList | null;
	} = $props();

	const createImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.setAttribute('crossOrigin', 'anonymous');
			image.src = url;
		});

	async function getCroppedImg(
		imageSrc: string,
		pixelCrop: Area,
		outputWidth: number = pixelCrop?.width,
		outputHeight: number = pixelCrop?.height
	): Promise<Blob | null> {
		try {
			console.log('imageurl', imageSrc);
			console.log('pixelCrop', pixelCrop);
			console.log('outputWidth', outputWidth);
			console.log('outputHeight', outputHeight);

			const image = await createImage(imageSrc);
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');

			if (!ctx) {
				return null;
			}

			canvas.width = outputWidth;
			canvas.height = outputHeight;

			ctx.drawImage(
				image,
				pixelCrop.x,
				pixelCrop.y,
				pixelCrop.width,
				pixelCrop.height,
				0,
				0,
				outputWidth,
				outputHeight
			);

			return new Promise((resolve) => {
				canvas.toBlob((blob) => {
					resolve(blob);
				}, fileType);
			});
		} catch (error) {
			console.error('Error in getCroppedImg:', error);
			return null;
		}
	}

	// Create a stable key for the cropping parameters
	let cropKey = $derived(
		`${blobUrl}-${cropArea.x}-${cropArea.y}-${cropArea.width}-${cropArea.height}-${fileName}-${fileType}`
	);

	// Store the last processed key and result
	let lastCropKey = $state('');
	let cachedCroppedImage = $state<string | null>(null);
	let isProcessing = $state(false);

	// Only recalculate when the crop parameters actually change
	$effect(() => {
		if (cropKey !== lastCropKey && blobUrl && cropArea && fileName && fileType) {
			lastCropKey = cropKey;
			isProcessing = true;

			console.log('Cropping image with blobUrl:', blobUrl);

			getCroppedImg(blobUrl, cropArea)
				.then((blob) => {
					if (blob) {
						const files = new DataTransfer();
						files.items.add(new File([blob], 'cropped-' + fileName, { type: fileType }));
						cropped = files.files;
						cachedCroppedImage = URL.createObjectURL(blob);
					} else {
						cropped = null;
						cachedCroppedImage = null;
					}
				})
				.catch((error) => {
					console.error('Error cropping image', error);
					cropped = null;
					cachedCroppedImage = null;
				})
				.finally(() => {
					isProcessing = false;
				});
		}
	});

	// Clean up blob URLs when component is destroyed
	$effect(() => {
		return () => {
			if (cachedCroppedImage) {
				URL.revokeObjectURL(cachedCroppedImage);
			}
		};
	});
</script>

<div class="relative flex h-44 items-center justify-center">
	{#if isProcessing}
		<p>Loading...</p>
	{:else if !cachedCroppedImage}
		<p>Oops! c'è stato un errore nel tagliare l'immagine</p>
	{:else}
		<img
			src={cachedCroppedImage}
			alt="Cropped result"
			class:rounded-full={shape === 'round'}
			class="max-h-full min-h-32 max-w-full min-w-32 border object-contain"
		/>
	{/if}
</div>
