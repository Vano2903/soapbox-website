import { sveltekit } from '@sveltejs/kit/vite';
import tailwindcss from '@tailwindcss/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit(), tailwindcss(), enhancedImages()],
	// server: {
	// 	host: '0.0.0.0',
	// 	port: 8887,
	// 	strictPort: true,
	// 	hmr: false
	// }
	server: {
		watch: {
			ignored: ['**/pocketbase/**']
		}
	}
});
