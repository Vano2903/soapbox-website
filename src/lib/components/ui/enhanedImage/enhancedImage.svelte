<script lang="ts">
	import type { Picture } from 'vite-imagetools';

	interface Props {
		pictureClass?: string;
		imageClass?: string;
		loading?: 'eager' | 'lazy';
		fetchpriority?: 'high' | 'low' | 'auto';
		alt?: string;
		picture: Picture;
		width?: number | string;
		height?: number | string;
		media?: string;
		sizes?: string;
	}
	const {
		pictureClass = '',
		imageClass = '',
		loading = 'lazy',
		fetchpriority = 'auto',
		alt,
		picture,
		sizes,
		width,
		height,
		media
	}: Props = $props();

	const srcsets = Object.entries(picture.sources).map(([format, source]) => ({
		format,
		srcset: source
	}));
</script>

<picture class={pictureClass}>
	{#each srcsets as { format, srcset }}
		<source {srcset} {media} type={'image/' + format} />
	{/each}
	<img
		class={imageClass}
		{loading}
		{fetchpriority}
		src={picture.img.src}
		{alt}
		{sizes}
		width={width ?? picture.img.w}
		height={height ?? picture.img.h}
	/>
</picture>
