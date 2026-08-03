<script lang="ts">
	import { GenderKind, UserVisiblityKind } from '$types/pocketbase/user.js';
	import CodiceFiscale from 'codice-fiscale-js';
	import { dateProxy, fileProxy, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { userSettingsSchema } from '$lib/schemas/userSettingsSchema';
	import { env } from '$env/dynamic/public';
	import { urlToFileList } from '$lib/utils/imageHydrate';
	import {
		TextField,
		TextareaField,
		SelectField,
		RadioGroupField,
		DateField,
		ImageField
	} from '$components/forms';

	const { data } = $props();
	const { countryPhoneCodes, fileUrls } = data;

	const { form, errors, message, constraints, enhance, submitting } = superForm(data.form, {
		dataType: 'json',
		validators: zod(userSettingsSchema)
	});

	$effect(() => {
		console.log('DBG user-settings',
			'avatarOriginal=', $form.avatarOriginal, 'errAO=', $errors.avatarOriginal,
			'avatarCropped=', $form.avatarCropped, 'errAC=', $errors.avatarCropped);
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

	// --- file hydration from server URLs (existing avatar/banner). Done once on mount.
	const avatar = fileProxy(form, 'avatarOriginal');
	const avatarCropped = fileProxy(form, 'avatarCropped');
	const banner = fileProxy(form, 'bannerOriginal');
	const bannerCropped = fileProxy(form, 'bannerCropped');

	let hydrated = $state(false);
	$effect(() => {
		if (hydrated || !fileUrls) return;
		hydrated = true;
		void (async () => {
			const [a, ac, b, bc] = await Promise.all([
				urlToFileList(fileUrls.avatarOriginal, 'avatar'),
				urlToFileList(fileUrls.avatarCropped, 'avatar-cropped.webp'),
				urlToFileList(fileUrls.bannerOriginal, 'banner'),
				urlToFileList(fileUrls.bannerCropped, 'banner-cropped.webp')
			]);
			if (a) $avatar = a;
			if (ac) $avatarCropped = ac;
			if (b) $banner = b;
			if (bc) $bannerCropped = bc;
		})();
	});

	// --- fiscal-code-driven autofill
	let fiscalCode = $state($form.fiscalCode ?? '');
	const proxyDate = dateProxy(form, 'birthDate', { format: 'date' });
	$effect(() => {
		$form.fiscalCode = fiscalCode;
		if (!fiscalCode) return;
		try {
			const cf = new CodiceFiscale(fiscalCode.toUpperCase());
			$proxyDate = cf.birthday.toISOString().split('T')[0];
			$form.gender = cf.gender === 'M' ? GenderKind.Male : GenderKind.Female;
		} catch {
			// ignore — invalid CF, leave fields as user typed them
		}
	});

	const userDomain = env.PUBLIC_BASE_URL + '/user/';

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
	<h1 class="text-primary mb-8 text-3xl font-bold">Modifica il tuo profilo</h1>

	<form
		method="POST"
		enctype="multipart/form-data"
		class="flex flex-col space-y-8"
		use:enhance
		action="?/updateAccount"
	>
		<!-- Contact information -->
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

		<!-- Personal information -->
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
				autocomplete="bday"
			/>
		</section>

		<!-- Social information -->
		<section class="space-y-6">
			<h2 class="text-primary text-lg font-semibold">Informazioni Sociali</h2>

			<TextField
				name="nick"
				label="Username"
				placeholder="mario-rossi"
				prefix={userDomain}
				form="check"
				autocomplete="username"
				bind:value={$form.nick}
				errors={$errors.nick}
				constraints={$constraints.nick}
				transform={slugify}
				debounceMs={200}
				onInput={() => submitCheckUsername()}
				delayed={$delayed}
				hint="Il nickname sará usato per creare il tuo URL personalizzato con la quale potrai condividere il profilo."
			/>
			<input type="hidden" name="nick" value={$form.nick} />

			<RadioGroupField
				name="visibility"
				label="Visibilità dell'account"
				hint="Se pubblico, chiunque potrà vedere il tuo profilo e le tue statistiche. Se privato, sarà visibile solo a te e ai membri del tuo team."
				value={$form.visibility}
				setValue={(v) => ($form.visibility = v)}
				errors={$errors.visibility}
				options={visibilityOptions}
				layout="horizontal"
			/>

			<ImageField
				name="avatar"
				label="Foto profilo"
				shape="round"
				bind:original={$avatar}
				bind:cropped={$avatarCropped}
				bind:cropArea={$form.avatarCroppedInfo}
				errors={$errors.avatarOriginal ?? $errors.avatarCropped}
			/>

			<ImageField
				name="banner"
				label="Immagine di sfondo (banner)"
				shape="rect"
				bind:original={$banner}
				bind:cropped={$bannerCropped}
				bind:cropArea={$form.bannerCroppedInfo}
				errors={$errors.bannerOriginal ?? $errors.bannerCropped}
			/>

			<TextareaField
				name="bio"
				label="Bio"
				placeholder="Scrivi qualcosa su di te..."
				bind:value={$form.bio}
				errors={$errors.bio}
				constraints={$constraints.bio}
			/>

			<button disabled={$delayed || $submitting} type="submit" class="btn btn-primary w-full">
				{#if $submitting}<span class="loading loading-spinner"></span>{/if}
				Aggiorna il tuo account
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
		</section>
	</form>

	<form id="check" method="POST" action="?/checkUsername" use:submitEnhance></form>
</main>
