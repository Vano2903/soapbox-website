<script lang="ts">
	import { page } from '$app/stores';
	import type { TypedPocketBase } from '$tsTypes/pocketbase.js';
	import PocketBase, { type RecordModel } from 'pocketbase';
	import { schema } from './schema.js';
	import { zod } from 'sveltekit-superforms/adapters';
	import { superForm } from 'sveltekit-superforms';

	const { data } = $props();

	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		validators: zod(schema)
	});

	const pb = new PocketBase(data.pbUri) as TypedPocketBase;
	let error = $state('');

	// async function signInWithEmail() {
	// 	console.log('Sign in with email');
	// 	const email = (document.getElementById('email') as HTMLInputElement)?.value;
	// 	if (!email) {
	// 		error = "L'indirizzo email è obbligatorio";
	// 		return;
	// 	}
	// 	const password = (document.getElementById('password') as HTMLInputElement)?.value;
	// 	if (!password) {
	// 		error = 'La password è obbligatoria';
	// 		return;
	// 	}
	// 	console.log('email:', email);
	// 	console.log('password:', password);

	// 	try {
	// 		const user = await pb.collection('users').authWithPassword(email, password);
	// 		if (pb.authStore.isValid) {
	// 			console.log('User is logged in');
	// 			document.cookie = pb.authStore.exportToCookie({
	// 				httpOnly: false,
	// 				secure: true
	// 				// sameSite: 'strict'
	// 			});
	// 			document.location.href = '/dash';
	// 			console.log('going to /dash');
	// 		}
	// 	} catch (err) {
	// 		console.error(err);
	// 		if (err instanceof Error) {
	// 			error = err.message;
	// 		} else if (typeof err === 'string') {
	// 			error = err;
	// 		} else {
	// 			error = 'Errore sconosciuto';
	// 		}
	// 		return;
	// 	}
	// }

	$effect(() => {
		console.log('form', $form);
		console.log('errors', $errors);
		console.log('message', $message);
	});

	async function singInWithGoogle() {
		console.log('Sign in with Google');
		try {
			const user = await pb.collection('users').authWithOAuth2({
				provider: 'google',
				createData: {
					visibility: 'public',
					roles: ['user'],
					settings: {
						theme: 'system',
						units: 'metric'
					}
				}
			});
			if (pb.authStore.isValid) {
				console.log('User is logged in');
				document.cookie = pb.authStore.exportToCookie({
					httpOnly: false,
					secure: true
					// sameSite: 'strict'
				});
				document.location.href = '/dash';
			}
		} catch (err) {
			console.error(err);
			return;
		}
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="text-content text-center text-2xl/9 font-bold tracking-tight lg:mt-6">
			Accedi al tuo account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		{#if data.authMethods?.password.enabled}
			<form class="space-y-6" action="?/login" method="POST" use:enhance>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Indirizzo Mail</legend>
					<input
						type="email"
						id="email"
						name="email"
						autocomplete="email"
						required
						class="input w-full"
						placeholder="mario.rossi@gmail.com"
						{...$constraints.email}
						class:input-error={$errors.email}
						class:input-success={$form.email && 'email' in $errors && !$errors.email}
						aria-invalid={$errors.email ? 'true' : undefined}
						bind:value={$form.email}
					/>
					{#if $errors.email}
						<p class="fieldset-label text-error">{$errors.email}</p>
					{/if}
				</fieldset>

				<fieldset class="fieldset">
					<div class="flex items-center justify-between">
						<legend class="fieldset-legend">Password</legend>
						<a href="/forgot-password" class="link link-hover link-accent"
							>Hai dimenticato la password?</a
						>
					</div>
					<input
						autocomplete="current-password"
						type="password"
						required
						name="password"
						class="input w-full"
						placeholder=""
						id="password"
						{...$constraints.password}
						class:input-error={$errors.password}
						class:input-success={$form.password && 'password' in $errors && !$errors.password}
						aria-invalid={$errors.password ? 'true' : undefined}
						bind:value={$form.password}
					/>
					{#if $errors.password}
						{#if $errors.password.length == 1}
							<p class="fieldset-label text-error">{$errors.password}</p>
						{:else}
							<ul>
								{#each $errors.password as error}
									<li class="fieldset-label text-error">{error}</li>
								{/each}
							</ul>
						{/if}
					{/if}
				</fieldset>

				<div>
					<button aria-label="Accedi" type="submit" class="btn btn-primary w-full">Accedi</button>
				</div>
			</form>
			{#if $message}
				{#if $page.status >= 400}
					<div class="alert alert-error alert-soft mt-4">
						{@html $message}
					</div>
				{:else}
					{(window.location.href = '/dash')}
				{/if}
			{/if}
		{/if}

		{#if data.authMethods?.oauth2.enabled && data.authMethods?.oauth2.providers.length > 0 && data.authMethods?.password.enabled}
			<hr class="mt-6 border-gray-300" />
		{/if}

		{#if data.authMethods?.oauth2.enabled && data.authMethods?.oauth2.providers.length > 0}
			<div class="mt-6 flex w-full justify-center">
				<button
					onclick={singInWithGoogle}
					aria-label="Login with Google"
					type="button"
					class="btn focus-visible:outline-primary bg-white text-black transition hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2"
				>
					<svg
						class="size-6"
						xmlns="http://www.w3.org/2000/svg"
						x="0px"
						y="0px"
						width="100"
						height="100"
						viewBox="0 0 48 48"
					>
						<path
							fill="#FFC107"
							d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
						></path><path
							fill="#FF3D00"
							d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
						></path><path
							fill="#4CAF50"
							d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
						></path><path
							fill="#1976D2"
							d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
						></path>
					</svg>
					<p class="text-lg">Google</p>
				</button>
			</div>
		{/if}

		<!-- {#if error} -->
		<!-- <p class="mt-6 text-center text-sm/6 text-red-600">Credenziali non valide</p> -->
		<!-- {/if} -->

		<p class="text-content mt-10 text-center text-sm/6">
			Non hai un account pilota?
			<a href="/register" class="link link-accent">Creane uno ora</a>
		</p>
	</div>
</div>

<style>
</style>
