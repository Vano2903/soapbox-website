<script lang="ts">
	import { ChevronRight, ChevronLeft, type Icon as IconType } from 'lucide-svelte';

	type Year = {
		year: number;
		current: boolean;
		disabled: boolean;
		icon?: typeof IconType;
	};

	interface Props {
		handleClick: (year: number) => void;
		years: Year[];
		offset: number;
	}

	let { handleClick, years, offset }: Props = $props();

	function getYears(): { left: Year[]; right: Year[]; current: Year } {
		let currentIndex = years.findIndex((year) => year.current);
		let left: Year[] = years.slice(currentIndex - offset, currentIndex);
		if (currentIndex - offset < 0) {
			if (currentIndex === 0) {
				left = [];
			} else if (currentIndex - offset == 0) {
				left = [years[0]];
			} else {
				left = years.slice(0, currentIndex);
			}
		}
		return {
			left: left,
			right: years.slice(currentIndex + 1, currentIndex + offset + 1),
			current: years[currentIndex]
		};
	}

	let yearsToShow = $state(getYears());

	// onMount(() => {
	// 	console.log('YearSelection mounted');
	// 	console.log('years offsetted:', getYears());
	// 	console.log('years:', years);
	// 	console.log('years.l', years.length - 1);
	// });

	const prevYear = () => {
		let currentIndex = years.findIndex((year) => year.current);
		if (currentIndex === 0) {
			return;
		}
		years[currentIndex].current = false;
		years[currentIndex - 1].current = true;
		yearsToShow = getYears();
	};

	const nextYear = () => {
		let currentIndex = years.findIndex((year) => year.current);
		if (currentIndex === years.length - 1) {
			return;
		}
		years[currentIndex].current = false;
		years[currentIndex + 1].current = true;
		yearsToShow = getYears();
	};

	function onKeyDown(e) {
		switch (e.keyCode) {
			case 37:
				prevYear();
				break;
			case 39:
				nextYear();
				break;
		}
	}

	const moveToYear = (year: number) => {
		let currentIndex = years.findIndex((y) => y.current);
		years[currentIndex].current = false;
		years[years.findIndex((y) => y.year === year)].current = true;
		yearsToShow = getYears();
	};
</script>

<div class="block whitespace-break-spaces">
	<div class="inline-block">
		<div class="flex items-baseline">
			{#if yearsToShow.left.length < yearsToShow.right.length}
				{#each { length: yearsToShow.right.length - yearsToShow.left.length }}
					<span class="w-6 sm:w-20 sm:text-3xl"></span>
				{/each}
				{#if yearsToShow.left.length === 0}
					<div class="w-3"></div>
				{/if}
			{/if}
		</div>
	</div>

	{#each yearsToShow.left as year, i}
		<button
			onclick={() => {
				if (year.disabled) {
					return;
				}
				moveToYear(year.year);
				handleClick(year.year);
			}}
			class="text-gray-{900 - (yearsToShow.left.length - i) * 200} w-12 text-xl sm:w-20 sm:text-3xl
      {year.disabled ? `cursor-not-allowed` : `cursor-pointer`}"
			disabled={year.disabled}
		>
			<div class="flex justify-center {year.icon ? 'flex flex-col items-center' : ''}">
				<span>{year.year}</span>
				{#if year.icon}
					<year.icon class="h-4 w-4 pt-2 sm:h-6 sm:w-6" />
				{/if}
			</div>
		</button>
	{/each}

	{#if yearsToShow.left.length > 0}
		<button class="h-4 w-4 cursor-pointer text-xl sm:h-6 sm:w-6 sm:text-3xl" onclick={prevYear}>
			<ChevronLeft class="h-full w-full stroke-red-600 stroke-3 " />
		</button>
	{/if}

	<button
		onclick={() => {
			if (yearsToShow.current.disabled) {
				return;
			}
			handleClick(yearsToShow.current.year);
		}}
		class="w-12 text-xl sm:w-20 sm:text-3xl {yearsToShow.current.disabled
			? `cursor-not-allowed`
			: `cursor-pointer`}"
		disabled={yearsToShow.current.disabled}
	>
		<div class="flex justify-center {yearsToShow.current.icon ? 'flex-col items-center' : ''}">
			<span class="underline">{yearsToShow.current.year}</span>
			{#if yearsToShow.current.icon}
				<yearsToShow.current.icon class="h-4 w-4 pt-2 sm:h-6 sm:w-6" />
			{/if}
		</div>

		<!-- <span style="height: calc(var(--spacing) * 0.2);" class="mx-4 mt-2 block w-full bg-black" -->
		<!-- ></span> -->
	</button>
	{#if yearsToShow.right.length > 0}
		<button
			class="h-4 w-4 cursor-pointer align-baseline text-xl sm:h-6 sm:w-6 sm:text-3xl"
			onclick={nextYear}
		>
			<ChevronRight class="h-full w-full stroke-red-600 stroke-3 " />
		</button>
	{/if}

	{#each yearsToShow.right as year, i}
		<button
			onclick={() => {
				if (year.disabled) {
					return;
				}
				moveToYear(year.year);
				handleClick(year.year);
			}}
			class=" text-gray-{900 - (i + 1) * 200} w-12 text-xl sm:w-20 sm:text-3xl
      {year.disabled ? `cursor-not-allowed` : `cursor-pointer`}"
			disabled={year.disabled}
		>
			<div class="flex justify-center {year.icon ? 'flex flex-col items-center' : ''}">
				<span>{year.year}</span>
				{#if year.icon}
					<year.icon class="h-4 w-4 pt-2 sm:h-6 sm:w-6" />
				{/if}
			</div>
		</button>
	{/each}
	<!-- padding right -->
	<div class="inline-block">
		<div class="flex items-baseline">
			{#if yearsToShow.right.length < yearsToShow.left.length}
				{#if yearsToShow.right.length === 0}
					<div class="w-3"></div>
				{/if}
				{#each { length: yearsToShow.left.length - yearsToShow.right.length }}
					<span class="w-12 text-xl sm:w-20 sm:text-3xl"></span>
				{/each}
			{/if}
		</div>
	</div>
</div>
<svelte:window onkeydown={onKeyDown} />

<style></style>
