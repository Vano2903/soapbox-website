import type { Picture } from 'vite-imagetools';

export type Source = {
	src?: string;
	width?: number;
	height?: number;
	media?: string;
	type?: string;
};

export type CarouselPageType = {
	layout: 'horizontal' | 'vertical' | 'both';
	breakpoint?: string;
	sources?: Source[];
	fallback?: {
		src: string;
		width?: number;
		height?: number;
		alt: string;
	};

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
