<script lang="ts">
	import { ChevronRight, ChevronLeft, type Icon as IconType } from 'lucide-svelte';

	type Element = {
		value: string;
		current: boolean;
		disabled: boolean;
		icon?: typeof IconType;
	};

	interface Props {
		handleClick: (value: string) => void;
		elements: Element[];
		offset: number;
	}

	let { handleClick, elements, offset }: Props = $props();

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

	// onMount(() => {
	// 	console.log('elementSelection mounted');
	// 	console.log('elements offsetted:', getElements());
	// 	console.log('elements:', elements);
	// 	console.log('elements.l', elements.length - 1);
	// });

	const prevElement = () => {
		let currentIndex = elements.findIndex((value) => value.current);
		if (currentIndex === 0) {
			return;
		}
		elements[currentIndex].current = false;
		elements[currentIndex - 1].current = true;
		elementsToShow = getElements();
	};

	const nextElement = () => {
		let currentIndex = elements.findIndex((value) => value.current);
		if (currentIndex === elements.length - 1) {
			return;
		}
		elements[currentIndex].current = false;
		elements[currentIndex + 1].current = true;
		elementsToShow = getElements();
	};

	function onKeyDown(e) {
		switch (e.keyCode) {
			case 37:
				prevElement();
				break;
			case 39:
				nextElement();
				break;
		}
	}

	const moveToElement = (element: string) => {
		let currentIndex = elements.findIndex((elem) => elem.current);
		elements[currentIndex].current = false;
		elements[elements.findIndex((elem) => elem.value === element)].current = true;
		elementsToShow = getElements();
	};
</script>

<div class="block whitespace-break-spaces">
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
			onclick={() => {
				if (elem.disabled) {
					return;
				}
				moveToElement(elem.value);
				handleClick(elem.value);
			}}
			class="text-gray-{900 -
				(elementsToShow.left.length - i) * 200} w-12 text-xl sm:w-20 sm:text-3xl
      {elem.disabled ? `cursor-not-allowed` : `cursor-pointer`}"
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

	{#if elementsToShow.left.length > 0}
		<button class="h-4 w-4 cursor-pointer text-xl sm:h-6 sm:w-6 sm:text-3xl" onclick={prevElement}>
			<ChevronLeft class="h-full w-full stroke-red-600 stroke-3 " />
		</button>
	{/if}

	<button
		onclick={() => {
			if (elementsToShow.current.disabled) {
				return;
			}
			handleClick(elementsToShow.current.value);
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

		<!-- <span style="height: calc(var(--spacing) * 0.2);" class="mx-4 mt-2 block w-full bg-black" -->
		<!-- ></span> -->
	</button>
	{#if elementsToShow.right.length > 0}
		<button
			class="h-4 w-4 cursor-pointer align-baseline text-xl sm:h-6 sm:w-6 sm:text-3xl"
			onclick={nextElement}
		>
			<ChevronRight class="h-full w-full stroke-red-600 stroke-3 " />
		</button>
	{/if}

	{#each elementsToShow.right as elem, i}
		<button
			onclick={() => {
				if (elem.disabled) {
					return;
				}
				moveToElement(elem.value);
				handleClick(elem.value);
			}}
			class=" text-gray-{900 - (i + 1) * 200} w-12 text-xl sm:w-20 sm:text-3xl
      {elem.disabled ? `cursor-not-allowed` : `cursor-pointer`}"
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
<svelte:window onkeydown={onKeyDown} />

<style></style>
