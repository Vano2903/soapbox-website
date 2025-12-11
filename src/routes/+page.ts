import type { PageLoad } from './$types';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import type { OrganizationStatType } from '$types/organizationStat';
import type { CarouselPageType } from '$types/carouselPage';
import type { TabsPageType } from '$types/tabsPage';
import {
	Eye,
	Hammer,
	MapPinned,
	Trophy,
	Heart
} from 'lucide-svelte';
import type { SponsorLogos } from '$types/SponsorSlider';
import type { TimelineType } from '$types/timeline';

export const load: PageLoad = async ({ data }): Promise<{ currentChampionship: ChampionshipExpand; nextEventIndex: number; organizationStats: OrganizationStatType[]; carouselImages: CarouselPageType[]; tabs: TabsPageType, sponsorLogos: SponsorLogos, timeline: TimelineType }> => {
	const { currentChampionship, nextEventIndex } = data;

	const organizationStats = [
		{ value: 982, subject: 'curve', context: 'affrontate' },
		{ value: 157, subject: 'eventi', context: 'organizzati' },
		{ value: 634, subject: 'trofei', context: 'consegnati' }
	] as OrganizationStatType[];

	const carouselImages: CarouselPageType[] = [
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
			vertical: { src: 'images/carousel/3 - Vert.jpeg', alt: 'Car 3' },
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

	const tabs: TabsPageType = {
		headers: [
			{ label: 'Guarda', icon: Eye },
			{ label: 'Crea', icon: Hammer },
			{ label: 'Corri', icon: MapPinned },
			{ label: 'Vinci', icon: Trophy },
			{ label: 'Ama', icon: Heart }
		],
		contents: {
			Guarda: {
				text: 'Ogni curva è uno spettacolo, ogni discesa un tuffo al cuore. I nostri bolidi di legno scendono tra l’entusiasmo del pubblico: bambini che sognano, anziani che ricordano, sconosciuti che applaudono. Le SoapBox sono il rito collettivo, una festa di paese che vibra di adrenalina e sorrisi.',
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
				text: 'Vincere non è solo un trofeo, è arrivare in fondo con gli amici che ti aspettano al traguardo. È rompere qualcosa e ricostruirla insieme. È condividere una risata, una foto, un abbraccio. Il premio è esserci stati e aver lasciato una traccia su quell’asfalto vissuto.',
				image: '/images/chi-siamo/jump.jpeg'
			},
			Ama: {
				text: 'BoxRally è cura quotidiana, amore per un gioco serio fatto di sfide, dettagli e persone. È l’adrenalina che non svanisce, l’attesa per la prossima tappa, l’orgoglio di essere parte di qualcosa che pulsa. Non siamo solo appassionati: siamo legati da un’energia che non si spegne mai.',
				image: '/images/chi-siamo/jump.jpeg'
			}
		}
	}

	const sponsorLogos: SponsorLogos = {
		main: [
			'fassi.svg',
			'pedretti.png',
			'italianoptic.png',
			'cargoway.png'
		],
		secondary: [
			'soapbox.jpg',
			'ipaas-favicon.png',
			'cargoway-rejected.jpg'
		]
	};

	const timeline: TimelineType = {
		items: [
			// {
			// 	year: '1955',
			// 	content: 'Prima gara sulle Mura di Città Alta',
			// 	active: true,
			// 	preActive: false,
			// 	postActive: true
			// },
			// {
			// 	year: '2005',
			// 	content: 'Primo campionato ufficiale',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2006',
			// 	content: 'Edizione "Corriamo per vincere la SLA"',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2011',
			// 	content: 'Espansione del campionato nella Bergamasca',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2014',
			// 	content: 'Primo rally nel Trentino Alto Adige',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2016',
			// 	content: 'Campionato da oltre 10 eventi',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2024',
			// 	content: 'Revisione del Regolamento Tecnico',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2025',
			// 	content: 'Premolo ospita il primo rally notturno',
			// 	active: true,
			// 	preActive: true,
			// 	postActive: true
			// },
			// {
			// 	year: '2027',
			// 	content: 'Espansione del campionato in Lombardia',
			// 	active: false,
			// 	preActive: false,
			// 	postActive: false
			// }
			{
				year: '1955',
				content: 'Primo evento sulle Mura di Città Alta',
				active: true,
				preActive: false,
				postActive: true
			},
			{
				year: '1974',
				content: '10ᵃ edizione della SoapBox Rally',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '1988',
				content: '20ᵃ edizione della SoapBox Rally',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2002',
				content: '30ᵃ edizione della SoapBox Rally',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2004',
				content: 'Nasce il BoxRally Club',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2005',
				content: 'Primo campionato provinciale',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2010',
				content: 'Oltre 15 eventi in Lombardia, Piemonte e Trentino',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2012',
				content: '40ᵃ edizione della SoapBox Rally',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2014',
				content: '10° Campionato provinciale',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2023',
				content: 'Nasce il nuovo club',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2026',
				content: '50ᵃ edizione della SoapBox Rally',
				active: true,
				preActive: true,
				postActive: true
			},
			{
				year: '2027',
				content: 'Espansione del campionato nel mondo',
				active: false,
				preActive: false,
				postActive: false
			}
		],
		postfix: {
			style: 'dashed',
			color: 'neutral-300',
			length: 2
		}
	};

	return { currentChampionship, nextEventIndex, organizationStats, carouselImages, tabs, sponsorLogos, timeline }
};