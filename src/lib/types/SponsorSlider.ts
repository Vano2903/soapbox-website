import type { Picture } from 'vite-imagetools';

export type SponsorLogoInfo = {
	alt: string;
	image: Picture;
};
export type SponsorLogos = Record<string, SponsorLogoInfo[]>;

export type SponsorSlider = {
	sponsors: SponsorLogoInfo[];
	sizedSponsors: SponsorLogoInfo[];
	speed: number;
	loopWidth: number;
};
