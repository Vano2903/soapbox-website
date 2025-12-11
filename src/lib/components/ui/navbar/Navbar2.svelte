<script lang="ts">
	import { Menu } from 'lucide-svelte';
	import UserButton from './UserButton.svelte';
	import { on } from 'svelte/events';

	// import imageLogo from '$assets/images/navbar/logo.jpg?enhanced';

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
		{ name: 'Home', href: '/', onSmall: true, onMedium: false, dropdown: null },
		{
			name: 'Chi siamo',
			href: null,
			onSmall: true,
			onMedium: true,
			dropdown: [
				{ name: 'Origini', href: '/who-is', onSmall: true, onMedium: true },
				{ name: 'Utenti', href: '/users', onSmall: true, onMedium: true },
				{ name: 'Team', href: '/teams', onSmall: true, onMedium: true }
			]
		},
		{
			name: 'Campionati',
			href: null,
			onSmall: true,
			onMedium: true,
			dropdown: [
				{ name: 'Bacheca', href: '/bulletin-board', onSmall: true, onMedium: true },
				{ name: 'Calendario', href: '/calendars', onSmall: true, onMedium: true },
				{ name: 'Classifiche', href: '/leaderboards', onSmall: true, onMedium: true }
			]
		},
		{
			name: 'Galleria',
			href: `/gallery?year=${latestGalleryYear}`,
			onSmall: true,
			onMedium: true,
			dropdown: null
		}
	];

	const { user } = $props();

	import logo from '$assets/images/navbar/logo.jpg?w=64;48&format=avif;webp;jpg';
	import EnhancedImage from '$components/enhanedImage/enhancedImage.svelte';
</script>

{#snippet logohome()}
	<div class="flex flex-nowrap">
		<div
			class="border-t-[3rem] border-r-0 border-b-0 border-l-30 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent md:hidden lg:border-t-[3.8rem]"
		></div>

		<a
			class="mb-2 flex h-12 w-12 flex-nowrap items-center bg-white leading-none lg:h-auto lg:w-auto lg:pr-5"
			href="/"
		>
			<div class="h-12 w-12 lg:h-15 lg:w-15">
				<!-- class="h-12 w-12 lg:h-15 lg:w-15" -->
				<!-- <img
					src="/src/lib/assets/images/navbar/logo.jpg?w=64;48"
					sizes="(min-width: 1024px) 64px, 48px"
					alt="Logo ASD Boxrally"
				/> -->
				<!-- <EnhancedImage
					picture={logo}
					alt="Logo ASD Boxrally"
					sizes="(min-width: 1024px) 64px, 48px"
				/> -->
			</div>
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
	<div class="flex w-full items-center justify-between">
		<div
			class="dropdown dropdown-start block space-x-4 py-2 md:hidden"
			onfocusout={handleMenuFocusLoss}
		>
			<!-- onclick={() => (isMenuOpen = !isMenuOpen)} -->
			<button
				tabindex="0"
				class="m-0 cursor-pointer border-none bg-transparent p-2 focus:outline-none"
				aria-label="Menu"
			>
				<Menu color="white" />
			</button>
			<ul class="dropdown-content menu bg-base-100 rounded-box z-1 mt-2 w-52 border-2 p-2 shadow">
				<div class="join join-vertical flex">
					{#each links as link}
						{#if link.onSmall}
							<li>
								{#if link.dropdown}
									{#each link.dropdown as dropLink}
										<a class="btn join-item btn-soft" href={dropLink.href}>
											{dropLink.name}
										</a>
									{/each}
								{:else}
									<a class="btn join-item btn-soft" href={link.href}>{link.name}</a>
								{/if}
							</li>
						{/if}
					{/each}
				</div>
			</ul>
		</div>
		<!-- <details
			class="dropdown space-x-4 py-2 md:hidden"
			onfocusout={handleMenuFocusLoss}
			ontoggle={() => handleMenuClick()}
		>
			<summary class="btn b-0 m-0 border-none bg-transparent p-0 shadow-none focus:outline-none"
				><Menu color="white" /></summary
			>
			<ul class="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow">
				{#each links as link}
					{#if link.onSmall}
						<li>
							{#if link.dropdown}
								{#each link.dropdown as dropLink}
									<a class="btn join-item btn-soft" href={dropLink.href}>
										{dropLink.name}
									</a>
								{/each}
							{:else}
								<a class="btn join-item btn-soft" href={link.href}>{link.name}</a>
							{/if}
						</li>
					{/if}
				{/each}
			</ul>
		</details> -->

		<div class="block md:hidden">
			{@render logohome()}
		</div>
		<div class="hidden space-x-4 py-2 md:flex">
			{#each links as link}
				{#if link.onMedium}
					{#if link.dropdown}
						<div class="dropdown dropdown-hover">
							<div role="button" class="btn btn-primary border-0 text-2xl font-bold text-nowrap">
								{link.name}
							</div>
							<ul class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
								{#each link.dropdown as dropLink}
									<li>
										<a class="btn border-0" href={dropLink.href}>
											{dropLink.name}
										</a>
									</li>
								{/each}
							</ul>
						</div>
					{:else}
						<a class="btn btn-primary border-0 text-2xl font-bold text-nowrap" href={link.href}
							>{link.name}</a
						>
					{/if}
				{/if}
			{/each}
		</div>
		<UserButton {user} />
	</div>
</nav>

<style>
</style>
