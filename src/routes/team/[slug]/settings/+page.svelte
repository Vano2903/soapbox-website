<script lang="ts">
	import SuperDebug, { fieldProxy, fileProxy, superForm } from 'sveltekit-superforms';
	import { debounce } from 'throttle-debounce';
	import { zod } from 'sveltekit-superforms/adapters';
	import {teamSchema} from '$lib/schemas/teamSchema';
	import ImageCropper from '$components/imageCropper/imageCropper.svelte';
	const { data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		dataType: 'json',
		validators: zod(teamSchema)
	});

	// --- username
	const teamDomain = 'boxrally.eu/t/';

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
				if (!$form.slug) cancel();
			},
			onUpdated({ form }) {
				$errors.slug = form.errors.username;
			}
		}
	);

	const checkUsername = debounce(200, submitCheckUsername);

	// --- images
	// const logotest = fileProxy(form, 'logoTest');
	const logo = fileProxy(form, 'logoOriginal');
	const logoCropped = $state(fileProxy(form, 'logoCropped'));
	const banner = fileProxy(form, 'bannerOriginal');
	const bannerCropped = $state(fileProxy(form, 'bannerCropped'));
	const bioProxy = fieldProxy(form, 'bio');
	let crop = $state({ x: 0, y: 0 });
	let zoom = $state(1);
	let username = fieldProxy(form, 'slug');
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="text-primary mb-8 text-3xl font-bold">Crea il tuo team</h1>
	<SuperDebug data={$form} />
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
					class:input-error={$errors.slug}
					class:input-success={$form.slug && 'slug' in $errors && !$errors.slug && !$delayed}
				>
					<!-- class:input-success={$form.slug && 'slug' in $errors} -->
					<span class="label">{teamDomain}</span>
					<input
						{...$constraints.slug}
						autocomplete="username"
						type="text"
						form="check"
						name="slug"
						id="slug"
						bind:value={
							() => $username,
							(n) => {
								$username = n.trimStart().replaceAll(' ', '-').toLowerCase();
							}
						}
						aria-invalid={$errors.slug ? 'true' : undefined}
						placeholder="mario-rossi"
						oninput={checkUsername}
					/>
				</label>

				<input type="hidden" name="slug" value={$form.slug} />
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
				{:else if $errors.slug}
					<ul class="fieldset-label text-error flex-col items-start">
						{#each $errors.slug as error}
							<li>
								{error}
							</li>
						{/each}
					</ul>
				{/if}
			</fieldset>

			<ImageCropper
				name="logoOriginal"
				bind:value={$logo}
				label="Carica un logo per il tuo team"
				constraints={{ required: false }}
				errors={$errors.logoOriginal}
				bind:cropped={$logoCropped}
				bind:pixels={$form.logoCroppedInfo}
				{crop}
				{zoom}
				shape="round"
			/>

			<ImageCropper
				name="banner"
				bind:value={$banner}
				label="Carica un immagine di sfondo (banner) per la pagina del tuo team"
				constraints={{ required: false }}
				errors={$errors.bannerOriginal}
				bind:cropped={$bannerCropped}
				bind:pixels={$form.bannerCroppedInfo}
				{crop}
				{zoom}
				shape="rect"
			/>
		</div>

		<!-- Personal Information Section -->
		<fieldset class="fieldset flex-1 text-base">
			<legend class="fieldset-legend">Descrizione del team</legend>
			<textarea
				{...$constraints.bio}
				class:textarea-error={$errors.bio}
				class:textarea-success={$form.bio && 'bio' in $errors && !$errors.bio}
				aria-invalid={$errors.bio ? 'true' : undefined}
				bind:value={$bioProxy}
				class="textarea h-24 w-full"
				placeholder="Bio"
				name="bio"
				id="bio"
			></textarea>

			{#if $errors.bio}
				<p class="fieldset-label text-error">{$errors.bio}</p>
			{/if}
		</fieldset>

		<!-- Submit Button -->
		<button disabled={$delayed} type="submit" class="btn btn-primary w-full">
			<!-- class="mt-8 w-full rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none" -->
			Crea il tuo team
		</button>

		{#if $message}
			<div
				class="alert"
				class:alert-success={$message.type === 'success'}
				class:alert-error={$message.type === 'error'}
			>
				{@html $message.text}
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
