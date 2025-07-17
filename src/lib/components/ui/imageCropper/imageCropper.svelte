<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	import type { InputConstraint } from 'sveltekit-superforms';
	import CroppedPreview from './croppedPreview.svelte';
	import { onMount } from 'svelte';

	let {
		name,
		value = $bindable(),
		type = 'file',
		accepts = ['image/png', 'image/jpeg'],
		label,
		errors,
		constraints,
		cropped = $bindable(),
		crop = $bindable(),
		zoom = $bindable(),
		shape,
		pixels = $bindable(),
		confirmed = $bindable(),
		...rest
	}: {
		name: string;
		value: FileList | null;
		accepts?: string[];
		type?: string;
		label?: string;
		errors?: any;
		constraints?: InputConstraint;
		crop: { x: number; y: number };
		cropped: FileList | null;
		zoom: number;
		shape: 'round' | 'rect';
		pixels?: { width: number; height: number; x: number; y: number };
		confirmed?: boolean;
	} = $props();

	$effect(() => {
		console.log('image cropper data:', value, cropped, crop, zoom, shape);
	});

	let confirmedState = $state(confirmed || false);
	let croppedProxy = $state<FileList | null>(null);
	$effect(() => {
		if (croppedProxy) {
			cropped = croppedProxy;
		}
	});
</script>

<fieldset class="fieldset flex-1 text-base">
	{#if label}
		<legend class="fieldset-legend">{label}</legend>
	{/if}
	{#if value && value.length > 0}
		{@const file = value[0]}
		{@const blob = URL.createObjectURL(file)}
		{#if accepts.includes(file.type)}
			{#if !confirmedState}
				<div style="position: relative; width: 100%; height: 16rem;">
					<Cropper
						image={blob}
						{crop}
						bind:zoom
						cropShape={shape}
						aspect={shape === 'round' ? 1 : 3 / 1}
						oncropcomplete={(e) => (pixels = e.pixels)}
					/>
				</div>
				<button
					onclick={() => {
						confirmedState = true;
					}}>conferma</button
				>
				<button
					onclick={() => {
						// value.item.
						// value.length = 0;
						value = null;
					}}>cancella</button
				>
			{:else}
				<CroppedPreview
					fileType={file.type}
					blobUrl={blob}
					{shape}
					cropArea={pixels ? pixels : { x: 0, y: 0, width: 0, height: 0 }}
					bind:cropped={croppedProxy}
					fileName={file.name}
				/>
				<button
					onclick={() => {
						confirmedState = false;
					}}>modifica/cambia immagine</button
				>
			{/if}
		{:else}
			<span class="text-error"
				>File non supportato, cambia immagine, usa immagini di tipo .png o .jpeg</span
			>
			<button
				onclick={() => {
					// value.item.
					// value.length = 0;
					value = null;
				}}>cambia immagine</button
			>
		{/if}
		<!-- </p> -->
	{:else}
		<!-- class:input-success={$form.name && 'name' in $errors && !$errors.name} -->
		<input
			{...constraints}
			class:input-error={errors}
			type="file"
			accept={accepts.join(', ')}
			aria-invalid={errors ? 'true' : undefined}
			bind:files={value}
			class="input w-full"
			{name}
			{...rest}
		/>
	{/if}
	{#if errors}
		<p class="fieldset-label text-error">{errors}</p>
	{/if}
</fieldset>
