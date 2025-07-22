<script lang="ts">
	import { ChevronRight, ChevronLeft, type Icon as IconType } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		picture: Snippet;
		title: string;
		description?: string;
		link: string;
		// icon?: Element;
		iconSnippet?: Snippet;
		disabled?: boolean;
		slug: string;
	}

	let {
		picture = $bindable(),
		title = $bindable(),
		description = $bindable(),
		link = $bindable(),
		iconSnippet = $bindable(),
		disabled = $bindable(),
		slug = $bindable()
	}: Props = $props();
</script>

<a href={link} class="group block w-full cursor-pointer">
	<div class="rounded-lg bg-gray-200 p-4 transition-colors group-hover:bg-gray-300">
		<div class="flex items-center space-x-3">
			<!-- <img src={pictureUrl} alt="Team Logo" class="size-16 rounded-full ring-1" /> -->
			{@render picture()}
			<div class="">
				<div
					class="justify-right flex flex-col space-x-2"
					class:md:flex-col={!description}
					class:md:flex-row={!!description}
					class:md:items-start={!description}
					class:md:items-center={!!description}
					class:md:text-center={!description}
				>
					<div class="flex flex-nowrap items-center">
						<div class="w-full">
							<p class="group truncate text-lg font-bold transition duration-300">
								{title}
								<span
									class="mx-1 block h-0.5 max-w-0 bg-red-600 transition-all duration-500 group-hover:max-w-full"
								></span>
							</p>
						</div>

						{@render iconSnippet?.()}
					</div>
					<!-- <div class="min-w-0">
						<p class="block max-w-full min-w-0 truncate font-semibold text-red-600"> -->
					<div class="flex w-full flex-1">
						<div class="min-w-0">
							<!-- Added flex-1 to take available space -->
							<p class="max-w-full min-w-0 truncate font-semibold text-red-600">
								<!-- Removed redundant classes, added w-full -->
								@{slug}
							</p>
						</div>
					</div>
				</div>
				<p class="mt-1 hidden text-sm text-gray-700 md:line-clamp-1">{description}</p>
			</div>
		</div>
	</div>
</a>
