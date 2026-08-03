<script lang="ts">
	let { url, alt = 'Gallery image' }: { url: string; alt?: string } = $props();
	let loaded = $state(false);

	$effect(() => {
		url;
		loaded = false;
	});
</script>

<div class="relative h-32 flex-[1_0_auto] overflow-hidden rounded-md border border-gray-300 bg-gray-200 md:h-64">
	<div
		class="skeleton absolute inset-0 transition-opacity duration-200"
		class:opacity-0={loaded}
	></div>
	<img
		class="h-full w-full object-cover object-center transition-opacity duration-300"
		class:opacity-0={!loaded}
		class:opacity-100={loaded}
		src={url}
		loading="lazy"
		decoding="async"
		{alt}
		onload={() => (loaded = true)}
	/>
</div>

<!-- </img> -->
<!-- style="background-image: url({url});  background-size: cover; background-position:
				center center;" -->

<style>
	div {
		width: calc(var(--ratio) * 8rem);
		aspect-ratio: var(--ratio);
	}

	@media (min-width: 768px) {
		div {
			width: calc(var(--ratio) * 16rem);
		}
	}
</style>
