<script lang="ts">
	import Cropper from 'svelte-easy-crop';
	import type { InputConstraint } from 'sveltekit-superforms';

	let {
		name,
		value = $bindable(),
		type = 'file',
		accept = 'image/png, image/jpeg',
		label,
		errors,
		constraints,
		crop = $bindable(),
		zoom = $bindable(),
		shape,
		pixels = $bindable(),
		...rest
	}: {
		name: string;
		value: FileList;
		accept?: string;
		type?: string;
		label?: string;
		errors?: string[];
		constraints?: InputConstraint;
		crop: { x: number; y: number };
		zoom: number;
		shape: 'round' | 'rect';
		pixels: { width: number; height: number; x: number; y: number };
	} = $props();

	$effect(() => {
		console.log('value', value);
		// console.log('value', value?.name, value?.size, value?.type);
	});

	$effect(() => {
		console.log('pixels', $state.snapshot(pixels));
	});

	// let crop = $state({ x: 0, y: 0 });
	// let zoom = $state(1);
	let confirmed = $state(false);

	const displayWidth = 200; // Adjust this value as needed
	let scalingFactor = $derived(displayWidth / pixels.width);
	let translateX = $derived(-pixels.x * scalingFactor);
	let translateY = $derived(-pixels.y * scalingFactor);
	let scaledWidth = $derived( * scalingFactor);
	let scaledHeight = $derived(originalHeight * scalingFactor);
</script>

<!-- <label>
  {#if label}<span>{label}</span><br />{/if}
  <input
    {name}
    {type}
    bind:value
    aria-invalid={errors ? 'true' : undefined}
    {...constraints}
    {...rest} 
  />
</label>
{#if errors}<span class="invalid">{errors}</span>{/if} -->

{#if value?.length > 0}
	{@const file = value[0]}
	<!-- <p class="text-base-content mb-2 text-xs/5"> -->
	{#if file.type === 'image/png' || file.type === 'image/jpeg'}
		<!-- <div class="h-1/4 w-3/4">
		  -->
		{#if !confirmed}
			<div style="position: relative; width: 100%; height: 16rem;">
				<Cropper
					image={URL.createObjectURL(file)}
					bind:crop
					bind:zoom
					cropShape={shape}
					aspect={shape === 'round' ? 1 : 16 / 9}
					oncropcomplete={(e) => (pixels = e.pixels)}
				/>
			</div>
			<button
				onclick={() => {
					confirmed = true;
				}}>conferma</button
			>
			<button
				onclick={() => {
					// value.item.
					// value.length = 0;
				}}>cancella</button
			>
		{:else}
			<div class="h-32 w-32 overflow-hidden rounded-full">
				<!-- <img src="https://i.sstatic.net/wPh0S.jpg" alt="Donald Duck"> -->
				<img
				src={URL.createObjectURL(file)}
					alt={file.name}
				style="
				display: block;
				width: {scaledWidth}px;
				height: {scaledHeight}px;
				transform: translate({translateX}px, {translateY}px);
			  "
			/>
				<!-- <img
					class="width: {pixels.width}px; height: {pixels.height}px; margin: -{pixels.x}px 0 0 -{pixels.y}px;"
					src={URL.createObjectURL(file)}
					alt={file.name}
				/> -->
				<!-- class="h-32 w-32 rounded-full object-cover" -->
			</div>
			<button
				onclick={() => {
					confirmed = false;
				}}>modifica/cambia immagine</button
			>
		{/if}
	{:else}
		<span class="text-error"
			>File non supportato, cambia immagine, usa immagini di tipo .png o .jpeg</span
		>
	{/if}
	<!-- </p> -->
{:else}
	<fieldset class="fieldset flex-1 text-base">
		{#if label}
			<legend class="fieldset-legend">{label}</legend>
		{/if}
		<!-- class:input-success={$form.name && 'name' in $errors && !$errors.name} -->
		<input
			{...constraints}
			class:input-error={errors}
			type="file"
			{accept}
			aria-invalid={errors ? 'true' : undefined}
			bind:files={value}
			class="input w-full"
			{name}
			{...rest}
		/>
		{#if errors}
			<p class="fieldset-label text-error">{errors}</p>
		{/if}
	</fieldset>
{/if}
