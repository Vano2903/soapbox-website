<script lang="ts">
	import { EventKind, type EventType } from '$tsTypes/newRace.js';
	import type { OrganizationStatType } from '$tsTypes/organizationStat.js';
	import Carousel3 from '$components/carousel/carousel3.svelte';
	import EventInfoBox from '$components/eventInfoBox/eventInfoBox.svelte';
	import { fade } from 'svelte/transition';
	import { Eye, Hammer, MapPinned, Trophy, Heart, VolumeX, Volume2 } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { SponsorSlider } from '$tsTypes/SponsorSlider.js';
	import type { CarouselPage } from '$tsTypes/carouselPage.js';

	const { data } = $props();
	const {
		eventInfo,
		organizationStats
	}: {
		eventInfo: EventType;
		organizationStats: OrganizationStatType[];
	} = data;

	let carouselImages: CarouselPage[] = [
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/1.jpeg', alt: 'Car 1' },
			vertical: { src: 'images/carousel/1.jpeg', alt: 'Car 1' },
			loading: 'eager'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/2.jpeg', alt: 'Car 2' },
			vertical: { src: 'images/carousel/2.jpeg', alt: 'Car 2' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/3.jpeg', alt: 'Car 3' },
			vertical: { src: 'images/carousel/3.jpeg', alt: 'Car 3' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/4.jpeg', alt: 'Car 4' },
			vertical: { src: 'images/carousel/4.jpeg', alt: 'Car 4' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/5.jpeg', alt: 'Car 5' },
			vertical: { src: 'images/carousel/5.jpeg', alt: 'Car 5' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/6.jpeg', alt: 'Car 6' },
			vertical: { src: 'images/carousel/6.jpeg', alt: 'Car 6' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/7.jpeg', alt: 'Car 7' },
			vertical: { src: 'images/carousel/7.jpeg', alt: 'Car 7' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/8.jpeg', alt: 'Car 8' },
			vertical: { src: 'images/carousel/8.jpeg', alt: 'Car 8' },
			loading: 'lazy'
		},
		{
			layout: 'both',
			breakpoint: 'md',
			horizontal: { src: 'images/carousel/9.jpeg', alt: 'Car 9' },
			vertical: { src: 'images/carousel/9.jpeg', alt: 'Car 9' },
			loading: 'lazy'
		}
	];

	let activeTab = $state('Guarda');
	const tabs = [
		{ label: 'Guarda', icon: Eye },
		{ label: 'Crea', icon: Hammer },
		{ label: 'Corri', icon: MapPinned },
		{ label: 'Vinci', icon: Trophy },
		{ label: 'Ama', icon: Heart }
	];
	const tabContents: Record<string, { text: string; image: string }> = {
		Guarda: {
			text: 'Ogni curva è uno spettacolo, ogni discesa un tuffo al cuore. I nostri bolidi di legno scendono tra l’entusiasmo del pubblico: bambini che sognano, anziani che ricordano, sconosciuti che applaudono. BoxRally è un rito collettivo, una festa di paese che vibra di adrenalina e sorrisi.',
			image: '/images/chi-siamo/jump.jpeg'
		},
		Crea: {
			text: 'Bastano legno, bulloni e un pizzico di follia. Costruire il proprio mezzo è più che un gesto tecnico: è l’inizio di un’avventura. Ogni squadra è un’officina di sogni, dove l’arte prende forma tra mani sporche e idee brillanti. L’iscrizione? Semplice. Il risultato? Indimenticabile.',
			image: '/images/chi-siamo/jump.jpeg'
		},
		Corri: {
			text: 'Non ci basta scendere, ci mettiamo il cuore. Le nostre piste sono vere strade di montagna, dure e magnifiche. Le curve non perdonano, il legno canta e i freni urlano. Ma ci si lancia insieme, con l’anima in gola e lo sguardo fisso all’orizzonte. Qui si corre davvero.',
			image: '/images/chi-siamo/jump.jpeg'
		},
		Vinci: {
			text: 'Vincere non è solo un trofeo, è arrivare in fondo con gli amici che ti aspettano al traguardo. È rompere qualcosa e ricostruirla insieme. È condividere una risata, una foto, un abbraccio. Il premio è esserci stati, è aver lasciato una traccia su quell’asfalto vissuto.',
			image: '/images/chi-siamo/jump.jpeg'
		},
		Ama: {
			text: 'BoxRally è cura quotidiana, amore per un gioco serio fatto di sfide, dettagli e persone. È l’adrenalina che non svanisce, l’attesa per la prossima tappa, l’orgoglio di essere parte di qualcosa che pulsa. Non siamo solo appassionati: siamo legati da un’energia che non si spegne mai.',
			image: '/images/chi-siamo/jump.jpeg'
		}
	};

	let isHighlightMuted = $state(true);
	function toggleMute() {
		const video = document.getElementById('highlight-video') as HTMLVideoElement | null;
		if (video) {
			isHighlightMuted = !isHighlightMuted;
			video.muted = isHighlightMuted;
			if (!isHighlightMuted) {
				video.volume = 0.05;
			}
		}
	}

	const mainSponsors = ['fassi.svg', 'pedretti.png', 'italianoptic.png', 'cargoway.png'];
	const secondarySponsors = ['soapbox.jpg', 'ipaas-favicon.png', 'cargoway-rejected.jpg'];
	let sizedMainSponsors = $state(mainSponsors);
	let sizedSecondarySponsors = $state(secondarySponsors);

	const speed = 100;
	const speedMainSponsors = 100;
	const speedSecondarySponsors = 100;
	let loopWidthMainSponsors = 0;
	let loopWidthSecondarySponsors = 0;

	let mainSponsorsSlider: SponsorSlider = $state({
		sponsors: mainSponsors,
		sizedSponsors: mainSponsors,
		speed: 100,
		loopWidth: 0
	});
	let secondarySponsorsSlider: SponsorSlider = $state({
		sponsors: secondarySponsors,
		sizedSponsors: secondarySponsors,
		speed: 100,
		loopWidth: 0
	});
	let mainRow: HTMLDivElement;
	let secondaryRow: HTMLDivElement;

	onMount(() => {
		let observer: ResizeObserver;

		function resizeArrayToMin(base: string[], minLength: number): string[] {
			if (base.length === 0) return [];
			let result: string[] = [];
			while (result.length < minLength) {
				result = result.concat(base);
			}
			// console.log('result = [' + result.length + '] = ' + result);
			return result;
		}

		function calculateSizes() {
			console.log('ricalculating Sizes @' + Date.now());
			// Get all logos in first row
			const logos = mainRow.querySelectorAll('.logo') as NodeListOf<HTMLElement>;
			if (!logos.length) return;

			// Calculate box + gap by measuring the difference between logos
			const first = logos[0];
			const second = logos[1];
			if (!second) return;
			const fullBox = second.offsetLeft - first.offsetLeft;

			const screenWidth = window.innerWidth;
			const neededBoxes = Math.ceil(screenWidth / first.offsetWidth) + 1;
			// console.log('\n  screenWidth = ' + screenWidth + '\n  boxWidth = ' + first.offsetWidth);

			mainSponsorsSlider.sizedSponsors = resizeArrayToMin(mainSponsorsSlider.sponsors, neededBoxes);
			secondarySponsorsSlider.sizedSponsors = resizeArrayToMin(
				secondarySponsorsSlider.sponsors,
				neededBoxes
			);

			mainSponsorsSlider.loopWidth = fullBox * mainSponsorsSlider.sizedSponsors.length;
			secondarySponsorsSlider.loopWidth = fullBox * secondarySponsorsSlider.sizedSponsors.length;

			// Reset transforms so we don't accumulate weird values
			mainRow.style.transform = '';
			secondaryRow.style.transform = '';

			// console.log(
			// 	'recalculated:' +
			// 		'\n  neededBoxes = ' +
			// 		neededBoxes +
			// 		'\n  loopWidth = ' +
			// 		loopWidthMainSponsors +
			// 		'\n  sizedSponsors [' +
			// 		sizedMainSponsors.length +
			// 		'] = ' +
			// 		sizedMainSponsors
			// );
		}

		function startScroll(
			sponsorSlider: SponsorSlider,
			row: HTMLElement,
			reverse = false,
			offset = 0
		) {
			let x = offset;
			let last = performance.now();

			function step(now: number) {
				const delta = (now - last) / 1000;
				last = now;

				x += sponsorSlider.speed * delta;

				// wrap around exactly at loopWidth
				if (x >= sponsorSlider.loopWidth) x -= sponsorSlider.loopWidth;
				const translateX = reverse ? x : -x;

				row.style.transform = `translateX(${translateX.toFixed(2)}px)`;
				requestAnimationFrame(step);
			}

			requestAnimationFrame(step);
		}

		requestAnimationFrame(() => {
			calculateSizes();

			// Observe size changes in logo boxes
			observer = new ResizeObserver(() => {
				calculateSizes();
			});

			// Observe first row only (since all logos are same size)
			const logo = mainRow.querySelector('.logo') as HTMLElement;
			if (logo) observer.observe(logo);

			const first = sizedMainSponsors.length > 0 ? 0 : null;
			const second = sizedSecondarySponsors.length > 1 ? 1 : null;
			if (first !== null && second !== null) {
				startScroll(mainSponsorsSlider, mainRow, false, 0);
				startScroll(
					secondarySponsorsSlider,
					secondaryRow,
					false,
					secondarySponsorsSlider.loopWidth / secondarySponsorsSlider.sizedSponsors.length / 2
				);
			}
		});

		return () => observer?.disconnect();
	});
</script>

<main class="gap-2 pb-10">
	<div class="carousel">
		<!-- <Carousel /> -->
		<Carousel3 pages={carouselImages} />
		<aside
			class="absolute z-10 box-border hidden h-87/100 max-h-[380px] w-1/3 max-w-[430px] rounded-l-xl bg-white py-2 pl-2 md:block lg:h-3/4 lg:max-h-[450px] lg:w-1/4 xl:max-h-[550px]"
		>
			<div class="inner p-2 lg:p-4">
				<EventInfoBox {eventInfo} locatedOnCarousel={true} />
			</div>
		</aside>
	</div>
	<p class="xs:block hidden">EXTRA-SMALL</p>
	<p class="hidden sm:block">SMALL</p>
	<div>
		<!-- Aspettando l'Evento -->
		<hr class="mx-4 my-3 h-1 w-auto rounded-sm border-0 bg-red-600 md:hidden lg:mt-0" />
		<div class="mx-4 mb-4 px-2 md:hidden">
			<p class="pb-4 text-center text-5xl font-bold">
				Aspettando l'<span class="text-red-600">EVENTO</span>!
			</p>
			<div class="flex flex-row justify-center sm:justify-evenly">
				<div class="mr-5 flex max-w-1/3 flex-col justify-center sm:mr-0">
					{#if eventInfo.kind === EventKind.NextEventKind}
						<p class="pb-4 text-right text-base/5">
							<span class="xs:hidden">Le iscrizioni all'evento sono aperte!</span>
							<span class="xs:block hidden">Sono aperte le iscrizioni per il prossimo evento!</span>
						</p>
						<p class="pb-4 text-right text-base/5">
							<span class="xs:hidden"> Registrati prima che terminino i posti. </span>
							<span class="xs:block hidden">
								Compila la tua partecipazione prima che esauriscano i posti disponibili.
							</span>
						</p>
					{:else if eventInfo.kind === EventKind.HighlightKind}
						<p class="pb-4 text-right text-base/5">
							<span class="xs:hidden">Le iscrizioni sono ancora chiuse</span>
							<span class="xs:block hidden"
								>Ancora non ci sono iscrizioni aperte per gli eventi.</span
							>
						</p>
						<p class="pb-4 text-right text-base/5">
							<span class="xs:hidden">Intanto puoi guardarti i momenti speciali.</span>
							<span class="xs:block hidden">
								Nel frattempo puoi andare a guardare i momenti speciali che abbiamo scelto apposta
								per te.
							</span>
						</p>
					{/if}
					<div class="flex flex-row justify-end">
						<button class="btn btn-error text-foreground max-w-70">
							{#if eventInfo.kind === EventKind.NextEventKind}Iscriviti{:else if eventInfo.kind === EventKind.HighlightKind}Guarda{/if}
						</button>
					</div>
				</div>
				<div class="flex flex-col justify-center">
					<div class="box-border rounded-xl bg-neutral-100 p-2">
						<div class="inner fullborder p-1 lg:p-4">
							<EventInfoBox {eventInfo} locatedOnCarousel={false} />
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Noi siamo BoxRally -->
		<hr class="mx-4 my-3 h-1 w-auto rounded-sm border-0 bg-red-600 lg:mt-0" />
		<div>
			<p class="pb-4 text-center text-5xl font-bold">
				Noi siamo <span class="text-red-600">BOXRALLY</span>!
			</p>

			<!-- Organization statistics -->
			<section class="mb-4 px-4 py-2 text-center">
				<h2 class="text-xl font-bold">Non solo corse:</h2>
				<p class="py-1 text-lg leading-relaxed">
					Boxrally è il gioco serio di chi crea, sogna e corre insieme.<br />
					Le nostre piste? Le strade vere. I nostri piloti? Amici, artigiani, sognatori.<br />
					Costruiamo meraviglie di legno e sfrecciamo giù per le montagne con orgoglio.
				</p>

				<div class="my-4 flex flex-row flex-wrap justify-evenly">
					{#each organizationStats as stat}
						<div class="m-2 flex flex-col items-center rounded-xl bg-neutral-100 p-4 text-center">
							<hr class="mx-auto mb-4 h-0.75 w-12 rounded-sm border-0 bg-red-600" />
							<h3
								class="bg-gradient-to-r from-black via-red-800 to-red-600 bg-clip-text text-7xl font-bold text-transparent lg:text-8xl"
							>
								{stat.value}
							</h3>
							<p class="text-lg lg:text-xl">{stat.subject} {stat.context}</p>
						</div>
					{/each}
				</div>

				<p class="py-1 text-lg leading-relaxed">
					Ogni anno ci impegniamo per offrire più spettacolo, più sicurezza, più passione.<br />
					Cresciamo ad ogni gara aggiungendo nuove tappe al calendario, ma il cuore resta lo stesso:
					la nostra squadra che corre unita e non si ferma mai.
				</p>
			</section>

			<!-- Tabulated walkthrough -->
			<section class="bg-neutral-50 px-4 py-2 pb-8">
				<div class="flex flex-row flex-wrap justify-evenly">
					{#each tabs as tab}
						<button
							class="flex flex-col items-center gap-2 p-2 text-left transition-all duration-200 hover:text-red-600"
							onclick={() => (activeTab = tab.label)}
						>
							<div class="flex flex-row items-center">
								<span>
									{#if tab.icon}
										<tab.icon class="h-4 w-4 text-black" />
									{/if}
								</span>
								<span class="pl-2 text-lg">{tab.label}</span>
							</div>
							<hr
								class="mx-auto h-0.5 w-4/5 rounded-sm border-0 transition-all duration-200 {activeTab ===
								tab.label
									? 'bg-red-600'
									: 'bg-neutral-300'}"
							/>
						</button>
					{/each}
				</div>
				<div class="mt-6 text-lg text-gray-700">
					<div transition:fade class="flex flex-col items-center justify-evenly px-4 sm:flex-row">
						<p
							class="max-w-5/9 pb-4 text-center text-sm leading-relaxed sm:pr-4 sm:pb-0 sm:text-right md:text-base lg:text-lg"
						>
							{tabContents[activeTab].text}
						</p>
						<div class="relative flex max-w-4/9 min-w-[300px] justify-center bg-red-600 p-0.75">
							<div
								class="absolute -top-0 -left-0 z-10 h-0 w-0 border-t-[40px] border-r-[40px] border-t-red-600 border-r-transparent lg:border-t-[60px] lg:border-r-[60px]"
							></div>

							<div
								class="absolute -right-0 -bottom-0 z-10 h-0 w-0 border-b-[40px] border-l-[40px] border-b-red-600 border-l-transparent lg:border-b-[60px] lg:border-l-[60px]"
							></div>
							<img
								loading="lazy"
								class="border-4 border-white object-cover"
								src={tabContents[activeTab].image}
								alt="macchina salta tra la schiuma"
							/>
						</div>
					</div>
				</div>
				<div class="mt-6 flex justify-center">
					<a href="/chi-siamo" class="group text-lg font-bold transition duration-300">
						Conoscici Meglio
						<span
							class="mx-1 block h-0.75 max-w-0 bg-red-600 transition-all duration-500 group-hover:max-w-full"
						></span>
					</a>
				</div>
			</section>

			<!-- This video is just a template while we record and produce the real thing! -->
			<!-- Please don't sue us for any copyright claims. -->
			<!-- Captivating video -->
			<section class="relative my-8 h-[60vh]">
				<video
					id="highlight-video"
					autoplay
					muted
					loop
					playsinline
					disablepictureinpicture
					controlsList="nodownload nofullscreen noremoteplayback"
					class="absolute h-full w-full object-cover"
				>
					<source src="/videos/highlight-2.mp4" type="video/mp4" />
				</video>
				<div class="absolute flex h-full w-full items-center justify-center bg-black/40">
					<h2 class="px-4 text-center text-4xl font-bold text-white md:text-5xl">
						<!-- Dove finisce l’asfalto, comincia la leggenda -->
						Ogni curva è una promessa di leggenda.
					</h2>
				</div>
				<button
					onclick={toggleMute}
					class="absolute right-4 bottom-4 z-10 rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-black backdrop-blur hover:bg-white"
				>
					{#if isHighlightMuted}
						<VolumeX />
					{:else}
						<Volume2 />
					{/if}
				</button>
			</section>

			<!-- Sponsor slider -->
			<section class="relative my-16 px-4">
				<h3 class="mb-2 text-center text-2xl font-bold text-gray-800 md:text-3xl">
					Il supporto che crede in noi, spinge le nostre vetture
				</h3>
				<p class="mx-auto mb-8 max-w-3xl text-center text-base text-gray-600 md:text-lg">
					Ogni gesto di supporto ha un peso enorme nella nostra discesa. Non contano solo le mani
					che spingono il carretto, ma anche quelle che mettono linfa vitale nel progetto. La grande
					famiglia che siamo sarebbe incompleta senza i nostri sponsor, sono la forza invisibile che
					abbraccia la nostra passione e rende possibile l’impossibile.
				</p>

				<div class="relative m-auto bg-white py-12 lg:w-5/6">
					<div class="relative">
						<div
							class="pointer-events-none absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r from-white to-transparent"
						></div>
						<div
							class="pointer-events-none absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l from-white to-transparent"
						></div>

						<div class="mt-4 overflow-hidden">
							<div class="flex gap-6 py-1 will-change-transform" bind:this={mainRow}>
								{#each [...mainSponsorsSlider.sizedSponsors, ...mainSponsorsSlider.sizedSponsors] as logo}
									<div
										class="logo xs:h-24 xs:w-40 flex h-20 w-32 flex-none items-center justify-center rounded-xl bg-white shadow md:h-28 md:w-48"
									>
										<img
											src={`/images/sponsor/${logo}`}
											alt={logo}
											class="max-h-[80%] max-w-[80%]"
											loading="lazy"
										/>
									</div>
								{/each}
							</div>
						</div>

						<div class="mt-4 overflow-hidden">
							<div class="flex gap-6 py-1 will-change-transform" bind:this={secondaryRow}>
								{#each [...secondarySponsorsSlider.sizedSponsors, ...secondarySponsorsSlider.sizedSponsors] as logo}
									<div
										class="logo xs:h-24 xs:w-40 flex h-20 w-32 flex-none items-center justify-center rounded-xl bg-white shadow md:h-28 md:w-48"
									>
										<img
											src={`/images/sponsor/${logo}`}
											alt={logo}
											class="max-h-[80%] max-w-[80%]"
											loading="lazy"
										/>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- Quoted comments -->
			<section class="my-12 px-4">
				<h3 class="pb-6 text-center text-3xl font-bold">Per noi ogni voce conta:</h3>
				<p class="mx-auto mb-8 max-w-3xl text-center text-base text-gray-600 md:text-lg">
					Fin dalle nostre origini, ascoltiamo tutti: dai piloti, agli organizzatori fino agli
					spettatori, tutti uniti da storie di emozione e impegno condiviso, per una passione che
					amiamo.
				</p>
				<div class="m-auto grid max-w-5/6 gap-6 md:max-w-full md:grid-cols-3 lg:max-w-4/5">
					<div class="flex flex-col justify-between rounded-lg bg-neutral-50 p-4 shadow-md">
						<p class="text-sm italic">
							"Questa gara è stata fantastica, ci siamo superati sia come impegno di squadra, sia
							come fiducia tra fratelli."
						</p>
						<p class="mt-4 text-right">
							— Team:<br /><span class="text-red-600">Noter de Desensà</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-50 p-4 shadow-md">
						<p class="text-sm italic">
							"Ci abbiamo messo 4 mesi per costruire la macchinina, ma è stato un periodo di veri
							ricordi e risate."
						</p>
						<p class="mt-4 text-right">
							— Team:<br /><span class="text-red-600">I Vichinghi</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-50 p-4 shadow-md">
						<p class="text-sm italic">
							"Fare lo speaker è un delirio continuo: nomi, tempi, applausi... ma quando vedo gli
							occhi brillare sotto i caschi, so che sto raccontando qualcosa di magico."
						</p>
						<p class="mt-4 text-right">
							— Spreaker:<br /><span class="text-red-600">Cocchi Simone</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-50 p-4 shadow-md">
						<p class="text-sm italic">
							"Organizzare questa gara è come costruire una macchina a mano ogni anno: la fatica è
							tanta, ma quando la vedi correre... non puoi fare altro che sorridere."
						</p>
						<p class="mt-4 text-right">
							— Organizzatore:<br /><span class="text-red-600">Ferrari Mauro</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-50 p-4 shadow-md">
						<p class="text-sm italic">
							"Lo scatto migliore? Quell’attimo di follia e gioia, col casco ancora storto e il
							sorriso già stampato in faccia. È lì che c’è tutta la verità dell’evento."
						</p>
						<p class="mt-4 text-right">
							— Fotografa:<br /><span class="text-red-600">Nadia Pezzoli</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-50 p-4 shadow-md">
						<p class="text-sm italic">
							"Talvolta credo che si potrebbe rendere tutto un po' più pazzo. Mio papà non la pensa
							così, forse dovrei cambiare compagno di squadra ahah."
						</p>
						<p class="mt-4 text-right">
							— Team:<br /><span class="text-red-600">Banda Bassotti 1907</span>
						</p>
					</div>
				</div>
			</section>
		</div>
	</div>
</main>

<style>
	.carousel {
		overflow: hidden;
		display: flex;
		position: relative;
		justify-content: end;
		align-items: center;
	}

	.inner {
		border-radius: 0.5rem 0 0 0;
		border-top: 4px solid red;
		border-left: 4px solid red;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
	}

	.inner.fullborder {
		border-radius: 0.5rem;
		border: 2px solid red;
	}

	main {
		display: flex;
		flex-direction: column;
	}
</style>
