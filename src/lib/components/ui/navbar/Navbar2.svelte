<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import UserButton from './UserButton.svelte';

	const handleMenuClick = () => {};

	const latestGalleryYear = 2003;

	const links = [
		{ name: 'Chi siamo', href: '/chi-siamo' },
		{ name: 'Campionati', href: '/championships' },
		{ name: 'Galleria', href: `/gallery?year=${latestGalleryYear}` }
	];

	const { user } = $props();
</script>

{#snippet logohome()}
	<div class="flex flex-nowrap">
		<div
			class="border-t-[3rem] border-r-0 border-b-0 border-l-30 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent md:hidden lg:border-t-[3.8rem]"
		></div>

		<a
			class="mb-2 flex h-12 w-12 flex-nowrap items-center bg-white leading-none lg:h-auto lg:w-auto lg:pr-[5rem]"
			href="/"
		>
			<img
				class="h-12 w-12 lg:h-15 lg:w-15"
				src="/images/navbar/logo.jpg"
				alt="Logo ASD Boxrally"
			/>
			<span class="text-primary hidden h-12 items-end pb-1 text-base/6 whitespace-nowrap md:flex">
				<span class="hidden text-4xl font-bold lg:block">BOXRALLY</span>
			</span>
		</a>

		<div
			class="border-t-[3rem] border-r-30 border-b-0 border-l-0 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent lg:border-t-[3.8rem]"
		></div>
	</div>
{/snippet}

<nav class="bg-primary relative z-50 flex pr-6 pl-3 shadow-sm md:justify-between md:pl-0">
	<div class="hidden md:block">
		{@render logohome()}
	</div>
	<div class="ml-2 flex w-full items-center justify-between">
		<div class="block space-x-4 py-2 md:hidden">
			<Menu color="white" onclick={handleMenuClick} />
		</div>
		<div class="block md:hidden">
			{@render logohome()}
		</div>
		<div class="hidden space-x-4 py-2 md:flex">
			{#each links as link}
				<a class="btn btn-primary border-0 text-2xl font-bold" href={link.href}>{link.name}</a>
			{/each}
		</div>
		<UserButton {user} />
	</div>
</nav>

<style>
</style>
