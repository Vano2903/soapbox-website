<script lang="ts">
	const { url } = $props();
</script>

<div
	class="h-48 flex-[1_0_auto] rounded-md border border-gray-300 bg-gray-200 md:h-64"
	style="background-image: url({url});  background-size: cover; background-position:
				center center;"
></div>

<style>
	div {
		width: calc(var(--ratio) * 10rem);
	}

	@media (min-width: 768px) {
		div {
			width: calc(var(--ratio) * 16rem);
		}
	}
</style>
