<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	import { filetypemime } from 'magic-bytes.js';
	import FieldShell from './FieldShell.svelte';
	import type { FieldErrors } from './fieldErrors';

	type CropArea = { x: number; y: number; width: number; height: number };

	const ALLOWED_MIMES = ['image/png', 'image/jpeg', 'image/webp'] as const;
	const MAX_BYTES_TO_INSPECT = 64;
	const WEBP_QUALITY = 0.9;
	/** Cap output dimension to prevent huge canvases. Cropped output is resized down to fit this box. */
	const MAX_OUTPUT_DIMENSION = 2000;

	let {
		name,
		label,
		hint,
		shape,
		errors,
		original = $bindable(),
		cropped = $bindable(),
		cropArea = $bindable()
	}: {
		name: string;
		label?: string;
		hint?: string;
		shape: 'round' | 'rect';
		errors?: FieldErrors;
		original: FileList | null | undefined;
		cropped: FileList | null | undefined;
		cropArea: CropArea | null | undefined;
	} = $props();

	let localError = $state<string | null>(null);
	let isEditing = $state(false);
	let isProcessing = $state(false);

	// Cropper UI state — internal only.
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let pendingPixels = $state<CropArea | null>(null);

	const aspect = $derived(shape === 'round' ? 1 : 3 / 1);

	const originalFile = $derived(original && original.length > 0 ? original[0] : null);
	const croppedFile = $derived(cropped && cropped.length > 0 ? cropped[0] : null);

	let originalBlobUrl = $state<string | null>(null);
	let croppedBlobUrl = $state<string | null>(null);

	$effect(() => {
		if (!originalFile) {
			if (originalBlobUrl) URL.revokeObjectURL(originalBlobUrl);
			originalBlobUrl = null;
			return;
		}
		const url = URL.createObjectURL(originalFile);
		originalBlobUrl = url;
		return () => URL.revokeObjectURL(url);
	});

	$effect(() => {
		if (!croppedFile) {
			if (croppedBlobUrl) URL.revokeObjectURL(croppedBlobUrl);
			croppedBlobUrl = null;
			return;
		}
		const url = URL.createObjectURL(croppedFile);
		croppedBlobUrl = url;
		return () => URL.revokeObjectURL(url);
	});

	const mode = $derived(
		!originalFile
			? 'empty'
			: !croppedFile || isEditing
				? 'cropping'
				: 'confirmed'
	);

	async function verifyAndAccept(file: File): Promise<void> {
		const slice = await file.slice(0, MAX_BYTES_TO_INSPECT).arrayBuffer();
		const detected = filetypemime(new Uint8Array(slice));
		console.log('DBG ImageField verifyAndAccept', name, 'detected=', detected);
		const ok = detected.some((mime) => ALLOWED_MIMES.includes(mime as (typeof ALLOWED_MIMES)[number]));
		if (!ok) {
			localError =
				detected.length > 0
					? `Il file caricato è di tipo "${detected[0]}", non un'immagine valida. Usa png, jpg o webp.`
					: 'Il file caricato non sembra essere un\'immagine valida. Usa png, jpg o webp.';
			console.log('DBG ImageField verifyAndAccept rejected', name, localError);
			return;
		}
		localError = null;
		const dt = new DataTransfer();
		dt.items.add(file);
		original = dt.files;
		cropped = null;
		cropArea = null;
		isEditing = false;
		crop = { x: 0, y: 0 };
		zoom = 1;
		pendingPixels = null;
	}

	function onFileInput(e: Event) {
		const target = e.currentTarget as HTMLInputElement;
		const file = target.files?.[0];
		console.log('DBG ImageField onFileInput', name, 'file=', file?.name, file?.type, file?.size);
		if (!file) return;
		void verifyAndAccept(file);
		// Reset the input so picking the same file again retriggers change.
		target.value = '';
	}

	function clear() {
		localError = null;
		original = null;
		cropped = null;
		cropArea = null;
		isEditing = false;
		pendingPixels = null;
	}

	function loadImage(url: string): Promise<HTMLImageElement> {
		return new Promise((resolve, reject) => {
			const img = new Image();
			img.crossOrigin = 'anonymous';
			img.onload = () => resolve(img);
			img.onerror = () => reject(new Error('image load failed'));
			img.src = url;
		});
	}

	async function confirmCrop() {
		if (!originalFile || !pendingPixels || !originalBlobUrl) return;
		isProcessing = true;
		localError = null;
		try {
			const img = await loadImage(originalBlobUrl);
			const { x, y, width, height } = pendingPixels;

			// Downscale if the crop is huge.
			let outW = width;
			let outH = height;
			const longest = Math.max(width, height);
			if (longest > MAX_OUTPUT_DIMENSION) {
				const scale = MAX_OUTPUT_DIMENSION / longest;
				outW = Math.round(width * scale);
				outH = Math.round(height * scale);
			}

			const canvas = document.createElement('canvas');
			canvas.width = outW;
			canvas.height = outH;
			const ctx = canvas.getContext('2d');
			if (!ctx) {
				localError = 'Il browser non supporta il rendering canvas. Riprova su un altro browser.';
				return;
			}
			ctx.drawImage(img, x, y, width, height, 0, 0, outW, outH);

			const blob = await new Promise<Blob | null>((resolve) => {
				canvas.toBlob((b) => resolve(b), 'image/webp', WEBP_QUALITY);
			});
			if (!blob) {
				localError = 'Errore nella generazione del file croppato. Riprova.';
				return;
			}

			const baseName = originalFile.name.replace(/\.[^.]+$/, '') || 'image';
			const file = new File([blob], `${baseName}.webp`, { type: 'image/webp' });
			const dt = new DataTransfer();
			dt.items.add(file);
			cropped = dt.files;
			cropArea = { x, y, width, height };
			isEditing = false;
		} catch (e) {
			console.error('crop failed', e);
			localError = "Errore nel tagliare l'immagine. Riprova o usa un'altra immagine.";
		} finally {
			isProcessing = false;
		}
	}

	const combinedErrors = $derived<FieldErrors>(localError ? localError : errors);
	$effect(() => {
		console.log('DBG ImageField', name, 'localError=', localError, 'errors=', errors, 'mode=', mode);
	});
</script>

<FieldShell {label} {hint} errors={combinedErrors}>
	{#if mode === 'empty'}
		<input
			class="file-input w-full"
			class:input-error={localError}
			type="file"
			accept="image/png, image/jpeg, image/webp"
			{name}
			onchange={onFileInput}
			aria-invalid={localError ? 'true' : undefined}
		/>
	{:else if mode === 'cropping' && originalBlobUrl}
		<div class="relative h-64 w-full overflow-hidden rounded-lg bg-base-200">
			<Cropper
				image={originalBlobUrl}
				bind:crop
				bind:zoom
				cropShape={shape}
				{aspect}
				oncropcomplete={(e) => (pendingPixels = e.pixels)}
			/>
		</div>
		<div class="mt-2 flex gap-2">
			<button
				type="button"
				class="btn btn-primary btn-sm"
				disabled={!pendingPixels || isProcessing}
				onclick={confirmCrop}
			>
				{#if isProcessing}<span class="loading loading-spinner loading-sm"></span>{/if}
				Conferma ritaglio
			</button>
			<button type="button" class="btn btn-ghost btn-sm" onclick={clear}>
				Cancella
			</button>
		</div>
	{:else if mode === 'confirmed' && croppedBlobUrl}
		<div class="flex flex-col items-start gap-2">
			<div
				class="border-base-300 flex h-44 items-center justify-center overflow-hidden border"
				class:rounded-full={shape === 'round'}
				class:rounded-lg={shape === 'rect'}
			>
				<img
					src={croppedBlobUrl}
					alt="Anteprima ritagliata"
					class="h-full w-auto object-cover"
				/>
			</div>
			<div class="flex gap-2">
				<button type="button" class="btn btn-sm" onclick={() => (isEditing = true)}>
					Modifica ritaglio
				</button>
				<button type="button" class="btn btn-ghost btn-sm" onclick={clear}>
					Rimuovi immagine
				</button>
			</div>
		</div>
	{/if}
</FieldShell>
