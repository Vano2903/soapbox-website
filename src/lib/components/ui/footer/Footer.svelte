<script lang="ts">
	const basePath = '/images/footer/';
	const sponsors = [
		{
			link: basePath + 'italianoptic.png',
			active: true,
			href: 'https://italianoptic.it/',
			alt: 'italian optic'
		},
		{
			link: basePath + 'nettuno.avif',
			href: 'https://nettuno.net/',
			active: true,
			alt: 'nettuno'
		},
		{
			link: basePath + 'fassi.svg',
			href: 'https://www.fassi.com/it/',
			active: true,
			alt: 'fassi'
		},
		{
			link: basePath + 'pedretti.png',
			href: 'https://www.pedrettiserramenti.it/',
			active: true,
			alt: 'pedretti'
		}
	];
	const sections = [
		{
			name: 'informazioni',
			active: true,
			links: [
				{ herf: '/site-map', name: 'mappa del sito', active: false },
				{ herf: '/privacy-policy', name: 'informativa privacy', active: false },
				{ href: '/terms-and-conditions', name: 'termini e condizioni', active: false },
				{ href: '/statuto', name: 'statuto', active: true }
			]
		},
		{
			name: 'contenuti',
			active: true,
			links: [
				{ herf: '/', name: 'home', active: true },
				{ herf: '/archivio', name: 'archivio', active: false },
				{ href: '/contacts', name: 'contatti', active: true },
				{ href: '/lavora-con-noi', name: 'lavora con noi', active: true }
			]
		},
		{
			name: 'assistenza',
			active: true,
			links: [
				{ herf: '/content-removal', name: 'rimozione contenuti', active: true },
				{ herf: '/faq', name: 'domande frequenti', active: true },
				{ herf: '/cookies', name: 'gestione cookies', active: true },
				{ herf: '/support', name: 'supporto clienti', active: true }
			]
		}
	];
</script>

<footer class="flex min-h-[160px] flex-col bg-[#0d0f10] pt-2 pr-4 pl-4">
	<hr class="mb-2 h-1.5 w-full rounded-sm border-0 bg-red-600" />
	<div class="grid w-full grid-cols-6 gap-4">
		<div class="col-span-3 space-y-2">
			<div>
				<span class="flex items-end pb-1 text-base/6 whitespace-nowrap text-gray-100">
					<span class=" text-7xl font-extrabold">ASD</span>&nbsp;&nbsp;
					<span class="text-5xl font-bold"><span class="text-7xl">B</span>OXRALLY</span>
				</span>
			</div>
			<!-- <div class="grid grid-cols-4 items-end justify-center"> -->
			<!-- 	{#each sponsors as sponsor} -->
			<!-- 		{#if sponsor.active} -->
			<!-- 			<div class="flex h-full w-full"> -->
			<!-- 				<img class="w-24 object-contain" src={sponsor.link} alt={sponsor.alt} /> -->
			<!-- 			</div> -->
			<!-- 		{/if} -->
			<!-- 	{/each} -->
			<!-- </div> -->
			<div class="flex items-center gap-3">
				{#each sponsors as sponsor}
					{#if sponsor.active}
						<a href={sponsor.href} target="_blank">
							<img
								loading="lazy"
								class="w-24 object-contain"
								src={sponsor.link}
								alt={sponsor.alt}
							/>
						</a>
					{/if}
				{/each}
			</div>
		</div>
		{#each sections as section}
			{#if section.active}
				<div class="flex flex-col pt-4">
					<div class="text-2xl font-bold text-gray-500 uppercase">{section.name}</div>
					<div class="flex flex-col pl-2">
						{#each section.links as link}
							{#if link.active}
								<a href={link.href} class="text-gray-500">{link.name}</a>
							{/if}
						{/each}
					</div>
				</div>
			{/if}
		{/each}
	</div>

	<div class="flex w-full items-center justify-center py-2 pt-4 text-center text-gray-700">
		<span class="inner-container">
			Copyright &copy {new Date().getFullYear()} all rights reserved | Made with love by
			<a target="_blank" class="underline" href="https://github.com/vano2903">Vano</a>
			and
			<a target="_blank" class="underline" href="https://github.com/MoraGames">Morandi</a>
		</span>
	</div>
</footer>

<style>
	a {
		transition: color 0.3s ease;
		cursor: pointer;
	}

	a:hover {
		color: hsl(var(--red));
	}
</style>
