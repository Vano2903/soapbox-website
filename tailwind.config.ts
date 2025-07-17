import type { Config } from 'tailwindcss';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: [
		'dark',
		// GridCols for footer dynamism
		'lg:grid-cols-1',
		'lg:grid-cols-2',
		'lg:grid-cols-3',
	]
};

export default config;
