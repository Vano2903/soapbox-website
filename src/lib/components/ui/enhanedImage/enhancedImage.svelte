<script lang="ts">
	import type { Picture } from 'vite-imagetools';

	interface Props {
		pictureClass?: string;
		imageClass?: string;
		loading?: 'eager' | 'lazy';
		fetchpriority?: 'high' | 'low' | 'auto';
		alt?: string;
		picture: Picture;
	}
	const {
		pictureClass = '',
		imageClass = '',
		loading = 'lazy',
		fetchpriority = 'auto',
		alt,
		picture
	}: Props = $props();

	const srcsets = Object.entries(picture.sources).map(([format, source]) => ({
		format,
		srcset: source
	}));
</script>

<picture class={pictureClass}>
	{#each srcsets as { format, srcset }}
		<source {srcset} type={'image/' + format} />
	{/each}
	<img class={imageClass} {loading} {fetchpriority} src={picture.img.src} {alt} />
</picture>
