<script lang="ts">
	import UserButton from './UserButton.svelte';

	const latestGalleryYear = 2003;

	const links = [
		{ name: 'Chi siamo', href: '/chi-siamo' },
		{ name: 'Campionati', href: '/championships' },
		{ name: 'Galleria', href: `/gallery?year=${latestGalleryYear}` }
	];

	const { user } = $props();
</script>

<nav class="bg-primary relative z-50 flex shadow-sm sm:pr-6 md:justify-between lg:pr-6">
	<a
		class="mb-2 flex flex-nowrap items-center bg-white leading-none md:pr-[2rem] lg:pr-[5rem]"
		href="/"
	>
		<img class="h-12 md:pr-2 lg:h-16" src="/images/navbar/logo.jpg" alt="Logo ASD box rally" />
		<span class="text-primary hidden h-12 items-end pb-1 text-base/6 whitespace-nowrap md:flex">
			<span class="text-4xl font-extrabold lg:text-5xl">ASD</span>&nbsp;&nbsp;
			<span class="hidden text-3xl font-bold lg:block"><span class="text-5xl">B</span>OXRALLY</span>
		</span>
	</a>

	<div
		class="border-t-[3rem] border-r-30 border-b-0 border-l-0 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent lg:border-t-[4rem]"
	></div>

	<div class="ml-2 hidden w-full items-center justify-between py-2 md:flex">
		<div class="space-x-4">
			{#each links as link}
				<a class="btn btn-primary border-0 text-2xl font-bold" href={link.href}>{link.name}</a>
			{/each}
		</div>
		<UserButton {user} />
	</div>
</nav>

<style>
</style>
