import type { PageLoad } from './$types';
import { OldEventKind, type EventInfoType } from '$lib/types/event';
import type { OrganizationStatType } from '$lib/types/organizationStat';
import type { CarouselPageType } from '$lib/types/carouselPage';
import type { TabsPageType } from '$types/tabsPage';
import {
	Eye,
	Hammer,
	MapPinned,
	Trophy,
	Heart
} from 'lucide-svelte';

export const load: PageLoad = async (): Promise<{ eventInfo: EventInfoType; organizationStats: OrganizationStatType[]; carouselImages: CarouselPageType[]; tabs: TabsPageType }> => {
	const eventInfo = {
		id: '2025-7',
		kind: OldEventKind.NextEventKind,
		date: new Date(2025, 7, 27, 14, 30),
		header: 'Campionato 2025',
		title: '3° Soap BoXXico Rally',
		totalSubscriptions: 48,
		currentSubscriptions: 24
	} as EventInfoType;

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
		}
	}

	return { eventInfo, organizationStats, carouselImages, tabs }
};