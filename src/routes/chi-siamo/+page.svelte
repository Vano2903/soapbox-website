<script lang="ts">
	import Carousel3 from '$components/carousel/carousel3.svelte';
	import type { CarouselPage } from '$tsTypes/carouselPage.js';

	const sections = [
		{
			title: 'La nostra passione',
			content:
				'Siamo appassionati costruttori di Soap-Box: veicoli senza motore in legno, nati da un regolamento tecnico di 50 anni fa. Ogni mezzo è unico, frutto di teorie strampalate su aerodinamica e velocità, realizzato con materiali semplici e tanta inventiva. Non siamo professionisti, ma miglioriamo le nostre creazioni gara dopo gara, trasformando libri maltrattati da studenti in ispirazione. L’adrenalina della discesa si unisce alla gioia di progettare opere in continua evoluzione.',
			pages: [
				{
					layout: 'horizontal',
					horizontal: { src: '/images/chi-siamo/soapbox.jpg', alt: 'macchine soapbox' },
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: { src: '/images/chi-siamo/soapbox.jpg', alt: 'macchine soapbox' },
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: { src: '/images/chi-siamo/soapbox.jpg', alt: 'macchine soapbox' },
					loading: 'lazy'
				}
			],
			activePage: 1
		},
		{
			title: 'La corsa che ci unisce',
			content:
				'La gara storica sulle Mura di Bergamo Alta è il nostro palcoscenico dal 1955. Qui sfidiamo la gravità a 80 km/h, davanti a 20.000 spettatori, competendo per due trofei: velocità e originalità. Coreografie spettacolari, materiali stravaganti e un mix tra arte e follia ci spingono a dare il massimo. È un’emozione che fa tremare le ginocchia, ma quando parte la discesa, l’energia del pubblico ci trasforma in protagonisti di un’opera collettiva.',
			pages: [
				{
					layout: 'horizontal',
					horizontal: {
						src: '/images/chi-siamo/race.jpeg',
						alt: 'discesa di bergamo con macchina'
					},
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: {
						src: '/images/chi-siamo/race.jpeg',
						alt: 'discesa di bergamo con macchina'
					},
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: {
						src: '/images/chi-siamo/race.jpeg',
						alt: 'discesa di bergamo con macchina'
					},
					loading: 'lazy'
				}
			],
			activePage: 1
		},
		{
			title: 'Lo spettacolo continua',
			content:
				'Curve? Tornanti? Per noi è solo l’inizio! Aggiungiamo scalinate in pietra, salti mozzafiato, vasche d’acqua e tunnel di schiuma. Ogni ostacolo mette alla prova veicoli e abilità, regalando colpi di scena al pubblico. Le rotture sono frequenti, ma anche quelle fanno ridere e uniscono: non c’è tifo avverso, solo incitamenti per tutti. Che sia su pavè o in percorsi "di guerra", ogni gara è una festa dove l’imprevisto diventa leggenda.',
			pages: [
				{
					layout: 'horizontal',
					horizontal: { src: '/images/chi-siamo/jump.jpeg', alt: 'macchina salta tra la schiuma' },
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: { src: '/images/chi-siamo/jump.jpeg', alt: 'macchina salta tra la schiuma' },
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: { src: '/images/chi-siamo/jump.jpeg', alt: 'macchina salta tra la schiuma' },
					loading: 'lazy'
				}
			],
			activePage: 1
		},
		{
			title: 'Una squadra con un sogno',
			content:
				'Siamo quattro amici (Scheggia, Max, Gio e Pier) decisi a rilanciare questo sport. Organizziamo gare in tutta la provincia, collaborando con comuni e Pro Loco, e abbiamo rispolverato il campionato con coppe simboliche e zero agonismi. Il sito e i social sono il nostro diario di bordo: foto, consigli tecnici e un forum vivace. Cerchiamo nuovi alleati per crescere, perché per noi l’obiettivo è uno solo: divertirsi come ragazzini, oggi e per altri 50 anni.',
			pages: [
				{
					layout: 'horizontal',
					horizontal: {
						src: 'images/chi-siamo/persone.jpeg',
						alt: 'foto di gruppo degli organizzatori'
					},
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: {
						src: 'images/chi-siamo/persone.jpeg',
						alt: 'foto di gruppo degli organizzatori'
					},
					loading: 'lazy'
				},
				{
					layout: 'horizontal',
					horizontal: {
						src: 'images/chi-siamo/persone.jpeg',
						alt: 'foto di gruppo degli organizzatori'
					},
					loading: 'lazy'
				}
			],
			activePage: 1
		}
	];
</script>

<main class="pb-16">
	<header class="flex flex-col items-center space-y-2 px-8 py-15 text-center">
		<span class="text-5xl font-bold"> Chi siamo </span>
		<p class="text-neutral-500">
			Ogni centimetro percorso racconta la tenacia di chi ci ha creduto. Siamo fatti di strampalate
			idee diventate realtà e case improvvisate ad officine, e ogni tappa è un pezzo di storia che
			ha formato questa compagnia di amici.
		</p>
	</header>
	<div class="space-y-16">
		{#each sections as section, i}
			<section
				class="flex flex-col items-center gap-8 p-8 text-center {i % 2 === 0
					? `bg-neutral-50 md:flex-row md:text-right`
					: `md:flex-row-reverse md:text-left`}"
			>
				<div class="flex flex-col content-between gap-8 md:w-1/2">
					<div>
						<h2 class="pb-4 text-3xl font-bold">{section.title}</h2>
						<p class="text-base leading-relaxed">{section.content}</p>
					</div>
					<div class="hidden flex-row flex-nowrap justify-center gap-0.5 lg:flex">
						{#each section.pages as page, i}
							<div class="relative flex max-w-1/4 flex-row items-center justify-center">
								<button
									class="mt-4 object-cover {section.activePage === i
										? `h-full w-full`
										: `h-9/10 w-9/10`}"
									onclick={() => (section.activePage = i)}
								>
									<img
										class="rounded-md"
										loading="lazy"
										src={page.horizontal.src}
										alt={page.horizontal.alt}
									/>
								</button>
								<div
									class="pointer-events-none absolute top-0 left-0 z-10 h-full w-full
										{section.activePage === i ? `bg-white/0` : `bg-white/50`} "
								></div>
							</div>
						{/each}
					</div>
				</div>
				<div class="hidden flex-col content-between gap-4 md:flex md:w-1/2">
					<img
						loading="lazy"
						class="rounded-sm object-cover"
						src={section.pages[section.activePage].horizontal.src}
						alt={section.pages[section.activePage].horizontal.alt}
					/>
					<div class="flex flex-row flex-nowrap justify-center gap-0.5 lg:hidden">
						{#each section.pages as page, i}
							<div class="relative flex max-w-1/4 flex-row items-center justify-center">
								<button
									class="object-cover {section.activePage === i
										? `h-full w-full`
										: `h-9/10 w-9/10`}"
									onclick={() => (section.activePage = i)}
								>
									<img
										class="rounded-md"
										loading="lazy"
										src={page.horizontal.src}
										alt={page.horizontal.alt}
									/>
								</button>
								<div
									class="pointer-events-none absolute top-0 left-0 z-10 h-full w-full
										{section.activePage === i ? `bg-white/0` : `bg-white/50`} "
								></div>
							</div>
						{/each}
					</div>
				</div>
				<div class="block md:hidden">
					<Carousel3
						pages={section.pages as CarouselPage[]}
						withControls={true}
						startingPage={section.activePage}
					/>
				</div>
			</section>
		{/each}
	</div>
</main>

<style>
</style>
