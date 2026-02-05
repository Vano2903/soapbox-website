<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';
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
			relative
			flex items-center gap-3
			rounded-xl border border-base-300 bg-base-300 p-4
			transition-transform duration-300
			overflow-hidden
			{disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-300 hover:shadow-md active:scale-99 hover:scale-102'}
		"
	>
		{#if backgroundSnippet}
			<div class="absolute inset-0 z-0">
				<div class="absolute inset-y-0 left-0 w-full md:w-2/3 max-w-125">
					{@render backgroundSnippet()}
				</div>
				<div class="absolute inset-0 max-w-126 bg-linear-to-r from-transparent via-base-300/60 to-base-300 to-99% group-hover:via-neutral-300/60 group-hover:to-neutral-300"></div>
			</div>
		{/if}
		<a
			href={disabled ? undefined : link}
			class="relative z-10 flex min-w-0 flex-1 items-center gap-3"
			class:pointer-events-none={disabled}
		>
			<div
				class="shrink-0 rounded-full ring-1 ring-black"
			>
				{@render picture()}
			</div>

			<div class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
				<div class="min-w-0 shrink-0">
					<div class="flex items-center gap-2 mb-0.5">
						<p class="truncate text-lg/tight font-bold text-outline">
							{title}
							{#if !disabled}
								<span class="block h-0.5 max-w-0 bg-primary transition-all duration-500 group-hover:max-w-full"></span>
							{/if}
						</p>
						{#if iconSnippet}
							<div class="shrink-0">
								{@render iconSnippet()}
							</div>
						{/if}
					</div>
					<p class="truncate font-semibold text-primary text-outline">
						@{slug}
					</p>
				</div>

				{#if description}
					<div class="flex-1 min-w-0">
						<p class="text-sm text-base-content/70 line-clamp-1 sm:line-clamp-2 sm:ml-4 text-outline">
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