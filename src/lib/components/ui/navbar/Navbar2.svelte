<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import UserButton from './UserButton.svelte';

	const latestGalleryYear = 2003;

	const links = [
		{ name: 'Chi siamo', href: '/chi-siamo' },
		{ name: 'Campionati', href: '/championships' },
		{ name: 'Galleria', href: `/gallery?year=${latestGalleryYear}` }
	];

	const { user } = $props();
</script>

<nav class="bg-primary relative z-50 flex pr-6 shadow-sm md:justify-between">
	<a class="mb-2 flex flex-nowrap items-center bg-white leading-none lg:pr-[5rem]" href="/">
		<img class="h-12 lg:h-15" src="/images/navbar/logo.jpg" alt="Logo ASD Boxrally" />
		<span class="text-primary hidden h-12 items-end pb-1 text-base/6 whitespace-nowrap md:flex">
			<span class="hidden text-4xl font-bold lg:block">BOXRALLY</span>
		</span>
	</a>

	<div
		class="border-t-[3rem] border-r-30 border-b-0 border-l-0 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent lg:border-t-[3.8rem]"
	></div>

	<div class="ml-2 flex w-full items-center justify-between py-2">
		<div class="hidden space-x-4 md:flex">
			{#each links as link}
				<a class="btn btn-primary border-0 text-2xl font-bold" href={link.href}>{link.name}</a>
			{/each}
		</div>
		<div class="block space-x-4 md:hidden">
			<Menu color="white" />
		</div>
		<UserButton {user} />
	</div>
</nav>

<style>
</style>
