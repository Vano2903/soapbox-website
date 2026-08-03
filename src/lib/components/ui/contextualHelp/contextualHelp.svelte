<script lang="ts">
	import { X, CircleQuestionMark } from '@lucide/svelte';
	import type { Snippet } from 'svelte';
	import type { ContextualHelp } from '$types/documentation';

	interface Props {
		/** contenuto della guida contestuale da visualizzare nel modale */
		contextualHelp: ContextualHelp;
		/** */
		stopPropagation?: boolean;
		/** icona opzionale per il pulsante */
		iconSnippet?: Snippet;
	}

	let { contextualHelp, stopPropagation = false, iconSnippet }: Props = $props();
</script>

<button
	class="btn btn-sm btn-circle btn-ghost tooltip tooltip-left tooltip-unbold"
	data-tip="Mostra aiuto"
	onclick={(e) => {
		(
			document.getElementById(contextualHelp.docReference + '-help_modal') as HTMLDialogElement
		)?.showModal();
		if (stopPropagation) {
			e.stopPropagation();
		}
	}}
>
	{#if iconSnippet}
		{@render iconSnippet()}
	{:else}
		<CircleQuestionMark class="h-5 w-5 text-gray-600" />
	{/if}
</button>

<dialog id={contextualHelp.docReference + '-help_modal'} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<div class="mb-4 flex items-start justify-between">
			<div class="flex-1">
				<h3 class="text-lg font-bold md:text-xl">
					{contextualHelp.name ?? 'Contenuto non trovato'}
				</h3>
				<p class="text-base-content/70 mt-1 text-xs md:text-sm">Guida all'utilizzo del sito</p>
			</div>
			<div class="flex items-start gap-2">
				<form method="dialog">
					<button class="btn btn-square btn-ghost btn-md md:btn-lg" title="Chiudi">
						<X class="h-6 w-6" />
					</button>
				</form>
			</div>
		</div>
		<p class="text-xs md:text-sm">
			{contextualHelp.shortContent ?? ''}
		</p>
		<p class="mt-1 text-xs md:text-sm">
			Maggiori informazioni nella <a
				href={`/docs#${contextualHelp.docReference ?? ''}`}
				class="text-primary underline">documentazione</a
			>
		</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>

<style>
	.tooltip-unbold.tooltip::before {
		font-weight: 400;
	}
</style>
