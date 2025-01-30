<script lang="ts">
	import { page } from '$app/state';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import ModeDropDown from '$components/modeDropDown/modeDropDown.svelte';

	let showLinks = $state(false);

	let mounted = $state(false);
	onMount(() => (mounted = true));
</script>

<nav class="bg-transparent">
	<div class="container">
		<!-- <div class="rounded-15 flex min-h-20 items-center justify-between bg-white text-black"> -->
		<div class="logo">
			<!-- <div class="align-center flex h-20 gap-4 pl-4"> -->
			<img class="h-12" src="/images/navbar/logo.jpg" alt="Logo ASD box rally" />

			{#if mounted && window.outerWidth < 320}
				<a href="/" class="name">BoxRally</a>
			{:else if mounted}
				<a href="/" class="name"><span class="font-bold">BoxRally</span> Club</a>
			{/if}
		</div>

		<!-- <button class="menu" onclick={() => (showLinks = !showLinks)}>
			{#if showLinks}
				<img src="/images/navbar/close.svg" alt="Close icon" />
			{:else}
				<img src="/images/navbar/menu.svg" alt="Menu icon" />
			{/if}
		</button> -->

		{#key showLinks}
			<div class="flex"></div>
			<!-- <div class="links" class:show-links={showLinks} transition:slide={{ duration: 150 }}>
				<a class:accent={page.url.pathname == '/'} href="/">Home</a>
				<a class:accent={page.url.pathname == '/campionato'} href="/campionato">Campionato</a>
				<a class:accent={page.url.pathname == '/press'} href="/press">Press</a>
				<a class:accent={page.url.pathname == '/teams'} href="/teams">Teams</a>
				<a class:accent={page.url.pathname == '/gallery'} href="/gallery">Gallery</a>

				<a
					class="text-[red] duration-300"
					class:accent={page.url.pathname == '/login'}
					href="/login">Accedi</a
				>
			</div> -->
		{/key}
		<!-- <ModeDropDown /> -->
	</div>
</nav>

<style lang="postcss">
	nav {
		@apply pb-4;
	}

	/* nav a:hover {
		color: var(--blue);
	} */

	/* .container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		background-color: hsl(var(--foreground));
		color: hsl(var(--background));
		min-height: 80px;
		border-radius: 15px;
	}

	.logo {
		display: flex;
		align-items: center;
		gap: 15px;
		padding-left: 15px;
		height: 80px;
	}

	.logo img {
		height: 50px;
	}

	.logo .name {
		font-size: max(15px, 10px + 0.5vw);
		padding-top: 2px; 
	}

	.links {
		display: flex;
		gap: 20px;
		padding-right: 30px;
		font-size: max(16px, 10px + 0.5vw);
	}

	.links a {
		padding-top: 2px; 
	}

	.links a:hover {
		text-decoration: underline;
	}

	.accent {
		color: var(--blue);
	}

	.menu {
		background: 0;
		border: 0;
		cursor: pointer;
		display: none;
	}

	.menu img {
		height: 23px;
	}

	@media (max-width: 800px) {
		nav {
			padding-block: 20px;
		}

		.container {
			flex-wrap: wrap;
		}

		.logo img {
			height: 40px;
		}

		.links {
			width: 100%;
			flex-direction: column;
			gap: 0;
			display: none;
			padding-bottom: 5px;
		}

		.links a {
			height: 30px;
			width: 100%;
			display: flex;
			align-items: flex-start;
			padding-left: 15px;
		}

		.show-links {
			display: flex;
		}

		.menu {
			display: flex;
			justify-content: center;
			align-items: center;
			padding-right: 20px;
		}
	} */
</style>
