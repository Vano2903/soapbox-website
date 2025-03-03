<script lang="ts">
	const latestGalleryYear = 2015;

	const links = [
		{ name: 'Chi siamo', href: '/chi-siamo' },
		{ name: 'Campionati', href: '/championships' },
		{ name: 'Galleria', href: `/gallery?year=${latestGalleryYear}` }
	];
</script>

<nav class="relative z-50 flex bg-red-600 sm:pr-6 md:justify-between lg:pr-6">
	<a
		class="mb-2 flex flex-nowrap items-center bg-white leading-none md:pr-[2rem] lg:pr-[5rem]"
		href="/"
	>
		<img class="h-12 md:pr-2 lg:h-16" src="/images/navbar/logo.jpg" alt="Logo ASD box rally" />
		<span class="hidden h-12 items-end pb-1 text-base/6 whitespace-nowrap text-red-600 md:flex">
			<span class="text-4xl font-extrabold lg:text-5xl">ASD</span>&nbsp;&nbsp;
			<span class="hidden text-3xl font-bold lg:block"><span class="text-5xl">B</span>OXRALLY</span>
		</span>
	</a>

	<div
		class="border-t-[3rem] border-r-30 border-b-0 border-l-0 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent lg:border-t-[4rem]"
	></div>

	<div class="ml-2 hidden w-full items-center justify-between py-2 md:flex">
		<div class="">
			<!-- class="pr-10 text-2xl font-bold text-white"  -->
			{#each links as link}
				<a
					class="rounded-md px-4 py-2 text-2xl font-bold text-white hover:bg-red-700 hover:text-white"
					href={link.href}>{link.name}</a
				>
			{/each}
		</div>
		<div class="flex cursor-pointer items-center text-white">
			<a href="/login" class="pr-2">Accedi</a>
			<img class="h-10 fill-current" src="/images/navbar/profile.svg" alt="Login icon" />
		</div>
	</div>
</nav>

<style>
</style>
