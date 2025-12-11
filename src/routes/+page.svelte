<script lang="ts">
	import { OldEventKind, type EventInfoType, type EventNonExpand } from '$types/pocketbase/event';
	import type { OrganizationStatType } from '$types/organizationStat.js';
	import Carousel3 from '$components/carousel/carousel3.svelte';
	import EventInfoBox from '$components/eventInfoBox/eventInfoBox.svelte';
	import { fade } from 'svelte/transition';
	import { VolumeX, Volume2, ChevronLeft, ChevronRight } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import type { SponsorLogoInfo, SponsorLogos, SponsorSlider } from '$types/SponsorSlider.js';
	import type { CarouselPageType } from '$types/carouselPage.js';
	import type { TabsPageType } from '$types/tabsPage.js';
	import type { TimelineType } from '$types/timeline.js';
	import { goto } from '$app/navigation';
	import type { ChampionshipExpand } from '$types/pocketbase/championship.js';
	import { toEventInfoType } from '$types/pocketbase/event';

	import videoHighlight from '$assets/videos/highlight-2.mp4';
	import EnhancedImage from '$components/enhanedImage/enhancedImage.svelte';

	const { data } = $props();
	const {
		currentChampionship,
		nextEventIndex,
		organizationStats,
		carouselImages,
		tabs,
		sponsorLogos,
		timeline
	}: {
		currentChampionship: ChampionshipExpand;
		nextEventIndex: number;
		organizationStats: OrganizationStatType[];
		carouselImages: CarouselPageType[];
		tabs: TabsPageType;
		sponsorLogos: SponsorLogos;
		timeline: TimelineType;
	} = data;

	// --- Waiting event Management ---
	function enrollRedirect(year: string, event: string): string {
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'redirect to enroll selection = {' + year + ' | ' + event + '}'
		);
		const params = new URLSearchParams(`championship=${year}&event=${event}`);
		return `/enroll?${params.toString()}`;
	}
	function resultsRedirect(year: string, event: string): string {
		console.log(
			new Date().toLocaleTimeString('it-IT', { hour12: false }),
			'redirect to enroll selection = {' + year + ' | ' + event + '}'
		);
		const params = new URLSearchParams(`championship=${year}&event=${event}`);
		return `/championships?${params.toString()}`;
	}

	// --- Tabulated walkthroug Management ---
	let activeTab = $state('Guarda');

	// --- Highlight video Management ---
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

	// --- Sponsor slider Management ---
	let sizedMainSponsors = $state(sponsorLogos.main);
	let sizedSecondarySponsors = $state(sponsorLogos.secondary);
	let mainRow: HTMLDivElement;
	let secondaryRow: HTMLDivElement;

	let mainSponsorsSlider: SponsorSlider = $state({
		sponsors: sponsorLogos.main,
		sizedSponsors: sponsorLogos.main,
		speed: 100,
		loopWidth: 0
	});
	let secondarySponsorsSlider: SponsorSlider = $state({
		sponsors: sponsorLogos.secondary,
		sizedSponsors: sponsorLogos.secondary,
		speed: 100,
		loopWidth: 0
	});

	// --- History timeline Management ---
	let timelineContainer: HTMLElement;
	let scrollAtStart = $state(true);
	let scrollAtEnd = $state(false);
	let fadeLeftDiv: HTMLElement;
	let fadeRightDiv: HTMLElement;
	function scrollTimeline(direction: 'left' | 'right') {
		const scrollAmount = 300; // Adjust for desired scroll distance
		if (!timelineContainer) return;

		timelineContainer.scrollBy({
			left: direction === 'left' ? -scrollAmount : scrollAmount,
			behavior: 'smooth'
		});

		// requestAnimationFrame(() => {
		// 	setTimeout(updateScrollButtons, 100);
		// });
		requestAnimationFrame(updateScrollButtons);
	}
	function updateScrollButtons() {
		if (!timelineContainer) return;

		const scrollLeft = timelineContainer.scrollLeft;
		const scrollWidth = timelineContainer.scrollWidth;
		const clientWidth = timelineContainer.clientWidth;

		scrollAtStart = scrollLeft <= 0;
		scrollAtEnd = scrollLeft + clientWidth >= scrollWidth - 1;
	}

	onMount(() => {
		// --- Sponsor Slider Management ---
		let sponsorSliderObserver: ResizeObserver;
		function resizeArrayToMin<T>(base: T[], minLength: number): T[] {
			if (base.length === 0) return [];
			let result: T[] = [];
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
			sponsorSliderObserver = new ResizeObserver(() => {
				calculateSizes();
			});

			// Observe first row only (since all logos are same size)
			const logo = mainRow.querySelector('.logo') as HTMLElement;
			if (logo) sponsorSliderObserver.observe(logo);

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

		// --- Timeline Management ---
		let timelineContainerObserver: ResizeObserver;
		function checkTimelineOverflow() {
			if (!timelineContainer) return;

			const isOverflowing = timelineContainer.scrollWidth > timelineContainer.clientWidth;
			fadeLeftDiv.classList.toggle('opacity-0', !isOverflowing);
			fadeLeftDiv.classList.toggle('opacity-100', isOverflowing);
			fadeRightDiv.classList.toggle('opacity-0', !isOverflowing);
			fadeRightDiv.classList.toggle('opacity-100', isOverflowing);
		}
		function startManagingTimelineOverflow() {
			checkTimelineOverflow();

			timelineContainerObserver = new ResizeObserver(() => {
				checkTimelineOverflow();
			});
			if (timelineContainer) timelineContainerObserver.observe(timelineContainer);
		}
		function manageScrollButtons() {
			updateScrollButtons();
			timelineContainer?.addEventListener('scroll', updateScrollButtons);
		}
		startManagingTimelineOverflow();
		manageScrollButtons();

		// cleanup the observers on component unmount
		return () => {
			// sponsorSliderObserver?.disconnect();
			timelineContainerObserver?.disconnect();
			timelineContainer?.removeEventListener('scroll', updateScrollButtons);
		};
	});
</script>

<main>
	<div class="carousel">
		<!-- <Carousel /> -->
		<Carousel3 pages={carouselImages} />
		<aside
			class="absolute z-10 box-border hidden h-87/100 max-h-[380px] w-1/3 max-w-[430px] rounded-l-xl bg-white py-2 pl-2 md:block lg:h-3/4 lg:max-h-[450px] lg:w-1/4 xl:max-h-[550px]"
		>
			<div class="inner p-2 lg:p-4">
				<EventInfoBox
					championshipInfo={currentChampionship}
					eventInfo={currentChampionship.expand.events.at(nextEventIndex) as EventNonExpand}
					locatedOnCarousel={true}
				/>
				<!-- foundEventDerived?.subscriptionsOpen && (foundEventDerived.maxSubscriptions === 0 || foundEventDerived.numSubscriptions < (foundEventDerived.maxSubscriptions ?? 0)) && (!foundEventDerived.startDate || new Date(foundEventDerived.startDate).valueOf() >= new Date().valueOf()) -->
				{#if currentChampionship.expand.events.at(nextEventIndex)?.subscriptionsOpen && (currentChampionship.expand.events.at(nextEventIndex)?.maxSubscriptions === 0 || (currentChampionship.expand.events.at(nextEventIndex)?.numSubscriptions ?? 0) < (currentChampionship.expand.events.at(nextEventIndex)?.maxSubscriptions ?? 0)) && (!currentChampionship.expand.events.at(nextEventIndex)?.startDate || new Date(currentChampionship.expand.events.at(nextEventIndex)?.startDate ?? new Date()).valueOf() >= new Date().valueOf())}
					<a
						class="btn btn-error text-foreground max-w-70"
						href={`/enroll?${new URLSearchParams(`championship=${currentChampionship.name}&event=${currentChampionship.expand.events.at(nextEventIndex)?.shortName}`).toString()}`}
					>
						Iscriviti
					</a>
				{:else}
					<button class="btn btn-disabled flex-nowrap text-nowrap text-gray-600">
						Iscriviti
					</button>
				{/if}
				<!-- <button
					class="btn btn-error text-foreground max-w-70"
					onclick={currentChampionship.expand.events.at(nextEventIndex)?.subscriptionsOpen
						? () =>
								enrollRedirect(
									`${currentChampionship.name}`,
									`${currentChampionship.expand.events.at(nextEventIndex)?.shortName}`
								)
						: () =>
								resultsRedirect(
									`${currentChampionship.name}`,
									`${currentChampionship.expand.events.at(nextEventIndex === -1 ? -1 : nextEventIndex - 1)?.shortName}`
								)}
				>
					{#if currentChampionship.expand.events.at(nextEventIndex)?.subscriptionsOpen}Iscriviti{:else}Guarda{/if}
				</button> -->
			</div>
		</aside>
	</div>
	<div>
		<!-- Aspettando l'Evento -->
		<div class="md:hidden">
			<hr class="mx-4 mt-2 mb-6 h-1 w-auto rounded-sm border-0 bg-red-600 md:hidden lg:mt-0" />
			<h1 class="pb-4 text-center text-5xl font-bold">
				Aspettando l’<span class="text-red-600">EVENTO</span>!
			</h1>
			<div class="flex flex-row justify-center gap-4 sm:gap-8">
				<div class="flex max-w-1/3 flex-col justify-center">
					{#if currentChampionship.expand.events.at(nextEventIndex)?.subscriptionsOpen}
						<p class="pb-4 text-right text-base/5">
							<span class="xs:hidden">Le iscrizioni all’evento sono aperte!</span>
							<span class="xs:block hidden">Sono aperte le iscrizioni per il prossimo evento!</span>
						</p>
						<p class="pb-4 text-right text-base/5">
							<span class="xs:hidden"> Registrati prima che terminino i posti. </span>
							<span class="xs:block hidden">
								Compila la tua partecipazione prima che esauriscano i posti disponibili.
							</span>
						</p>
					{:else}
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
						<a
							class="btn btn-error text-foreground max-w-70"
							href={currentChampionship.expand.events.at(nextEventIndex)?.subscriptionsOpen
								? enrollRedirect(
										`${currentChampionship.name}`,
										`${currentChampionship.expand.events.at(nextEventIndex)?.shortName}`
									)
								: resultsRedirect(
										`${currentChampionship.name}`,
										`${currentChampionship.expand.events.at(nextEventIndex === -1 ? -1 : nextEventIndex - 1)?.shortName}`
									)}
						>
							{#if currentChampionship.expand.events.at(nextEventIndex)?.subscriptionsOpen}Iscriviti{:else}Guarda{/if}
						</a>
					</div>
				</div>
				<div class="flex flex-col justify-center">
					<div class="box-border rounded-xl bg-neutral-100 p-2">
						<div class="inner fullborder p-1 lg:p-4">
							<EventInfoBox
								championshipInfo={currentChampionship}
								eventInfo={currentChampionship.expand.events.at(nextEventIndex) as EventNonExpand}
								locatedOnCarousel={false}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Noi siamo BoxRally -->
		<div class="mt-12 md:mt-0">
			<hr class="mx-4 mt-2 mb-6 h-1 w-auto rounded-sm border-0 bg-red-600 lg:mt-0" />
			<h1 class="pb-4 text-center text-5xl font-bold">
				Noi siamo <span class="text-red-600">BOXRALLY</span>!
			</h1>

			<!-- Organization statistics -->
			<section class="mb-12 px-4 py-10 text-center">
				<h2 class="mb-2 text-center text-3xl font-bold md:text-4xl">Non solo corse:</h2>
				<p class="mx-auto mb-6 text-center text-base md:text-lg lg:max-w-3/4">
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

				<p class="mx-auto mb-6 text-center text-base md:text-lg lg:max-w-3/4">
					Ogni anno ci impegniamo per offrire più spettacolo, più sicurezza, più passione.<br />
					Cresciamo ad ogni gara aggiungendo nuove tappe al calendario, ma il cuore resta lo stesso:
					la nostra squadra che corre unita e non si ferma mai.
				</p>
			</section>

			<!-- Tabulated walkthrough -->
			<section class="my-12 bg-neutral-100 px-4 py-10">
				<div class="flex flex-row flex-wrap justify-evenly">
					{#each tabs.headers as tab}
						<button
							class="flex cursor-pointer flex-col items-center gap-2 p-2 text-left transition-all duration-200 hover:text-red-600"
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
				<div class="mt-6 text-lg">
					<div transition:fade class="flex flex-col items-center justify-evenly px-4 sm:flex-row">
						<p
							class="max-w-5/9 pb-4 text-center text-sm leading-relaxed sm:pr-4 sm:pb-0 sm:text-right md:text-base lg:text-lg"
						>
							{tabs.contents[activeTab].text}
						</p>
						<div class="relative flex max-w-4/9 min-w-[300px] justify-center bg-red-600 p-0.75">
							<div
								class="absolute -top-0 -left-0 z-10 h-0 w-0 border-t-[40px] border-r-[40px] border-t-red-600 border-r-transparent lg:border-t-[60px] lg:border-r-[60px]"
							></div>

							<div
								class="absolute -right-0 -bottom-0 z-10 h-0 w-0 border-b-[40px] border-l-[40px] border-b-red-600 border-l-transparent lg:border-b-[60px] lg:border-l-[60px]"
							></div>
							<EnhancedImage
								loading="lazy"
								pictureClass="border-4 border-white object-cover"
								picture={tabs.contents[activeTab].image}
								alt="macchina salta tra la schiuma"
							/>
						</div>
					</div>
				</div>
				<div class="mt-6 flex justify-center">
					<a href="/chi-siamo" class="group px-2 pt-1 text-lg font-bold transition duration-300">
						<span class="flex flex-row items-center"
							><ChevronRight
								class="group-hover:stroke-primary transition duration-300 group-hover:rotate-360"
							/>Conoscici Meglio</span
						>
						<span
							class="block h-0.75 max-w-0 rounded-sm bg-red-600 transition-all duration-500 group-hover:max-w-full"
						></span>
					</a>
				</div>
			</section>

			<!-- This video is just a template while we record and produce the real thing! -->
			<!-- Please don't sue us for any copyright claims. -->
			<!-- Original Video Credits: Colin McRea Rally 2.0 @ Codemasters - Music by Jonathan Colling | Found on: Youtube @ TheCarArchives -->
			<!-- Highlight video -->

			<section class="relative my-12 h-[55vh] bg-black lg:h-[70vh] 2xl:h-[85vh]">
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
					<source src={videoHighlight} type="video/mp4" />
				</video>
				<div class="absolute flex h-full w-full items-center justify-center bg-black/40">
					<h2 class="px-4 text-center text-4xl font-bold text-white md:text-5xl">
						<!-- Dove finisce l’asfalto, comincia la leggenda -->
						Ogni curva è una promessa di leggenda.
					</h2>
				</div>
				<button
					onclick={toggleMute}
					class="absolute right-4 bottom-4 z-10 cursor-pointer rounded-full bg-white/80 px-3 py-1 text-sm font-semibold text-black backdrop-blur hover:bg-white"
				>
					{#if isHighlightMuted}
						<VolumeX />
					{:else}
						<Volume2 />
					{/if}
				</button>
			</section>

			<!-- Sponsor slider -->
			<section class="relative my-12 px-4 py-10">
				<h2 class="mb-6 text-center text-3xl font-bold md:text-4xl">
					Il supporto che spinge le nostre vetture
				</h2>
				<p class="mx-auto mb-6 text-center text-base md:text-lg lg:max-w-3/4">
					Ogni gesto di supporto ha un peso enorme nella nostra discesa. Non contano solo le mani
					che spingono il carretto, ma anche quelle che mettono linfa vitale nel progetto. La grande
					famiglia che siamo sarebbe incompleta senza i nostri sponsor, sono la forza invisibile che
					abbraccia la nostra passione e rende possibile l’impossibile.
				</p>

				<div class="relative m-auto lg:w-5/6">
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
										class="logo xs:h-24 xs:w-40 flex h-20 w-32 flex-none items-center justify-center rounded-xl shadow md:h-28 md:w-48"
									>
										<img
											src={logo.image.img.src}
											alt={logo.alt}
											loading="lazy"
											class="max-h-[80%] max-w-[80%]"
										/>
									</div>
								{/each}
							</div>
						</div>

						<div class="mt-4 overflow-hidden">
							<div class="flex gap-6 py-1 will-change-transform" bind:this={secondaryRow}>
								{#each [...secondarySponsorsSlider.sizedSponsors, ...secondarySponsorsSlider.sizedSponsors] as logo}
									<div
										class="logo xs:h-24 xs:w-40 flex h-20 w-32 flex-none items-center justify-center rounded-xl shadow md:h-28 md:w-48"
									>
										<img
											src={logo.image.img.src}
											alt={logo.alt}
											loading="lazy"
											class="max-h-[80%] max-w-[80%]"
										/>
									</div>
								{/each}
							</div>
						</div>
					</div>
				</div>
			</section>

			<!-- History timeline -->
			<section class="my-12 bg-neutral-100 px-4 py-10">
				<h2 class="mb-6 text-center text-3xl font-bold md:text-4xl">
					La nostra storia di passione
				</h2>
				<p class="mx-auto mb-6 text-center text-base md:text-lg lg:max-w-3/4">
					La nostra storia è il rally più grande mai fatto: un insieme di tappe che vanno dalle
					prime discese spensierate alla nascita di un vero e proprio gruppo. Questo è il viaggio di
					un’idea che ha unito creatività, velocità e passione per un’evoluzione fatta di sfide,
					nuovi territori e obiettivi sempre più ambiziosi.
				</p>

				<div class="relative">
					<div class="relative m-auto flex w-full flex-row justify-center lg:w-4/5">
						<div
							class="fade-left pointer-events-none absolute top-0 left-0 z-10 h-full w-32 bg-gradient-to-r from-neutral-100 to-transparent transition-opacity duration-300"
							bind:this={fadeLeftDiv}
						></div>
						<div
							class="fade-right pointer-events-none absolute top-0 right-0 z-10 h-full w-32 bg-gradient-to-l from-neutral-100 to-transparent transition-opacity duration-300"
							bind:this={fadeRightDiv}
						></div>
						<div class="scrollbar-hide overflow-x-auto" bind:this={timelineContainer}>
							<ul class="timeline">
								<li>
									<div class="timeline-start invisible w-16"></div>
									<div class="timeline-middle invisible"></div>
									<div class="timeline-end invisible w-16"></div>
									<hr
										class={timeline.prefix && timeline.prefix.length === 2
											? `!border-${timeline.prefix.style} !border-0 !border-t-4 !border-${timeline.prefix.color} !bg-transparent`
											: 'invisible'}
									/>
								</li>
								{#each timeline.items as item, index}
									<li>
										<hr
											class=" {index === 0
												? timeline.prefix
													? `!border-${timeline.prefix.style} !border-0 !border-t-4 !border-${timeline.prefix.color} !bg-transparent`
													: 'hidden'
												: item.preActive
													? 'bg-primary'
													: 'bg-neutral-300'}"
										/>
										<div
											class="{index % 2 === 0
												? 'timeline-start'
												: 'timeline-end'} text-xl font-bold"
										>
											{item.year}
										</div>
										<div class="timeline-middle">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												class="{item.active ? 'text-primary' : 'text-neutral-300'} h-5 w-5"
											>
												<path
													fill-rule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 {item.active
														? '00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
														: ''}"
													clip-rule="evenodd"
												/>
											</svg>
										</div>
										<div class={index % 2 === 0 ? 'timeline-end' : 'timeline-start'}>
											<p class="w-32 text-center text-sm text-neutral-600">
												{item.content}
											</p>
										</div>
										<hr
											class=" {index === timeline.items.length - 1
												? timeline.postfix
													? `!border-${timeline.postfix.style} !border-0 !border-t-4 !border-${timeline.postfix.color} !bg-transparent`
													: 'hidden'
												: item.postActive
													? 'bg-primary'
													: 'bg-neutral-300'}"
										/>
									</li>
								{/each}
								<li>
									<hr
										class={timeline.postfix && timeline.postfix.length === 2
											? `!border-${timeline.postfix.style} !border-0 !border-t-4 !border-${timeline.postfix.color} !bg-transparent`
											: 'invisible'}
									/>
									<div class="timeline-start invisible w-16"></div>
									<div class="timeline-middle invisible"></div>
									<div class="timeline-end invisible w-16"></div>
								</li>
							</ul>
						</div>
					</div>
					<button
						class="group absolute top-1/2 left-15 z-20 -translate-y-1/2 cursor-pointer p-2 transition disabled:cursor-not-allowed disabled:opacity-50"
						onclick={() => scrollTimeline('left')}
						disabled={scrollAtStart}
						aria-label="Scroll left"
					>
						<ChevronLeft
							class="group-hover:stroke-primary h-full w-full stroke-neutral-600 stroke-3 group-disabled:stroke-neutral-400"
							size="36"
						/>
					</button>
					<button
						class="group absolute top-1/2 right-15 z-20 -translate-y-1/2 cursor-pointer p-2 transition disabled:cursor-not-allowed disabled:opacity-50"
						onclick={() => scrollTimeline('right')}
						disabled={scrollAtEnd}
						aria-label="Scroll right"
					>
						<!-- The icon inside -->
						<ChevronRight
							class="group-hover:stroke-primary h-full w-full stroke-neutral-600 stroke-3 group-disabled:stroke-neutral-400"
							size="36"
						/>
					</button>
				</div>
			</section>

			<!-- Quoted comments -->
			<section class="my-12 px-4 py-10">
				<h2 class="mb-6 text-center text-3xl font-bold md:text-4xl">Noi ascoltiamo ogni voce</h2>
				<p class="mx-auto mb-6 text-center text-base md:text-lg lg:max-w-3/4">
					Fin dalle nostre origini, ascoltiamo tutti: dai piloti, agli organizzatori fino agli
					spettatori, tutti uniti da storie di emozione e impegno condiviso, per una passione che
					amiamo.
				</p>
				<div class="m-auto grid max-w-5/6 gap-6 md:max-w-full md:grid-cols-3 lg:max-w-4/5">
					<div class="flex flex-col justify-between rounded-lg bg-neutral-100 p-4 shadow-md">
						<p class="text-sm italic">
							"Questa gara è stata fantastica, ci siamo superati sia come impegno di squadra, sia
							come fiducia tra fratelli."
						</p>
						<p class="mt-4 text-right">
							— Team<br /><span class="text-red-600">Noter de Desensà</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-100 p-4 shadow-md">
						<p class="text-sm italic">
							"Ci abbiamo messo 4 mesi per costruire la macchinina, ma è stato un periodo di veri
							ricordi e risate."
						</p>
						<p class="mt-4 text-right">
							— Team<br /><span class="text-red-600">I Vichinghi</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-100 p-4 shadow-md">
						<p class="text-sm italic">
							"Fare lo speaker è un delirio continuo: nomi, tempi, applausi... ma quando vedo gli
							occhi brillare sotto i caschi, so che sto raccontando qualcosa di magico."
						</p>
						<p class="mt-4 text-right">
							— Spreaker<br /><span class="text-red-600">Cocchi Simone</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-100 p-4 shadow-md">
						<p class="text-sm italic">
							"Organizzare questa gara è come costruire una macchina a mano ogni anno: la fatica è
							tanta, ma quando la vedi correre... non puoi fare altro che sorridere."
						</p>
						<p class="mt-4 text-right">
							— Organizzatore<br /><span class="text-red-600">Ferrari Mauro</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-100 p-4 shadow-md">
						<p class="text-sm italic">
							"Lo scatto migliore? Quell’attimo di follia e gioia, col casco ancora storto e il
							sorriso già stampato in faccia. È lì che c’è tutta la verità dell’evento."
						</p>
						<p class="mt-4 text-right">
							— Fotografa<br /><span class="text-red-600">Nadia Pezzoli</span>
						</p>
					</div>
					<div class="flex flex-col justify-between rounded-lg bg-neutral-100 p-4 shadow-md">
						<p class="text-sm italic">
							"Talvolta credo che si potrebbe rendere tutto un po' più pazzo. Mio papà non la pensa
							così, forse dovrei cambiare compagno di squadra ahah."
						</p>
						<p class="mt-4 text-right">
							— Team<br /><span class="text-red-600">Banda Bassotti 1907</span>
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
		border-radius: 0.5rem 0 0 0.25rem;
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

	.scrollbar-hide::-webkit-scrollbar {
		display: none;
	}
	.scrollbar-hide {
		scrollbar-width: none; /* Firefox */
		-ms-overflow-style: none; /* IE/Edge */
	}
</style>
