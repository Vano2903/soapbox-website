<script lang="ts">
	import '../app.css';

	import { ModeWatcher } from 'mode-watcher';
	import Footer from '$components/footer/Footer.svelte';
	import Navbar2 from '$components/navbar/Navbar2.svelte';
	// import Navbar from '$components/navbar/Navbar.svelte';
	// import Navbar3 from '$components/navbar/Navbar3.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
		rel="stylesheet"
	/>
	<meta name="keywords" content="box rally, bergamo, rally, soap box" />
	<title>BoxRally</title>
</svelte:head>

<!-- <ModeWatcher /> -->
<div class="app">
	<!-- <Navbar3 /> -->
	<!-- <hr class="py-10" /> -->
	<header class="sticky top-0 z-50">
		<Navbar2 user={data.user} />
	</header>

	<div class="page">
		{@render children()}
	</div>

	<Footer />
</div>

<style>
	.page {
		min-height: calc(100dvh - 56px);
	}
	.app {
		background-color: hsl(var(--background));
		color: hsl(var(--foreground));
		/* padding-inline: 40px; */
	}

	/* @media (max-width: 600px) {
		.app {
			padding-inline: 20px;
		}
	} */
</style>
