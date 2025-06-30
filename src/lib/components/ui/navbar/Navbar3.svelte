<script lang="ts">
	import UserButton from './UserButton.svelte';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { fade } from 'svelte/transition';

	const { user } = $props();
	const openMenu = writable<string | null>(null);

	const latestGalleryYear = 2003;

	const links = [
		{ name: 'Chi siamo', href: '/chi-siamo' },
		{
			name: 'Campionati',
			href: '/championships',
			subMenu: [
				{ name: 'Calendario', href: '/calendar' },
				{ name: 'Classifiche', href: '/leaderboards' },
				{ name: 'Regolamenti', href: '/regulations' }
			]
		},
		{ name: 'Galleria', href: `/gallery?year=${latestGalleryYear}` }
	];

	let isMobile = false;
	let menuArea: HTMLElement;
	onMount(() => {
		isMobile = window.innerWidth < 768;
	});

	function toggleMenu(name: string) {
		openMenu.update((current) => (current === name ? null : name));
	}

	function handleMouseLeave(event: MouseEvent) {
		if (!menuArea.contains(event.relatedTarget as Node)) {
			openMenu.set(null);
		}
	}
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
		<div class="relative flex space-x-4">
			{#each links as link (link.name)}
				<div
					bind:this={menuArea}
					class="group relative"
					role="menuitem"
					tabindex="0"
					onmouseenter={() => {
						if (!isMobile && link.subMenu) openMenu.set(link.name);
					}}
					onmouseleave={handleMouseLeave}
				>
					<a
						class="btn btn-primary cursor-pointer border-0 text-2xl font-bold"
						href={link.href}
						onclick={(event) => {
							if (isMobile && link.subMenu) {
								event.preventDefault();
								toggleMenu(link.name);
							}
						}}
					>
						{link.name}
					</a>

					{#if link.subMenu && $openMenu === link.name}
						<div
							class="absolute top-10 left-0 z-40 mt-2 w-max bg-white px-6 py-4 shadow-lg"
							transition:fade
						>
							{#each link.subMenu as subLink (subLink.name)}
								<a
									href={subLink.href}
									class="text-primary block px-4 py-2 text-lg hover:bg-gray-100"
								>
									{subLink.name}
								</a>
							{/each}
						</div>
					{/if}
				</div>
			{/each}
		</div>
		<UserButton {user} />
	</div>
</nav>
