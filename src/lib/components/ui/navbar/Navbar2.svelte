<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import UserButton from './UserButton.svelte';

	let isMenuOpen = $state(false);
	const handleMenuClick = () => {
		console.log('Menu click handled.');
		isMenuOpen = !isMenuOpen;
		console.log('Updated isMenuOpen = ', isMenuOpen);
	};

	const handleMenuFocusLoss = ({
		relatedTarget,
		currentTarget
	}: {
		relatedTarget: EventTarget | null;
		currentTarget: EventTarget & Element;
	}) => {
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		isMenuOpen = false;
	};

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
		<div
			class="dropdown dropdown-start block space-x-4 py-2 md:hidden"
			onfocusout={handleMenuFocusLoss}
		>
			<button
				onclick={handleMenuClick}
				class="m-0 border-none bg-transparent p-0 focus:outline-none"
				aria-label="Menu"
			>
				<Menu color="white" />
			</button>
			<ul
				class="dropdown-content menu bg-base-100 rounded-box mt-2 w-52 border-2 p-2 shadow"
				class:hidden={!isMenuOpen}
				aria-hidden={!isMenuOpen}
			>
				<div class="join join-vertical">
					{#each links as link}
						<li><a class="btn join-item btn-soft" href={link.href}>{link.name}</a></li>
					{/each}
				</div>
			</ul>
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
