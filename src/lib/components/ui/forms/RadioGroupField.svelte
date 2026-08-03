<script lang="ts" generics="T extends string | number">
	import FieldShell from './FieldShell.svelte';
	import type { FieldErrors } from './fieldErrors';

	type Option = { value: T; label: string };

	let {
		name,
		value,
		setValue,
		label,
		hint,
		errors,
		options,
		layout = 'horizontal'
	}: {
		name: string;
		value: T | null | undefined;
		setValue: (v: T) => void;
		label?: string;
		hint?: string;
		errors?: FieldErrors;
		options: Option[];
		layout?: 'horizontal' | 'vertical';
	} = $props();
</script>

<FieldShell {label} {hint} {errors}>
	<div class="flex flex-wrap gap-x-4 gap-y-2" class:flex-col={layout === 'vertical'}>
		{#each options as opt (opt.value)}
			<label class="flex cursor-pointer items-center gap-2">
				<input
					type="radio"
					class="radio"
					{name}
					value={opt.value}
					id={`${name}-${opt.value}`}
					checked={value === opt.value}
					onchange={(e) => {
						if ((e.currentTarget as HTMLInputElement).checked) setValue(opt.value);
					}}
				/>
				<span>{opt.label}</span>
			</label>
		{/each}
	</div>
</FieldShell>
