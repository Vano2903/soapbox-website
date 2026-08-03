<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import FieldShell from './FieldShell.svelte';
	import { normalizeErrors, type FieldErrors } from './fieldErrors';

	let {
		name,
		value = $bindable(),
		label,
		hint,
		errors,
		constraints,
		min,
		max,
		readonly,
		disabled,
		autocomplete = 'bday'
	}: {
		name: string;
		value: string | null | undefined;
		label?: string;
		hint?: string;
		errors?: FieldErrors;
		constraints?: InputConstraint;
		min?: string;
		max?: string;
		readonly?: boolean;
		disabled?: boolean;
		autocomplete?: HTMLInputAttributes['autocomplete'];
	} = $props();

	const errorList = $derived(normalizeErrors(errors));
	const hasErrors = $derived(errorList.length > 0);
</script>

<FieldShell {label} {hint} {errors}>
	<input
		{...constraints}
		{name}
		{min}
		{max}
		{readonly}
		{disabled}
		{autocomplete}
		bind:value
		type="date"
		class="input w-full"
		class:input-error={hasErrors}
		class:input-success={value && !hasErrors}
		aria-invalid={hasErrors ? 'true' : undefined}
	/>
</FieldShell>
