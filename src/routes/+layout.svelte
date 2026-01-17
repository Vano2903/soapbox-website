<script lang="ts">
	import '../app.css';

	import  { Toaster } from 'svelte-french-toast';
	import { ModeWatcher } from 'mode-watcher';


	import Footer from '$components/footer/Footer.svelte';
	import Navbar2 from '$components/navbar/Navbar2.svelte';
	import type { User } from '$types/pocketbase/user';
	import { env } from '$env/dynamic/public';
	import { type Snippet } from 'svelte';

	import { page } from '$app/state';


	interface Props {
		children: Snippet;
		data: { user: User };
		ogInfo?: {
			title?: string;
			description?: string;
			image?: string;
			// url: string;
			keywords?: string[];
		};
	}
	let { children, data, ogInfo }: Props = $props();
	const keywords = ogInfo?.keywords ?? ['box rally', 'bergamo', 'rally', 'soap box'];
	const baseUrl = 'https://' + (env.PUBLIC_BASE_URL ?? 'localhost:5173');
	const url = new URL(page.url.pathname, baseUrl).toString();
	const image = ogInfo?.image ?? new URL('images/carousel/8.jpeg', baseUrl).toString();
	const siteName = 'BoxRally - Sito ufficiale';
	const title = ogInfo?.title ?? 'Il Garage delle SoapBox';
	const description =
		ogInfo?.description ??
		'Scopri tutti gli eventi, news, foto e video del gruppo sportivo BoxRally: il downhill fatto in legno e su misura.';
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
		rel="stylesheet"
	/>
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={image} />
	<meta property="og:url" content={url} />
	<meta property="og:site_name" content={siteName} />
	<meta property="og:type" content="website" />
	<meta property="og:locale" content="it_IT" />
	<meta name="twitter:creator" content="@soapboxrally" />
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={image} />
	<meta name="keywords" content={keywords.join(', ')} />
</svelte:head>

<!-- <ModeWatcher /> -->
<div class="app">
	<!-- <Navbar3 /> -->
	<!-- <hr class="py-10" /> -->
	 <Toaster position="bottom-right"  />
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
