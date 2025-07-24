<script lang="ts">
	import { ChevronRight, ChevronLeft, type Icon as IconType } from 'lucide-svelte';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';

	const theme = writable('light');
	let prefersDarkMode: MediaQueryList;
	onMount(() => {
		prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)');
		theme.set(prefersDarkMode.matches ? 'dark' : 'light');
		prefersDarkMode.addEventListener('change', updateThemeOnChange);
	});

	const updateThemeOnChange = (e: MediaQueryListEvent) => theme.set(e.matches ? 'dark' : 'light');
	onDestroy(() => prefersDarkMode?.removeEventListener('change', updateThemeOnChange));

	//debugging
	theme.subscribe((newTheme) => console.log('Swapped to theme:', newTheme));

	type Element = {
		value: string;
		current: boolean;
		disabled: boolean;
		icon?: typeof IconType | null;
	};

	interface Props {
		keysInteraction?: boolean;
		handleSelection: (value: string) => void;
		elements: Element[];
		offset: number;
	}

	// let { handleClick, elements, offset = $bindable() }: Props = $props();
	let {
		keysInteraction = false,
		handleSelection: handleClick,
		elements,
		offset = $bindable()
	}: Props = $props();

	function getElements(): { left: Element[]; right: Element[]; current: Element } {
		let currentIndex = elements.findIndex((elem) => elem.current);
		let left: Element[] = elements.slice(currentIndex - offset, currentIndex);
		if (currentIndex - offset < 0) {
			if (currentIndex === 0) {
				left = [];
			} else if (currentIndex - offset == 0) {
				left = [elements[0]];
			} else {
				left = elements.slice(0, currentIndex);
			}
		}
		return {
			left: left,
			right: elements.slice(currentIndex + 1, currentIndex + offset + 1),
			current: elements[currentIndex]
		};
	}

	let elementsToShow = $state(getElements());
	let windowWidth = $state(0);

	$effect(() => {
		if (windowWidth <= 640) {
			offset = 1;
		} else if (windowWidth <= 1000) {
			offset = 2;
		} else if (windowWidth > 1000) {
			offset = 3;
		}
	});

	$effect(() => {
		elementsToShow = getElements();
	});

	const prevElement = () => {
		let currentIndex = elements.findIndex((value) => value.current);
		if (currentIndex === 0) {
			return;
		}
		elements[currentIndex].current = false;
		elements[currentIndex - 1].current = true;
		elementsToShow = getElements();
		handleClick(elements[currentIndex - 1].value);
	};

	const nextElement = () => {
		let currentIndex = elements.findIndex((value) => value.current);
		if (currentIndex === elements.length - 1) {
			return;
		}
		elements[currentIndex].current = false;
		elements[currentIndex + 1].current = true;
		elementsToShow = getElements();
		handleClick(elements[currentIndex + 1].value);
	};

	function onKeyDown(e: KeyboardEvent) {
		if (keysInteraction === false) {
			return;
		}
		switch (e.code) {
			case 'ArrowLeft':
				e.preventDefault();
				prevElement();
				break;
			case 'ArrowRight':
				e.preventDefault();
				nextElement();
				break;
		}
	}

	const moveToElement = (element: string) => {
		let currentIndex = elements.findIndex((elem) => elem.current);
		elements[currentIndex].current = false;
		elements[elements.findIndex((elem) => elem.value === element)].current = true;
		elementsToShow = getElements();
		handleClick(element);
	};
</script>

<div class="block whitespace-break-spaces">
	<div class="hidden" aria-hidden="true">
		<!-- i know this is ugly but it is what i gotta do to make tailwind compile the colors -->
		<div class="text-gray-900">900</div>
		<div class="text-gray-800">800</div>
		<div class="text-gray-700">700</div>
		<div class="text-gray-600">600</div>
		<div class="text-gray-500">500</div>
		<div class="text-gray-400">400</div>
		<div class="text-gray-300">300</div>
		<div class="text-gray-200">200</div>
		<div class="text-gray-100">100</div>
		<div class="text-gray-50">50</div>
	</div>

	<div class="inline-block">
		<div class="flex items-baseline">
			{#if elementsToShow.left.length < elementsToShow.right.length}
				{#each { length: elementsToShow.right.length - elementsToShow.left.length }}
					<span class="w-6 sm:w-20 sm:text-3xl"></span>
				{/each}
				{#if elementsToShow.left.length === 0}
					<div class="w-3"></div>
				{/if}
			{/if}
		</div>
	</div>

	{#each elementsToShow.left as elem, i}
		<button
			aria-label="Move to {elem.value} year"
			onclick={() => {
				if (!elem.disabled) moveToElement(elem.value);
			}}
			class="text-gray-{$theme == 'dark'
				? (elementsToShow.left.length - i) * 200
				: 900 - (elementsToShow.left.length - i) * 200}
			 w-12 text-xl sm:w-20 sm:text-3xl"
			class:cursor-not-allowed={elem.disabled}
			class:cursor-pointer={!elem.disabled}
			disabled={elem.disabled}
		>
			<div class=" flex justify-center {elem.icon ? 'flex flex-col items-center' : ''}">
				<span>{elem.value}</span>
				{#if elem.icon}
					<elem.icon class="h-4 w-4 pt-2 sm:h-6 sm:w-6" />
				{/if}
			</div>
		</button>
	{/each}

	{#if elementsToShow.left.length > 0}
		<button
			aria-label="move one year before {elementsToShow.current.value}"
			class="h-4 w-4 cursor-pointer text-xl sm:h-6 sm:w-6 sm:text-3xl"
			onclick={prevElement}
		>
			<ChevronLeft class="stroke-primary h-full w-full stroke-3 " />
		</button>
	{/if}

	<button
		onclick={() => {
			if (!elementsToShow.current.disabled) handleClick(elementsToShow.current.value);
		}}
		class="w-12 text-xl sm:w-20 sm:text-4xl {elementsToShow.current.disabled
			? `cursor-not-allowed`
			: `cursor-pointer`}"
		disabled={elementsToShow.current.disabled}
	>
		<div class="flex justify-center {elementsToShow.current.icon ? 'flex-col items-center' : ''}">
			<span class="underline">{elementsToShow.current.value}</span>
			{#if elementsToShow.current.icon}
				<elementsToShow.current.icon class="h-4 w-4 pt-2 sm:h-6 sm:w-6" />
			{/if}
		</div>
	</button>
	{#if elementsToShow.right.length > 0}
		<button
			aria-label="move one year after {elementsToShow.current.value}"
			class="h-4 w-4 cursor-pointer align-baseline text-xl sm:h-6 sm:w-6 sm:text-3xl"
			onclick={nextElement}
		>
			<ChevronRight class="stroke-primary h-full w-full stroke-3 " />
		</button>
	{/if}

	{#each elementsToShow.right as elem, i}
		<button
			aria-label="Move to {elem.value} year"
			onclick={() => {
				if (!elem.disabled) moveToElement(elem.value);
			}}
			class="text-gray-{$theme == 'dark' ? (i + 1) * 200 : 900 - (i + 1) * 200}
		 w-12 text-xl sm:w-20 sm:text-3xl"
			class:cursor-not-allowed={elem.disabled}
			class:cursor-pointer={!elem.disabled}
			disabled={elem.disabled}
		>
			<div class="flex justify-center {elem.icon ? 'flex flex-col items-center' : ''}">
				<span>{elem.value}</span>
				{#if elem.icon}
					<elem.icon class="h-4 w-4 pt-2 sm:h-6 sm:w-6" />
				{/if}
			</div>
		</button>
	{/each}
	<!-- padding right -->
	<div class="inline-block">
		<div class="flex items-baseline">
			{#if elementsToShow.right.length < elementsToShow.left.length}
				{#if elementsToShow.right.length === 0}
					<div class="w-3"></div>
				{/if}
				{#each { length: elementsToShow.left.length - elementsToShow.right.length }}
					<span class="w-12 text-xl sm:w-20 sm:text-3xl"></span>
				{/each}
			{/if}
		</div>
	</div>
</div>
<svelte:window bind:innerWidth={windowWidth} onkeydown={onKeyDown} />

<style></style>
