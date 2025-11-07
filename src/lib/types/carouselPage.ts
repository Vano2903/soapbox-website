import type { Picture } from 'vite-imagetools';

export type CarouselPageType = {
	layout: 'horizontal' | 'vertical' | 'both';
	breakpoint?: string;
	horizontal: { src: Picture; alt: string };
	vertical: { src: Picture; alt: string };
	loading: 'eager' | 'lazy';
	fetchpriority?: 'high' | 'low' | 'auto';
};

export const defaultCarouselPage = {
	layout: 'horizontal',
	breakpoint: 'md',
	horizontal: { src: '', alt: '' },
	loading: 'lazy'
};
