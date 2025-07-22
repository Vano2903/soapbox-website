import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss(),
		ViteImageOptimizer({
			png: { quality: 80 },
			jpeg: { quality: 75 },
			webp: { quality: 80 },
			avif: { quality: 70 },
			svg: {
				plugins: [{ name: 'removeViewBox' }, { name: 'sortAttrs' }]
			}
		}),
		,
		enhancedImages()
	],
	// server: {
	// 	host: '0.0.0.0',
	// 	port: 8887,
	// 	strictPort: true,
	// 	hmr: false
	// }
	server: {
		hmr: { host: 'localhost', protocol: 'ws' },
		watch: {
			ignored: ['**/pocketbase/**']
		},
		allowedHosts: true
	}
});
