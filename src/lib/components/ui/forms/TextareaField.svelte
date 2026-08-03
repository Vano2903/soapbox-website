<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';
	import FieldShell from './FieldShell.svelte';
	import { normalizeErrors, type FieldErrors } from './fieldErrors';

	let {
		name,
		value = $bindable(),
		label,
		hint,
		placeholder,
		errors,
		constraints,
		rows = 3,
		disabled
	}: {
		name: string;
		value: string | null | undefined;
		label?: string;
		hint?: string;
		placeholder?: string;
		errors?: FieldErrors;
		constraints?: InputConstraint;
		rows?: number;
		disabled?: boolean;
	} = $props();

	const errorList = $derived(normalizeErrors(errors));
	const hasErrors = $derived(errorList.length > 0);
</script>

<FieldShell {label} {hint} {errors}>
	<textarea
		{...constraints}
		{name}
		{rows}
		{disabled}
		{placeholder}
		bind:value
		class="textarea w-full"
		class:textarea-error={hasErrors}
		class:textarea-success={value && !hasErrors}
		aria-invalid={hasErrors ? 'true' : undefined}
	></textarea>
</FieldShell>
