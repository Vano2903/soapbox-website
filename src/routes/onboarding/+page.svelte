<script lang="ts">
	import { GenderKind, UserVisiblityKind } from '$types/pocketbase/user.js';
	import CodiceFiscale from 'codice-fiscale-js';
	import { dateProxy, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { onboardingSchema } from '$lib/schemas/onboardingSchema';
	import ContextualHelp from '$components/contextualHelp/contextualHelp.svelte';
	import {
		TextField,
		SelectField,
		RadioGroupField,
		DateField
	} from '$components/forms';

	const { data } = $props();
	const { countryPhoneCodes, contextualHelps } = data;

	const { form, errors, message, constraints, enhance, submitting } = superForm(data.form, {
		dataType: 'json',
		validators: zod(onboardingSchema)
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

	let fiscalCode = $state('');
	const proxyDate = dateProxy(form, 'birthDate', { format: 'date' });

	$effect(() => {
		$form.fiscalCode = fiscalCode;
		if (!fiscalCode) return;
		try {
			const cf = new CodiceFiscale(fiscalCode.toUpperCase());
			$proxyDate = cf.birthday.toISOString().split('T')[0];
			$form.gender = cf.gender === 'M' ? GenderKind.Male : GenderKind.Female;
		} catch {
			// ignore — invalid CF
		}
	});

	const userDomain = 'boxrally.eu/u/';

	const genderOptions = [
		{ value: GenderKind.Male, label: 'Maschio' },
		{ value: GenderKind.Female, label: 'Femmina' },
		{ value: GenderKind.Other, label: 'Altro' },
		{ value: GenderKind.NotDisclosed, label: 'Preferisco non dichiarare' }
	];

	const visibilityOptions = [
		{ value: UserVisiblityKind.Public, label: 'Pubblico' },
		{ value: UserVisiblityKind.Private, label: 'Privato' }
	];

	function slugify(raw: string) {
		return raw.trimStart().replaceAll(' ', '-').toLowerCase();
	}
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="text-primary mb-8 text-3xl font-bold">Completa il tuo profilo</h1>

	<form
		method="POST"
		class="flex flex-col space-y-8"
		enctype="multipart/form-data"
		use:enhance
		action="?/onboard"
	>
		<section class="border-base-content space-y-6 border-b pb-8">
			<h2 class="text-primary text-lg font-semibold">Informazioni di Contatto</h2>

			<div class="flex flex-col gap-4 md:flex-row">
				<TextField
					name="name"
					label="Nome"
					placeholder="Mario"
					bind:value={$form.name}
					errors={$errors.name}
					constraints={$constraints.name}
				/>
				<TextField
					name="lastName"
					label="Cognome"
					placeholder="Rossi"
					bind:value={$form.lastName}
					errors={$errors.lastName}
					constraints={$constraints.lastName}
				/>
			</div>

			<div class="flex flex-col gap-4 md:flex-row">
				<SelectField
					name="prefix"
					label="Prefisso"
					bind:value={$form.prefix}
					errors={$errors.prefix}
					options={countryPhoneCodes}
					optionValue={(p) => p.dial_code}
					optionLabel={(p) => `${p.emoji} ${p.name} (${p.dial_code})`}
					autocomplete="tel-country-code"
				/>
				<TextField
					name="phone"
					label="Numero di telefono"
					placeholder="Numero di telefono"
					autocomplete="tel-national"
					bind:value={$form.phone}
					errors={$errors.phone}
					constraints={$constraints.phone}
				/>
			</div>
		</section>

		<section class="border-base-content space-y-6 border-b pb-8">
			<div>
				<h2 class="text-primary text-lg font-semibold">Informazioni Personali</h2>
				<p class="text-base-content text-sm">
					Inserisci il codice fiscale o inserisci a mano il sesso e data di nascita
				</p>
			</div>

			<TextField
				name="fiscalCode"
				label="Codice Fiscale"
				placeholder="RSSMRA80A01H501U"
				bind:value={fiscalCode}
				errors={$errors.fiscalCode}
				constraints={$constraints.fiscalCode}
			/>

			<RadioGroupField
				name="gender"
				label="Genere"
				value={$form.gender}
				setValue={(v) => ($form.gender = v)}
				errors={$errors.gender}
				options={genderOptions}
			/>

			<DateField
				name="birthDate"
				label="Data di Nascita"
				bind:value={$proxyDate}
				errors={$errors.birthDate}
				constraints={$constraints.birthDate}
				min={$constraints.birthDate?.min?.toString().slice(0, 10)}
				readonly={!!$form.fiscalCode}
			/>
		</section>

		<section class="space-y-6">
			<h2 class="text-primary text-lg font-semibold">Informazioni Sociali</h2>

			<TextField
				name="username"
				label="Username"
				placeholder="mario-rossi"
				prefix={userDomain}
				form="check"
				autocomplete="username"
				bind:value={$form.username}
				errors={$errors.username}
				constraints={$constraints.username}
				transform={slugify}
				debounceMs={200}
				onInput={() => submitCheckUsername()}
				delayed={$delayed}
				hint="Il nickname sará usato per creare il tuo URL personalizzato con la quale potrai condividere il profilo."
			/>
			<input type="hidden" name="username" value={$form.username} />

			<RadioGroupField
				name="visibility"
				label="Vuoi che il tuo account sia pubblico?"
				hint="Se pubblico, chiunque potrà vedere il tuo profilo e le tue statistiche. Se privato, sarà visibile solo a te e ai membri del tuo team."
				value={$form.visibility}
				setValue={(v) => ($form.visibility = v)}
				errors={$errors.visibility}
				options={visibilityOptions}
			/>

			<button disabled={$delayed || $submitting} type="submit" class="btn btn-primary w-full">
				{#if $submitting}<span class="loading loading-spinner"></span>{/if}
				Completa registrazione
			</button>
		</section>

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

	<!-- ContextualHelp opens a modal whose markup includes `<form method="dialog">`;
	     embedding it inside the main `<form>` triggers `node_invalid_placement_ssr`
	     and breaks hydration. We render the help trigger as a sibling and rely on
	     it being visually close enough to the visibility question above. -->
	<div class="mt-3 flex items-center gap-2 text-sm">
		<span>Hai dubbi sulla visibilità dell'account?</span>
		<ContextualHelp contextualHelp={contextualHelps.onboarding_profileVisibility} />
	</div>
</main>
