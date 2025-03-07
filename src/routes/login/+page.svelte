<script lang="ts">
	import { goto } from '$app/navigation';
	import type { TypedPocketBase } from '$tsTypes/pocketbase.js';
	import PocketBase, { type RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	const { data } = $props();

	const pb = new PocketBase(data.pbUri) as TypedPocketBase;
	let error = $state(false);

	async function auth() {
		// const pb = new PocketBase(data.pbUri);
		// try {
		// 	const authData = await pb.collection('users').authWithOAuth2({
		// 		provider: 'google'
		// 	});
		// 	pb.authStore.save(authData!.token, authData!.record);
		// 	document.cookie = pb.authStore.exportToCookie({
		// 		httpOnly: false,
		// 		secure: true,
		// 		sameSite: 'strict'
		// 	});
		// 	window.location.href = '/cogestione';
		// } catch {
		// 	error = true;
		// }
	}

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
			// console.error(err);
			if (pb.authStore.isValid) {
				console.log('User is logged in');
				document.cookie = pb.authStore.exportToCookie({
					httpOnly: false,
					secure: true
					// sameSite: 'strict'
				});
				// goto('/dash');
				document.location.href = '/dash';
				console.log('going to /dash');
				// pb.router.push('/u/' + pb.authStore.user.username);
			}
		} catch (err) {
			console.error(err);
			return;
		}
	}
</script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<h2 class="text-center text-2xl/9 font-bold tracking-tight text-gray-900 lg:mt-6">
			Accedi al tuo account
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		{#if data.authMethods?.password.enabled}
			<form class="space-y-6" action="#" method="POST">
				<div>
					<label for="email" class="block text-sm/6 font-medium text-gray-900">Indirizzo Mail</label
					>
					<div class="mt-2">
						<input
							type="email"
							name="email"
							id="email"
							autocomplete="email"
							required
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<div class="flex items-center justify-between">
						<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
						<div class="text-sm">
							<a href="#" class="font-semibold text-red-600 hover:text-red-500 hover:underline"
								>Hai dimenticato la password?</a
							>
						</div>
					</div>
					<div class="mt-2">
						<input
							type="password"
							name="password"
							id="password"
							autocomplete="current-password"
							required
							class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-gray-600 sm:text-sm/6"
						/>
					</div>
				</div>

				<div>
					<button
						aria-label="Accedi"
						type="submit"
						class="flex w-full cursor-pointer justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs transition hover:scale-x-101 hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
						>Accedi</button
					>
				</div>
			</form>
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
					class="flex cursor-pointer items-center gap-x-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm/6 font-semibold text-gray-900 shadow-xs transition hover:scale-x-101 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
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

		<p class="mt-10 text-center text-sm/6 text-gray-700">
			Non hai un account pilota?
			<a href="/register" class="font-semibold text-red-600 hover:text-red-500 hover:underline"
				>Creane uno ora</a
			>
		</p>
	</div>
</div>

<style>
</style>
