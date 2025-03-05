<script lang="ts">
	const { url } = $props();
</script>

<img
	class="h-32 flex-[1_0_auto] rounded-md border border-gray-300 bg-gray-200 object-cover object-center md:h-64"
	src={url}
	loading="lazy"
	alt="Gallery "
/>

<!-- </img> -->
<!-- style="background-image: url({url});  background-size: cover; background-position:
				center center;" -->

<style>
	img {
		width: calc(var(--ratio) * 8rem);
		aspect-ratio: var(--ratio);
	}

	@media (min-width: 768px) {
		img {
			width: calc(var(--ratio) * 16rem);
		}
	}
</style>
