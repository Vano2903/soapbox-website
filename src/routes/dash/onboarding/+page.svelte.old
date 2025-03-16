<script lang="ts">
	// import Form from './Form.svelte';
	import ProgressBar from '$lib/components/ui/stepper/Stepper.svelte';
	let steps = ['Personali', 'Cosmetiche', 'Verifica'];
	let currentActive = $state(1);
	let progressBar = $state();

	const handleProgress = (stepIncrement: number) => {
		// progressBar.handleProgress(stepIncrement);
	};

	let active_step = $derived(steps[currentActive - 1]);
</script>

<main>
	<h1 class="mb-8 text-3xl">
		Hey sei quasi pronto per diventare un pilota, <span class="font-bold"
			>inserisci i seguenti dati</span
		>:
	</h1>
	<div class="height-full flex items-center justify-center overflow-hidden">
		<ProgressBar {steps} bind:currentActive bind:this={progressBar} />

		{#if active_step == 'Info'}
			<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
				<div class="sm:col-span-4">
					<label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
					<div class="mt-2">
						<div
							class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
						>
							<div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
								www.boxrally.eu/u/
							</div>
							<input
								type="text"
								name="username"
								id="username"
								class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
								placeholder="janesmith"
							/>
						</div>
					</div>
				</div>
			</div>
			<!-- <InputField label={'Name'} bind:value={formData.name} />
			<InputField label={'Surname'} bind:value={formData.surname} />
			<InputField label={'Email'} bind:value={formData.email} />
			<InputField type={'password'} label={'Password'} bind:value={formData.password} /> -->
		{:else if active_step == 'Address'}
			<!-- <InputField label={'Address'} bind:value={formData.address} />
			<InputField label={'City'} bind:value={formData.city} />
			<InputField label={'Country'} bind:value={formData.country} />
			<InputField label={'Postcode'} bind:value={formData.postcode} /> -->
		{:else if active_step == 'Payment'}
			<!-- <InputField label={'Account Name'} bind:value={formData.account_name} />
			<InputField label={'Card No'} bind:value={formData.card_no} /> -->
		{:else if active_step == 'Confirmation'}
			<div class="message">
				<h2>Thank you for choosing us</h2>
				<button class="btn submit">Finish </button>
			</div>
		{/if}

		<div class="step-button">
			<button class="btn" onclick={() => handleProgress(-1)} disabled={currentActive == 1}
				>Prev</button
			>
			<button
				class="btn"
				onclick={() => handleProgress(+1)}
				disabled={currentActive == steps.length}>Next</button
			>
		</div>
	</div>
</main>

<!-- 
<main>
	<ol class="w-72 space-y-4">
		<li>
			<div
				class="w-full rounded-lg border border-green-300 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-gray-800 dark:text-green-400"
				role="alert"
			>
				<div class="flex items-center justify-between">
					<span class="sr-only">User info</span>
					<h3 class="font-medium">1. User info</h3>
					<svg
						class="h-4 w-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 16 12"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5.917 5.724 10.5 15 1.5"
						/>
					</svg>
				</div>
			</div>
		</li>
		<li>
			<div
				class="w-full rounded-lg border border-green-300 bg-green-50 p-4 text-green-700 dark:border-green-800 dark:bg-gray-800 dark:text-green-400"
				role="alert"
			>
				<div class="flex items-center justify-between">
					<span class="sr-only">Account info</span>
					<h3 class="font-medium">2. Account info</h3>
					<svg
						class="h-4 w-4"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 16 12"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5.917 5.724 10.5 15 1.5"
						/>
					</svg>
				</div>
			</div>
		</li>
		<li>
			<div
				class="w-full rounded-lg border border-blue-300 bg-blue-100 p-4 text-blue-700 dark:border-blue-800 dark:bg-gray-800 dark:text-blue-400"
				role="alert"
			>
				<div class="flex items-center justify-between">
					<span class="sr-only">Social accounts</span>
					<h3 class="font-medium">3. Social accounts</h3>
					<svg
						class="h-4 w-4 rtl:rotate-180"
						aria-hidden="true"
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 14 10"
					>
						<path
							stroke="currentColor"
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M1 5h12m0 0L9 1m4 4L9 9"
						/>
					</svg>
				</div>
			</div>
		</li>
		<li>
			<div
				class="w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
				role="alert"
			>
				<div class="flex items-center justify-between">
					<span class="sr-only">Review</span>
					<h3 class="font-medium">4. Review</h3>
				</div>
			</div>
		</li>
		<li>
			<div
				class="w-full rounded-lg border border-gray-300 bg-gray-100 p-4 text-gray-900 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
				role="alert"
			>
				<div class="flex items-center justify-between">
					<span class="sr-only">Confirmation</span>
					<h3 class="font-medium">5. Confirmation</h3>
				</div>
			</div>
		</li>
	</ol>

	<hr />

	Ciao, Sei quasi pronto ad essere un Pilota, inseriti il tuo username

	<div class="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
		<div class="sm:col-span-4">
			<label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
			<div class="mt-2">
				<div
					class="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600"
				>
					<div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
						workcation.com/
					</div>
					<input
						type="text"
						name="username"
						id="username"
						class="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
						placeholder="janesmith"
					/>
				</div>
			</div>
		</div>
	</div>
</main> -->

<style>
	.btn {
		background-color: #3498db;
		color: #fff;
		border: 0;
		border-radius: 6px;
		cursor: pointer;
		font-family: inherit;
		padding: 8px 30px;
		margin: 5px;
		font-size: 14px;
	}

	.btn:active {
		transform: scale(0.98);
	}

	.btn:focus {
		outline: 0;
	}

	.btn:disabled {
		background-color: #e0e0e0;
		cursor: not-allowed;
	}

	.step-button {
		margin-top: 1rem;
		text-align: center;
	}
</style>
