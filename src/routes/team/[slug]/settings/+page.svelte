<script lang="ts">
	import { fileProxy, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { teamSchema } from '$lib/schemas/teamSchema';
	import { env } from '$env/dynamic/public';
	import { urlToFileList } from '$lib/utils/imageHydrate';
	import { TextField, TextareaField, ImageField } from '$components/forms';

	const { data } = $props();
	const { fileUrls } = data;

	const { form, errors, message, constraints, enhance, submitting } = superForm(data.form, {
		dataType: 'json',
		validators: zod(teamSchema)
	});

	const teamDomain = env.PUBLIC_BASE_URL + '/team/';

	const {
		delayed,
		submit: submitCheckUsername,
		enhance: submitEnhance
	} = superForm(
		{ slug: '' },
		{
			invalidateAll: false,
			applyAction: false,
			multipleSubmits: 'abort',
			onSubmit({ cancel }) {
				if (!$form.slug) cancel();
			},
			onUpdated({ form }) {
				$errors.slug = form.errors.slug;
			}
		}
	);

	const logo = fileProxy(form, 'logoOriginal');
	const logoCropped = fileProxy(form, 'logoCropped');
	const banner = fileProxy(form, 'bannerOriginal');
	const bannerCropped = fileProxy(form, 'bannerCropped');

	let hydrated = $state(false);
	$effect(() => {
		if (hydrated || !fileUrls) return;
		hydrated = true;
		void (async () => {
			const [l, lc, b, bc] = await Promise.all([
				urlToFileList(fileUrls.logoOriginal, 'logo'),
				urlToFileList(fileUrls.logoCropped, 'logo-cropped.webp'),
				urlToFileList(fileUrls.bannerOriginal, 'banner'),
				urlToFileList(fileUrls.bannerCropped, 'banner-cropped.webp')
			]);
			if (l) $logo = l;
			if (lc) $logoCropped = lc;
			if (b) $banner = b;
			if (bc) $bannerCropped = bc;
		})();
	});

	function slugify(raw: string) {
		return raw.trimStart().replaceAll(' ', '-').toLowerCase();
	}
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="text-primary mb-8 text-3xl font-bold">Informazioni del team</h1>

	<form
		method="POST"
		class="flex flex-col space-y-8"
		enctype="multipart/form-data"
		use:enhance
		action="?/updateTeam"
	>
		<section class="border-base-content space-y-6 border-b pb-8">
			<TextField
				name="name"
				label="Nome completo del team"
				placeholder="Box Rally Italia"
				bind:value={$form.name}
				errors={$errors.name}
				constraints={$constraints.name}
			/>

			<TextField
				name="slug"
				label="Username per il team"
				placeholder="box-rally-italia"
				prefix={teamDomain}
				form="check"
				autocomplete="username"
				bind:value={$form.slug}
				errors={$errors.slug}
				constraints={$constraints.slug}
				transform={slugify}
				debounceMs={200}
				onInput={() => submitCheckUsername()}
				delayed={$delayed}
				hint="L'username sará usato per creare una pagina pubblica per il tuo team. Solo lettere minuscole, numeri e trattini."
			/>
			<input type="hidden" name="slug" value={$form.slug} />

			<ImageField
				name="logo"
				label="Logo del team"
				shape="round"
				bind:original={$logo}
				bind:cropped={$logoCropped}
				bind:cropArea={$form.logoCroppedInfo}
				errors={$errors.logoOriginal ?? $errors.logoCropped}
			/>

			<ImageField
				name="banner"
				label="Immagine di sfondo (banner) per la pagina del team"
				shape="rect"
				bind:original={$banner}
				bind:cropped={$bannerCropped}
				bind:cropArea={$form.bannerCroppedInfo}
				errors={$errors.bannerOriginal ?? $errors.bannerCropped}
			/>
		</section>

		<TextareaField
			name="bio"
			label="Descrizione del team"
			placeholder="Bio"
			rows={4}
			bind:value={$form.bio}
			errors={$errors.bio}
			constraints={$constraints.bio}
		/>

		<button disabled={$delayed || $submitting} type="submit" class="btn btn-primary w-full">
			{#if $submitting}<span class="loading loading-spinner"></span>{/if}
			Aggiorna il team
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
