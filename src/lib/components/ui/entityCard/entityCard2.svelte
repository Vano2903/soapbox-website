<script lang="ts">
	import { type Icon as IconType } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface Props {
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
			transition-all duration-300
			{disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-300 hover:shadow-md active:scale-99 hover:scale-101'}
		"
	>
		<a
			href={disabled ? undefined : link}
			class="flex min-w-0 flex-1 items-center gap-3"
			class:pointer-events-none={disabled}
		>
			<div
				class="shrink-0 rounded-full {disabled ? '' : 'ring-1 ring-black'}"
			>
				{@render picture()}
			</div>

			<!-- Edit1, MoraGames -->
			<!-- <div class="min-w-0 flex justify-between gap-4">
				<div class="truncate sm:overflow-visible sm:text">
					<div class="flex items-center gap-2 mb-0.5">
						<p class="truncate text-lg/tight font-bold">
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

					<p class="truncate font-semibold text-primary">
						@{slug}
					</p>
				</div>
				{#if description}
					<p class="max-w-4/5 line-clamp-2 mt-0.5 text-sm text-base-content/60 invisible md:visible">{description}</p>
				{/if}
			</div> -->

			<!-- Edit2, DeepSeek-v3 -->
			<!-- <div class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
				<div class="min-w-0 flex-1 sm:max-w-1/5">
					<div class="flex items-center gap-2 mb-0.5">
						<p class="truncate text-lg/tight font-bold">
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
					<p class="truncate font-semibold text-primary">
						@{slug}
					</p>
				</div>

				{#if description}
					<p class="text-sm text-base-content/60 mt-0.5 sm:mt-0 line-clamp-1 sm:line-clamp-2 sm:flex-1 sm:min-w-0 max-w-none">
						{description}
					</p>
				{/if}
			</div> -->

			<!-- Edit3, DeepSeek-v3 -->
			<div class="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-2">
				<!-- Title and slug section - takes minimal space needed -->
				<div class="min-w-0 shrink-0">
					<div class="flex items-center gap-2 mb-0.5">
						<p class="truncate text-lg/tight font-bold">
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
					<p class="truncate font-semibold text-primary">
						@{slug}
					</p>
				</div>

				<!-- Description - takes remaining space but collapses on small screens -->
				{#if description}
					<div class="flex-1 min-w-0">
						<p class="text-sm text-base-content/60 line-clamp-1 sm:line-clamp-2 sm:ml-4">
							{description}
						</p>
					</div>
				{/if}
			</div>

			<!-- Original, Vano2903 -->
			<!-- <div class="min-w-0 flex-1">
				<div class="flex items-center gap-2 mb-0.5">
					<p class="truncate text-lg/tight font-bold">
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

				<p class="truncate font-semibold text-primary">
					@{slug}
				</p>
				{#if description}
					<p class="mt-0.5 line-clamp-1 text-sm text-base-content/60">{description}</p>
				{/if}
			</div> -->
		</a>

		{#if actionButtons}
			<div class="flex shrink-0 items-center gap-1">
				{@render actionButtons()}
			</div>
		{/if}
	</div>
</div>