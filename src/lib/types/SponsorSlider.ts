export type SponsorLogoPath = string;
export type SponsorLogos = Record<string, SponsorLogoPath[]>;

export type SponsorSlider = {
	sponsors: string[];
	sizedSponsors: string[];
	speed: number;
	loopWidth: number;
}