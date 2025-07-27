<script lang="ts">
	import { Copy, Check } from 'lucide-svelte';
	import type { Snippet } from 'svelte';

	interface ClipboardButtonProps {
		textBeforeCopy?: Snippet;
		textAfterCopy?: Snippet;
		content: string;
		label?: string;
		class?: string;
		disabled?: boolean;
		resetDelay?: number;
	}

	let {
		textBeforeCopy,
		textAfterCopy,
		content,
		label = 'Copia negli appunti',
		class: className = '',
		disabled = false,
		resetDelay = 2000
	}: ClipboardButtonProps = $props();

	// let textBeforeCopySnippet = textBeforeCopy || (() => <span>Copy</span>);

	let isCopied = $state(false);
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	async function copyContent() {
		if (disabled || isCopied) return;
		console.log('Copying content:', content);
		try {
			await navigator.clipboard.writeText(content);

			// Clear any existing timeout
			if (timeoutId) {
				clearTimeout(timeoutId);
			}

			// Update state with animation
			isCopied = true;

			// Reset after delay
			timeoutId = setTimeout(() => {
				isCopied = false;
				timeoutId = null;
			}, resetDelay);
		} catch (err) {
			console.error('Failed to copy text: ', err);
			// Optionally handle error (e.g., show toast notification)
		}
	}

	// Cleanup timeout on component destroy
	$effect(() => {
		return () => {
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
		};
	});
</script>

<button
	class={`clipboard-button transition-all duration-200 ease-in-out ${className}`}
	class:copied={isCopied}
	onclick={copyContent}
	aria-label={label}
	{disabled}
>
	<div class="content-wrapper" class:scale-110={isCopied}>
		{#if isCopied}
			<div class="fade-in">
				{#if textBeforeCopy}
					{@render textBeforeCopy()}
				{:else}
					<div class="m-2 flex flex-nowrap">
						<Check class="size-[1.2em] sm:mr-2" />
						<span class="hidden sm:block">Copiato</span>
					</div>
				{/if}
			</div>
		{:else}
			<div class="fade-in">
				{#if textAfterCopy}
					{@render textAfterCopy()}
				{:else}
					<div class="m-2 flex flex-nowrap items-center">
						<Copy class="size-[1.2em] sm:mr-2" />
						<span class="hidden sm:block">Copia</span>
					</div>
				{/if}
				<!-- {@render textAfterCopy()} -->
			</div>
		{/if}
	</div>
</button>

<style>
	.clipboard-button {
		position: relative;
		overflow: hidden;
		cursor: pointer;
		transition: all 0.2s ease-in-out;
	}

	.clipboard-button:hover:not(:disabled) {
		transform: translateY(-1px);
	}

	.clipboard-button:active:not(:disabled) {
		transform: translateY(0);
	}

	.clipboard-button:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.content-wrapper {
		transition: transform 0.2s ease-in-out;
	}

	.fade-in {
		animation: fadeIn 0.3s ease-in-out;
	}

	.copied {
		background-color: rgba(34, 197, 94, 0.1);
		border-color: rgb(34, 197, 94);
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: scale(0.9);
		}
		to {
			opacity: 1;
			transform: scale(1);
		}
	}

	/* Ripple effect */
	.clipboard-button::after {
		content: '';
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		background: rgba(255, 255, 255, 0.5);
		border-radius: 50%;
		transform: translate(-50%, -50%);
		transition:
			width 0.3s,
			height 0.3s;
		pointer-events: none;
	}

	.clipboard-button:active::after {
		width: 200px;
		height: 200px;
	}
</style>
