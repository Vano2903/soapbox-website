<script lang="ts">
	import type { TypedPocketBase } from '$types/pocketbase.js';
	import PocketBase, { type RecordModel } from 'pocketbase';

	const { data } = $props();

	const pb = new PocketBase(data.pbUri) as TypedPocketBase;

	let error = $state('');
	let success = $state(false);

	async function forgotPasswordRequest() {
		console.log('Sign in with email');
		const email = (document.getElementById('email') as HTMLInputElement)?.value;
		console.log('email:', email);
		if (!email) {
			return;
		}

		try {
			const ret = await pb.collection('users').requestPasswordReset(email);
			console.log('ret:', ret);
			error = '';
			success = true;
		} catch (err) {
			console.error(err);
			if (err instanceof Error) {
				error = err.message;
			} else if (typeof err === 'string') {
				error = err;
			} else {
				error = 'Unknown error';
			}
			return;
		}
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="text-content text-center text-2xl/9 font-bold tracking-tight lg:mt-6">
			Richiedi il reset della tua password
		</h2>
		<p class="text-content text-content mt-2 text-sm/6">
			Se non ricordi più la tua password puoi richiedere il reset della password inserendo la mail
			dell'account
		</p>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" action="#" method="POST">
			<fieldset class="fieldset">
				<legend class="fieldset-legend">Indirizzo Mail</legend>
				<input
					type="email"
					autocomplete="email"
					required
					id="email"
					class="input w-full"
					placeholder="mario.rossi@gmail.com"
				/>
				<!-- <p class="fieldset-label">L'indirizzo email dell'account da recuperare</p> -->
			</fieldset>

			<div>
				<button
					aria-label="Accedi"
					type="button"
					onclick={forgotPasswordRequest}
					class="btn btn-primary w-full">Reset</button
				>
			</div>
		</form>

		{#if success}
			<div role="alert" class="alert alert-success mt-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span
					>Ti abbiamo mandato una mail con le istruzioni per resettare la password. Controlla nella
					tua casella di posta elettronica.
					<br />
					puoi tornare al <a href="/login" class="link">login</a>
				</span>
			</div>
		{/if}

		{#if error}
			<div role="alert" class="alert alert-error mt-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 shrink-0 stroke-current"
					fill="none"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
				<span>{error}</span>
			</div>
		{/if}

		<p class="text-content mt-10 text-center text-sm/6">
			Non hai bisogno di resettare la password?
			<a href="/login" class="link link-accent">Torna al login</a>
		</p>
	</div>
</div>

<style>
</style>
