<script lang="ts" generics="T">
	import type { Snippet } from 'svelte';
	import FieldShell from './FieldShell.svelte';
	import { normalizeErrors, type FieldErrors } from './fieldErrors';

	import type { HTMLSelectAttributes } from 'svelte/elements';

	let {
		name,
		value = $bindable(),
		label,
		hint,
		errors,
		options,
		optionValue,
		optionLabel,
		labelSnippet,
		disabled,
		autocomplete
	}: {
		name: string;
		value: string | number | null | undefined;
		label?: string;
		hint?: string;
		errors?: FieldErrors;
		options: T[];
		optionValue: (o: T) => string | number;
		optionLabel: (o: T) => string;
		labelSnippet?: Snippet<[T]>;
		disabled?: boolean;
		autocomplete?: HTMLSelectAttributes['autocomplete'];
	} = $props();

	const errorList = $derived(normalizeErrors(errors));
	const hasErrors = $derived(errorList.length > 0);
</script>

<FieldShell {label} {hint} {errors}>
	<select
		{name}
		{disabled}
		{autocomplete}
		bind:value
		class="select w-full"
		class:select-error={hasErrors}
		class:select-success={value !== null && value !== undefined && value !== '' && !hasErrors}
		aria-invalid={hasErrors ? 'true' : undefined}
	>
		{#each options as opt}
			<option value={optionValue(opt)}>
				{#if labelSnippet}{@render labelSnippet(opt)}{:else}{optionLabel(opt)}{/if}
			</option>
		{/each}
	</select>
</FieldShell>
