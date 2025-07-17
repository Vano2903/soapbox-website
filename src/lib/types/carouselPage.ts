export type CarouselPage = {
	layout: 'horizontal' | 'vertical' | 'both';
	breakpoint?: string;
	horizontal?: { src: string; alt: string };
	vertical?: { src: string; alt: string };
	loading: 'eager' | 'lazy';
};

export const defaultCarouselPage = {
	layout: 'horizontal',
	breakpoint: 'md',
	horizontal: { src: '', alt: '' },
	loading: 'lazy'
}