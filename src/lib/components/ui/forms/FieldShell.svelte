<script lang="ts">
	import type { Snippet } from 'svelte';
	import { normalizeErrors, type FieldErrors } from './fieldErrors';

	let {
		label,
		hint,
		errors,
		successHint,
		showSuccess = false,
		children
	}: {
		label?: string;
		hint?: string;
		errors?: FieldErrors;
		successHint?: string;
		showSuccess?: boolean;
		children: Snippet;
	} = $props();

	const errorList = $derived(normalizeErrors(errors));
</script>

<fieldset class="fieldset flex-1 text-base">
	{#if label}
		<legend class="fieldset-legend">{label}</legend>
	{/if}

	{@render children()}

	{#if hint && errorList.length === 0}
		<p class="text-base-content mb-2 text-xs/5">{hint}</p>
	{/if}

	{#if errorList.length === 1}
		<p class="fieldset-label text-error">{errorList[0]}</p>
	{:else if errorList.length > 1}
		<ul class="fieldset-label text-error flex-col items-start">
			{#each errorList as e}
				<li>{e}</li>
			{/each}
		</ul>
	{:else if showSuccess && successHint}
		<p class="fieldset-label text-success">{successHint}</p>
	{/if}
</fieldset>
