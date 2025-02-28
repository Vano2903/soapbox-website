<script lang="ts">
	import ElementSelection from '$components/elementSelection/elementSelection.svelte';
	import { LucideOrigami, LucidePanelTop } from 'lucide-svelte';

	function yearSelectionClick(year: string) {
		console.log('year click:', year);
	}

	const years = [
		{ value: '2020', current: false, disabled: false },
		{ value: '2021', current: false, disabled: false },
		{ value: '2022', current: false, disabled: false },
		{ value: '2023', current: true, disabled: false, icon: LucideOrigami },
		{ value: '2024', current: false, disabled: false },
		{ value: '2025', current: false, disabled: true },
		{ value: '2026', current: false, disabled: true },
		{ value: '2027', current: false, disabled: true }
	];
	const offset = 3;
</script>

<main>
	<br />
	<div class="flex justify-center">
		<ElementSelection {offset} elements={years} handleClick={yearSelectionClick} />
	</div>
</main>

<style></style>
