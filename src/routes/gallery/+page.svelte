<script lang="ts">
	import YearSelection from '$lib/components/ui/yearSelection/yearSelection.svelte';
	import { LucideOrigami, LucidePanelTop } from 'lucide-svelte';

	function yearSelectionClick(year: number) {
		console.log('year click:', year);
	}

	const years = [
		{ year: 2020, current: false, disabled: false },
		{ year: 2021, current: false, disabled: false },
		{ year: 2022, current: false, disabled: false },
		{ year: 2023, current: true, disabled: false, icon: LucideOrigami },
		{ year: 2024, current: false, disabled: false },
		{ year: 2025, current: false, disabled: true },
		{ year: 2026, current: false, disabled: true },
		{ year: 2027, current: false, disabled: true }
	];
	const offset = 3;
</script>

<main>
	<br />
	<div class="flex justify-center">
		<YearSelection {offset} {years} handleClick={yearSelectionClick} />
	</div>
</main>

<style></style>
