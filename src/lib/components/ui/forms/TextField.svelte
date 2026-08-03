<script lang="ts">
	import type { InputConstraint } from 'sveltekit-superforms';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { debounce } from 'throttle-debounce';
	import { untrack } from 'svelte';
	import FieldShell from './FieldShell.svelte';
	import { normalizeErrors, type FieldErrors } from './fieldErrors';

	type Props = {
		name: string;
		value: string | null | undefined;
		label?: string;
		hint?: string;
		placeholder?: string;
		errors?: FieldErrors;
		constraints?: InputConstraint;
		prefix?: string;
		type?: 'text' | 'email' | 'password' | 'tel' | 'url' | 'search';
		autocomplete?: HTMLInputAttributes['autocomplete'];
		form?: string;
		readonly?: boolean;
		disabled?: boolean;
		transform?: (raw: string) => string;
		debounceMs?: number;
		onInput?: (val: string) => void;
		delayed?: boolean;
	};

	let {
		name,
		value = $bindable(),
		label,
		hint,
		placeholder,
		errors,
		constraints,
		prefix,
		type = 'text',
		autocomplete,
		form,
		readonly,
		disabled,
		transform,
		debounceMs,
		onInput,
		delayed
	}: Props = $props();

	const errorList = $derived(normalizeErrors(errors));
	const hasErrors = $derived(errorList.length > 0);

	const fireInput = $derived(
		debounceMs && onInput ? debounce(debounceMs, onInput) : onInput
	);

	// Apply optional transform whenever `value` changes from any source.
	// Use `untrack` to avoid a feedback loop when we mutate `value` here.
	$effect(() => {
		if (!transform) return;
		const current = value ?? '';
		const next = transform(current);
		if (next !== current) {
			untrack(() => {
				value = next;
			});
		}
	});

	// Fire the user's `onInput` callback (debounced if requested) on value change.
	// Seeded with the initial value so a prefilled field doesn't fire on mount.
	let lastFired = $state<string | null | undefined>(value);
	$effect(() => {
		const current = value;
		if (current === lastFired) return;
		untrack(() => {
			lastFired = current;
		});
		fireInput?.(current ?? '');
	});
</script>

<FieldShell {label} {hint} {errors} showSuccess={!!value && !hasErrors && !delayed}>
	{#if prefix}
		<label
			class="input w-full"
			class:input-error={hasErrors}
			class:input-success={value && !hasErrors && !delayed}
		>
			<span class="label">{prefix}</span>
			<input
				{...constraints}
				{name}
				{type}
				{form}
				{readonly}
				{disabled}
				{autocomplete}
				{placeholder}
				bind:value
				aria-invalid={hasErrors ? 'true' : undefined}
			/>
		</label>
	{:else}
		<input
			{...constraints}
			{name}
			{type}
			{form}
			{readonly}
			{disabled}
			{autocomplete}
			{placeholder}
			bind:value
			class="input w-full"
			class:input-error={hasErrors}
			class:input-success={value && !hasErrors && !delayed}
			aria-invalid={hasErrors ? 'true' : undefined}
		/>
	{/if}

	{#if delayed}
		<div class="text-base-content mt-1 flex items-center gap-2 text-xs/5">
			<span>verifica disponibilità</span>
			<span class="loading loading-spinner loading-sm"></span>
		</div>
	{/if}
</FieldShell>
