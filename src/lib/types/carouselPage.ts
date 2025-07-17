export type CarouselPage = {
	horizontal: { src: string; alt: string } | null;
	vertical: { src: string; alt: string } | null;
	loading: 'eager' | 'lazy';
};

export const defaultCarouselPage = {
	horizontal: null,
	vertical: null
}