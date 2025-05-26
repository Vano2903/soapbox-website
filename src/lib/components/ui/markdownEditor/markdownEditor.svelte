<script lang="ts">
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'isomorphic-dompurify';

	const carta = new Carta({
		sanitizer: DOMPurify.sanitize
		// theme: 'github-dark',
	});

	// let theme = $state('github-light');

	let {
		theme = $bindable(),
		value = $bindable(),
		...rest
	}: {
		theme: string;
		value: string;
	} = $props();
</script>

<MarkdownEditor {carta} bind:value />
