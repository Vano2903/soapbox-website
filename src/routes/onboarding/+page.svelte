<script lang="ts">
	import { GenderKind } from '$tsTypes/user.js';
	import CodiceFiscale from 'codice-fiscale-js';
	import { untrack } from 'svelte';
	import SuperDebug, { dateProxy, superForm } from 'sveltekit-superforms';
	import { debounce } from 'throttle-debounce';
	import { zod } from 'sveltekit-superforms/adapters';
	import { schema } from './schema';

	const { data } = $props();
	const { countryPhoneCodes } = data;

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		validators: zod(schema)
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
				if (!$form.username) cancel();
			},
			onUpdated({ form }) {
				$errors.username = form.errors.username;
			}
		}
	);

	const checkUsername = debounce(200, submitCheckUsername);

	let fiscalCode = $state('');
	// let username = $state('');
	const proxyDate = dateProxy(form, 'birthDate', { format: 'date' });

	let prefixes = $state(countryPhoneCodes);
	let gender = $state() as GenderKind;

	// $effect(() => {
	// 	username = username.trimStart().replaceAll(' ', '-').toLowerCase();
	// 	untrack(() => {
	// 		$form.username = username;
	// 	});
	// });

	$effect(() => {
		$form.fiscalCode = fiscalCode;

		try {
			const cf = new CodiceFiscale(fiscalCode.toUpperCase());
			$proxyDate = cf.birthday.toISOString().split('T')[0];
			if (cf.gender === 'M') {
				gender = GenderKind.Male;
			} else {
				gender = GenderKind.Female;
			}
			$form.gender = gender;
		} catch (error) {}
	});

	// let files = $state<FileList | null | undefined>(undefined);

	// function clear() {
	// 	files = new DataTransfer().files; // null or undefined does not work
	// }

	const userDomain = 'boxrally.eu/u/';
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="text-primary mb-8 text-3xl font-bold">Completa il tuo profilo</h1>
	<SuperDebug data={$form} />
	<form method="POST" class="flex flex-col space-y-8" use:enhance action="?/onboard">
		<!-- Contact Information Section -->
		<div class="border-base-content space-y-6 border-b pb-8">
			<h2 class="text-primary text-lg font-semibold">Informazioni di Contatto</h2>
			<div class="flex flex-col gap-4 md:flex-row">
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">Nome</legend>
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
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">Cognome</legend>
					<input
						{...$constraints.lastName}
						class:input-error={$errors.lastName}
						class:input-success={$form.lastName && 'lastName' in $errors && !$errors.lastName}
						type="text"
						aria-invalid={$errors.lastName ? 'true' : undefined}
						bind:value={$form.lastName}
						class="input w-full"
						name="lastName"
						placeholder="Rossi"
					/>
					{#if $errors.lastName}
						<p class="fieldset-label text-error">{$errors.lastName}</p>
					{/if}
				</fieldset>
			</div>

			<div class="flex flex-col space-y-2 md:flex-row">
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">Telefono</legend>
					<div class="flex flex-1 flex-col gap-4 md:flex-row" id="phoneNumber">
						<select
							class="select w-full md:max-w-1/3"
							name="prefix"
							id="prefix"
							autocomplete="tel-country-code"
							bind:value={$form.prefix}
						>
							{#each prefixes as prefix}
								<option selected={prefix.default} value={prefix.dial_code}>
									{prefix.emoji}
									{prefix.name} ({prefix.dial_code})
								</option>
							{/each}
						</select>
						<input
							{...$constraints.phone}
							class:input-error={$errors.phone}
							class:input-success={$form.phone && 'phone' in $errors && !$errors.phone}
							type="text"
							alt="phone"
							name="phone"
							autocomplete="tel-national"
							placeholder="Numero di telefono"
							class="input w-full"
							bind:value={$form.phone}
							aria-invalid={$errors.phone ? 'true' : undefined}
						/>
					</div>
					{#if $errors.phone}
						<p class="fieldset-label text-error">{$errors.phone}</p>
					{/if}
				</fieldset>
			</div>
		</div>

		<!-- Personal Information Section -->
		<div class="border-base-content space-y-6 border-b pb-8">
			<div class="mb-4">
				<h2 class="text-primary text-lg font-semibold">Informazioni Personali</h2>
				<p class="text-base-content text-sm">
					Inserisci il codice fiscale o inserisci a mano il sesso e data di nascita
				</p>
			</div>

			<fieldset class="fieldset flex-1 text-base">
				<legend class="fieldset-legend">Codice Fiscale</legend>
				<input
					{...$constraints.fiscalCode}
					class:input-error={$errors.fiscalCode}
					class:input-success={$form.fiscalCode && 'fiscalCode' in $errors && !$errors.fiscalCode}
					type="text"
					id="fiscalCode"
					alt="fiscalCode"
					name="fiscalCode"
					placeholder="Codice Fiscale"
					class="input w-full"
					bind:value={fiscalCode}
					aria-invalid={$errors.fiscalCode ? 'true' : undefined}
				/>
				{#if $errors.fiscalCode}
					<p class="fieldset-label text-error">{$errors.fiscalCode}</p>
				{/if}
			</fieldset>

			<fieldset class="fieldset flex-1 flex-col text-base md:flex-row">
				<legend class="fieldset-legend">Genere</legend>

				<div class="flex items-center gap-2">
					<input
						type="radio"
						class="radio"
						alt="maschio"
						bind:group={$form.gender}
						name="gender"
						id="gender-maschio"
						value="male"
					/>
					<label for="gender-maschio">Maschio</label>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="radio"
						class="radio"
						alt="femmina"
						bind:group={$form.gender}
						name="gender"
						id="gender-femmina"
						value="female"
					/>
					<label for="gender-femmina">Femmina</label>
				</div>

				<div class="flex items-center gap-2">
					<input
						type="radio"
						class="radio"
						alt="altro"
						bind:group={$form.gender}
						name="gender"
						id="gender-altro"
						value="other"
					/>
					<label for="gender-altro">Altro</label>
				</div>

				<div class="flex items-center gap-2">
					<input
						type="radio"
						alt="preferisco non dichiarare"
						class="radio"
						bind:group={$form.gender}
						name="gender"
						id="gender-not-disclosed"
						value="not-disclosed"
					/>
					<label for="gender-not-disclosed">Preferisco non Dichiarare</label>
				</div>

				{#if $errors.gender}
					<p class="fieldset-label text-error">{$errors.gender}</p>
				{/if}
			</fieldset>

			<fieldset class="fieldset flex-1 text-base">
				<legend class="fieldset-legend">Data di Nascita</legend>
				<input
					{...$constraints.birthDate}
					class:input-error={$errors.birthDate}
					class:input-success={$form.birthDate && 'birthDate' in $errors && !$errors.birthDate}
					readonly={!!$form.fiscalCode}
					min={$constraints.birthDate?.min?.toString().slice(0, 10)}
					id="birthDate"
					name="birthDate"
					type="date"
					autocomplete="bday"
					class="input w-full"
					class:disabled-input={$form.fiscalCode}
					bind:value={$proxyDate}
					aria-invalid={$errors.birthDate ? 'true' : undefined}
				/>
				{#if $errors.birthDate}
					<p class="fieldset-label text-error">{$errors.birthDate}</p>
				{/if}
			</fieldset>
		</div>

		<!-- Social Information Section -->
		<div class="space-y-6">
			<h2 class="text-primary text-lg font-semibold">Informazioni Sociali</h2>

			<fieldset class="fieldset flex-1 text-base">
				<legend class="fieldset-legend">Username</legend>

				<label
					class="input w-full"
					class:input-error={$errors.username}
					class:input-success={$form.username &&
						'username' in $errors &&
						!$errors.username &&
						!$delayed}
				>
					<!-- class:input-success={$form.username && 'username' in $errors} -->
					<span class="label">{userDomain}</span>
					<input
						{...$constraints.username}
						autocomplete="username"
						type="text"
						form="check"
						name="username"
						id="username"
						bind:value={
							() => $form.username,
							(n) => ($form.username = n.trimStart().replaceAll(' ', '-').toLowerCase())
						}
						aria-invalid={$errors.username ? 'true' : undefined}
						placeholder="mario-rossi"
						oninput={checkUsername}
					/>
					<!-- class:input-error={$errors.username}
						class:input-success={$form.username && 'username' in $errors} -->
				</label>

				<input type="hidden" name="username" value={$form.username} />
				<p class="text-base-content mb-2 text-xs/5">
					Il nickname sará usato per creare il tuo URL personalizzato con la quale potrai
					condividere il profilo.
				</p>

				{#if $delayed}
					<span class="loading loading-spinner loading-sm"></span>
				{:else if $errors.username}
					<!-- ❌ -->
					<!-- <p class="fieldset-label text-error">Username errors:</p> -->
					<ul class="fieldset-label text-error flex-col items-start">
						{#each $errors.username as error}
							<li>
								{error}
							</li>
						{/each}
					</ul>
					<!-- {:else if $form.username && 'username' in $errors}
					✅ -->
				{/if}

				<!-- rounded-lg border border-gray-300 px-4 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600" -->
				<!-- {#if $errors.username}
				{/if} -->
			</fieldset>

			<fieldset class="fieldset flex-1 flex-col text-base md:flex-row">
				<legend class="fieldset-legend">Vuoi che il tuo account pubblico?</legend>
				<p class="text-base-content mb-2 text-xs/5">
					Se rendi il tuo account pubblico chiunque potrà vedere le informazioni del tuo profilo e
					le tue statistiche da pilota. <br />
					Se selezioni di no invece il tuo profilo sarà visibile solo a te e ad eventuali membri del
					tuo team. Puoi sempre cambiare questa opzione in un secondo momento.
				</p>

				<div class="flex items-center gap-2">
					<input
						type="radio"
						class="radio"
						alt="pubblico"
						bind:group={$form.visibility}
						name="visibility"
						id="visibility-public"
						value="public"
					/>
					<label for="visibility-public">Pubblico</label>
				</div>
				<div class="flex items-center gap-2">
					<input
						type="radio"
						class="radio"
						alt="privato"
						bind:group={$form.visibility}
						name="visibility"
						id="visibility-private"
						value="private"
					/>
					<label for="visibility-private">Privato</label>
				</div>

				{#if $errors.visibility}
					<p class="fieldset-label text-error">{$errors.visibility}</p>
				{/if}
			</fieldset>

			<!-- Submit Button -->
			<button disabled={$delayed} type="submit" class="btn btn-primary w-full">
				<!-- class="mt-8 w-full rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none" -->
				Completa registrazione
			</button>
		</div>
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
