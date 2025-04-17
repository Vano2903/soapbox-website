<script lang="ts">
	import { GenderKind } from '$tsTypes/user.js';
	import CodiceFiscale from 'codice-fiscale-js';
	import { onMount, untrack } from 'svelte';
	import SuperDebug, { dateProxy, fileProxy, superForm } from 'sveltekit-superforms';
	import { debounce } from 'throttle-debounce';
	import { zod } from 'sveltekit-superforms/adapters';
	import { page } from '$app/state';
	import { schema } from './schema';
	import { goto, invalidateAll } from '$app/navigation';
	import { Carta, MarkdownEditor } from 'carta-md';
	import 'carta-md/default.css'; /* Default theme */
	import DOMPurify from 'isomorphic-dompurify';
	import ImageCropper from '$components/imageCropper/imageCropper.svelte';

	const { data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		validators: zod(schema)
	});

	let successMessage = $state('');

	$effect(() => {
		if (page.status === 200 && $message) {
			console.log('invalidating and reloading');
			localStorage.setItem('user-update-message', $message);
			// reload page
			invalidateAll();
			// goto('/dash/settings');
			window.location.href = '/dash/settings';
		}
	});

	onMount(() => {
		successMessage = localStorage.getItem('user-update-message') ?? '';
		if (successMessage) {
			successMessage += ` torna alla <a href="/dash" class="link">dashboard</a>`;
		}
		localStorage.removeItem('user-update-message');
	});

	// --- username
	let nick = $state($form.nick);
	const teamDomain = 'boxrally.eu/t/';

	$effect(() => {
		nick = nick.trimStart().replaceAll(' ', '-').toLowerCase();
		untrack(() => {
			$form.nick = nick;
		});
	});

	const {
		delayed,
		submit: submitCheckUsername,
		enhance: submitEnhance
	} = superForm(
		{ username: '' },
		{
			invalidateAll: false,
			applyAction: false,
			multipleSubmits: 'abort',
			onSubmit({ cancel }) {
				if (!$form.nick) cancel();
			},
			onUpdated({ form }) {
				$errors.nick = form.errors.username;
			}
		}
	);

	const checkUsername = debounce(200, submitCheckUsername);

	// --- bio
	let theme = $state('github-light');
	const carta = new Carta({
		theme: 'github-dark',
		sanitizer: DOMPurify.sanitize
	});
	let value = $state('');

	// --- images
	const logo = fileProxy(form, 'logo.file');
	const banner = fileProxy(form, 'banner');

	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let croppedArea = $state({ x: 0, y: 0, width: 0, height: 0 });
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="text-primary mb-8 text-3xl font-bold">Crea il tuo team</h1>
	<!-- <SuperDebug data={$form} /> -->
	<form
		method="POST"
		class="flex flex-col space-y-8"
		enctype="multipart/form-data"
		use:enhance
		action="?/createTeam"
	>
		<!-- Contact Information Section -->
		<div class="border-base-content space-y-6 border-b pb-8">
			<!-- <div class="flex flex-col gap-4 md:flex-row"> -->
			<fieldset class="fieldset flex-1 text-base">
				<legend class="fieldset-legend">Nome completo del team</legend>
				<input
					{...$constraints.name}
					class:input-error={$errors.name}
					class:input-success={$form.name && 'name' in $errors && !$errors.name}
					type="text"
					aria-invalid={$errors.name ? 'true' : undefined}
					bind:value={$form.name}
					class="input w-full"
					name="name"
					placeholder="Mario"
				/>
				{#if $errors.name}
					<p class="fieldset-label text-error">{$errors.name}</p>
				{/if}
			</fieldset>
			<!-- </div> -->

			<fieldset class="fieldset flex-1 text-base">
				<legend class="fieldset-legend">Username per il team</legend>

				<label
					class="input w-full"
					class:input-error={$errors.nick}
					class:input-success={$form.nick && 'nick' in $errors && !$errors.nick && !$delayed}
				>
					<!-- class:input-success={$form.nick && 'nick' in $errors} -->
					<span class="label">{teamDomain}</span>
					<input
						{...$constraints.nick}
						autocomplete="username"
						type="text"
						form="check"
						name="nick"
						id="nick"
						bind:value={nick}
						aria-invalid={$errors.nick ? 'true' : undefined}
						placeholder="mario-rossi"
						oninput={checkUsername}
					/>
				</label>

				<input type="hidden" name="nick" value={$form.nick} />
				<p class="text-base-content mb-2 text-xs/5">
					L'username sará usato per creare una pagina pubblica per il tuo team.
					<br />
					Non usare spazi o caratteri speciali, solo lettere, numeri e trattini.
					<br />
					Ad esempio il team con username <strong>asd-team</strong> avrà come pagina
					<span class="font-bold italic">{`https://${teamDomain}asd-team`}</span>
				</p>

				{#if $delayed}
					<div>
						<span>verifica disponibilità</span>
						<span class="loading loading-spinner loading-sm"></span>
					</div>
				{:else if $errors.nick}
					<ul class="fieldset-label text-error flex-col items-start">
						{#each $errors.nick as error}
							<li>
								{error}
							</li>
						{/each}
					</ul>
				{/if}
			</fieldset>

			<ImageCropper
				name="logo"
				value={$logo}
				label="carica un logo per il tuo team"
				errors={$errors.logo?.file}
				constraints={$constraints.logo?.file}
				{crop}
				{zoom}
				shape="round"
				pixels={croppedArea}
			/>
			<!-- </div> -->
		</div>

		<!-- Personal Information Section -->

		<!-- Submit Button -->
		<button disabled={$delayed} type="submit" class="btn btn-primary w-full">
			<!-- class="mt-8 w-full rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none" -->
			Crea il tuo team
		</button>
		{#if $message && page.status !== 200}
			<div class="alert alert-error">
				<!-- class:alert-success={page.status == 200}
					class:alert-error={page.status !== 200} -->
				{$message}
			</div>
		{/if}
		{#if successMessage}
			<div class="alert alert-success">
				<!-- class:alert-success={page.status == 200}
					class:alert-error={page.status !== 200} -->
				{@html successMessage}
			</div>
		{/if}
	</form>

	<form id="check" method="POST" action="?/checkUsername" use:submitEnhance></form>
</main>

<style>
	.disabled-input {
		border-color: var(--color-base-200);
		background-color: var(--color-base-200);
		color: var(--color-base-content/40);
		&::placeholder {
			color: var(--color-base-content/20);
		}
		cursor: not-allowed;
		box-shadow: none;
	}
</style>
