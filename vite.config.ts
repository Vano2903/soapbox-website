import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
// import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';
import { imagetools } from 'vite-imagetools';

export default defineConfig({
	plugins: [imagetools(), sveltekit(), tailwindcss()],
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
