<script lang="ts">
	import { type Icon as IconType } from '@lucide/svelte';
	import type { Snippet } from 'svelte';

	interface Props {
		/** Background sfumato opzionale a partire dal lato sinistro della card */
		backgroundSnippet?: Snippet;
		/** Snippet per l'immagine/avatar a sinistra */
		picture: Snippet;
		/** Nome principale */
		title: string;
		/** Slug visualizzato come tag univoco */
		slug: string;
		/** Link di destinazione al click sulla card */
		link: string;
		/** Descrizione opzionale sotto il titolo */
		description?: string;
		/** icona opzionale accanto al titolo */
		iconSnippet?: Snippet;
		/** bottoni cta opzionali a destra del componente, non parte del link */
		actionButtons?: Snippet;
		/** Se true, la card non è clickabile e gli hover/transizioni vengono disabilitati */
		disabled?: boolean;
	}

	let {
		backgroundSnippet,
		picture,
		title,
		slug,
		link,
		description,
		iconSnippet,
		actionButtons,
		disabled = false
	}: Props = $props();
</script>

<div class="group block w-full">
	<div
		class="
			border-base-300
			bg-base-300 relative flex
			items-center gap-3 overflow-hidden rounded-xl border
			p-4 transition-transform
			duration-300
			{disabled
			? 'cursor-not-allowed opacity-50'
			: 'hover:scale-102 hover:bg-neutral-300 hover:shadow-md active:scale-99'}
		"
	>
		{#if backgroundSnippet}
			<div class="absolute inset-0 z-0">
				<div class="absolute inset-y-0 left-0 w-full max-w-125 md:w-2/3">
					{@render backgroundSnippet()}
				</div>
				<div
					class="via-base-300/60 to-base-300 absolute inset-0 max-w-126 bg-linear-to-r from-transparent to-99% group-hover:via-neutral-300/60 group-hover:to-neutral-300"
				></div>
			</div>
		{/if}
		<a
			href={disabled ? undefined : link}
			class="relative z-10 flex min-w-0 flex-1 items-center gap-3"
			class:pointer-events-none={disabled}
		>
			<div class="shrink-0 rounded-full ring-1 ring-black">
				{@render picture()}
			</div>

			<div class="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:gap-2">
				<div class="min-w-0 shrink-0">
					<div class="mb-0.5 flex items-center gap-2">
						<p class="text-outline truncate text-lg/tight font-bold">
							{title}
							{#if !disabled}
								<span
									class="bg-primary block h-0.5 max-w-0 transition-all duration-500 group-hover:max-w-full"
								></span>
							{/if}
						</p>
						{#if iconSnippet}
							<div class="shrink-0">
								{@render iconSnippet()}
							</div>
						{/if}
					</div>
					<p class="text-primary text-outline truncate font-semibold">
						@{slug}
					</p>
				</div>

				{#if description}
					<div class="min-w-0 flex-1">
						<p
							class="text-base-content/70 text-outline line-clamp-1 text-sm sm:ml-4 sm:line-clamp-2"
						>
							{description}
						</p>
					</div>
				{/if}
			</div>
		</a>

		{#if actionButtons}
			<div class="relative z-10 flex shrink-0 items-center gap-1">
				{@render actionButtons()}
			</div>
		{/if}
	</div>
</div>

<style>
	.text-outline {
		text-shadow:
			-1px -1px 1px rgba(242, 242, 242, 0.4),
			1px -1px 1px rgba(242, 242, 242, 0.4),
			-1px 1px 1px rgba(242, 242, 242, 0.4),
			1px 1px 1px rgba(242, 242, 242, 0.4);
	}
</style>
