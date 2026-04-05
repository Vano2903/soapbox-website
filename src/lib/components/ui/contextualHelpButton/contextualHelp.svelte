<script lang="ts">
	import { X, CircleHelp } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { ContextualHelp } from '$types/documentation';

	interface Props {
		/** contenuto della guida contestuale da visualizzare nel modale */
		contextualHelp: ContextualHelp;
		/** icona opzionale per il pulsante */
		iconSnippet?: Snippet;
	}

	let {
		contextualHelp,
		iconSnippet,
	}: Props = $props();
</script>

<button class="btn btn-sm btn-circle btn-ghost tooltip tooltip-left tooltip-unbold" data-tip="Mostra aiuto" onclick={() => (document.getElementById(contextualHelp.docReference + '-help_modal') as HTMLDialogElement)?.showModal()}>
	{#if iconSnippet}
		{@render iconSnippet()}
	{:else}
		<CircleHelp class="h-5 w-5 text-gray-600"/>
	{/if}
</button>

<dialog id={contextualHelp.docReference + '-help_modal'} class="modal modal-bottom sm:modal-middle">
	<div class="modal-box">
		<div class="flex items-start justify-between mb-4">
			<div class="flex-1">
				<h3 class="font-bold text-lg md:text-xl">{contextualHelp.name ?? 'Contenuto non trovato'}</h3>
				<p class="text-xs md:text-sm text-base-content/70 mt-1">
					Guida all'utilizzo del sito
				</p>
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
		<p class="text-xs md:text-sm mt-1">
			Maggiori informazioni nella <a href={`/docs#${contextualHelp.docReference ?? ''}`} class="text-primary underline">documentazione</a>
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