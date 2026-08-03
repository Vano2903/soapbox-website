<script lang="ts">
	import { ChevronRight, ChevronLeft, type Icon as IconType } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		picture: Snippet;
		title: string;
		description?: string;
		link: string;
		iconSnippet?: Snippet;
		actionButtons?: Snippet; // New optional action buttons
		disabled?: boolean;
		slug: string;
	}

	let {
		picture = $bindable(),
		title = $bindable(),
		description = $bindable(),
		link = $bindable(),
		iconSnippet = $bindable(),
		actionButtons = $bindable(), // New optional prop
		disabled = $bindable(),
		slug = $bindable()
	}: Props = $props();
</script>

<div class="group block w-full">
	<div class="rounded-lg bg-gray-200 p-4 transition-colors group-hover:bg-gray-300">
		<div class="flex items-center space-x-3">
			<!-- Left side: clickable content -->
			<a href={link} class="flex min-w-0 flex-1 cursor-pointer items-center space-x-3">
				{@render picture()}
				<div class="min-w-0 flex-1">
					<div class="min-w-0">
						<div class="flex min-w-0 items-center space-x-2">
							<div class="min-w-0 flex-1">
								<div class="flex items-center space-x-2">
									<p class="truncate text-lg font-bold transition duration-300">
										{title}
										<span
											class="block h-0.5 max-w-0 bg-red-600 transition-all duration-500 group-hover:max-w-full"
										></span>
									</p>
									{#if iconSnippet}
										<div class="flex-shrink-0">
											{@render iconSnippet()}
										</div>
									{/if}
								</div>
							</div>
						</div>

						<div class="min-w-0">
							<p class="truncate font-semibold text-red-600">
								@{slug}
							</p>
						</div>
					</div>

					{#if description}
						<p class="mt-1 line-clamp-1 text-sm text-gray-700">{description}</p>
					{/if}
				</div>
			</a>

			<!-- Right side: action buttons (optional) -->
			{#if actionButtons}
				<div class="flex flex-shrink-0 items-center space-x-1">
					{@render actionButtons()}
				</div>
			{/if}
		</div>
	</div>
</div>
