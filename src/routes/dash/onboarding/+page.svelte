<script lang="ts">
	import CodiceFiscale from 'codice-fiscale-js';

	const { data } = $props();
	const { user } = data;
	const { countryPhoneCodes } = data;

	let name = $state(user.name.split(' ').slice(0, -1).join(' '));
	let surname = $state(user.name.split(' ').slice(-1).join(' '));

	let fiscalCode = $state('');
	let birthDate = $state('');
	let gender = $state('');
	let phone = $state('');
	let prefix = $state('+39');

	let prefixes = $state(countryPhoneCodes);

	let nick = $state('');
	$effect(() => {
		nick = nick.trimStart().replaceAll(' ', '-').toLowerCase();
	});

	$effect(() => {
		console.log('name', name.trim());
		console.log('surname', surname.trim());
	});

	$effect(() => {
		console.log('fiscalCode', fiscalCode);
		try {
			const cf = new CodiceFiscale(fiscalCode.toUpperCase());
			// if (cf.isValid()) {
			birthDate = cf.birthday.toISOString().split('T')[0];
			if (cf.gender === 'M') {
				gender = 'Maschio';
			} else {
				gender = 'Femmina';
			}
			console.log('cf', cf.gender, cf.birthday);
			// } else {
			// 	console.log('cf', 'invalid');
			// }
		} catch (error) {
			console.log('cf', 'invalid');
			// console.error(error);
		}
	});

	let files = $state<FileList | null | undefined>(undefined);

	function clear() {
		files = new DataTransfer().files; // null or undefined does not work
	}

	const userDomain = 'boxrally.eu/u/';

	// document.getElementById('dropdownOptions')?.addEventListener('click', function (event) {
	// 	if (event.target.tagName === 'LI') {
	// 		document.getElementById('dropdownButton')?.textContent = event.target?.textContent;
	// 		document.getElementById('dropdownMenu')?.classList.add('hidden');
	// 	}
	// });

	// document.addEventListener('click', function (event) {
	// 	let isClickInside =
	// 		document.getElementById('dropdownButton')?.contains(event.target) ||
	// 		document.getElementById('dropdownMenu')?.contains(event.target);
	// 	let dropdownMenu = document.getElementById('dropdownMenu');

	// 	if (!isClickInside) {
	// 		dropdownMenu?.classList.add('hidden');
	// 	}
	// });

	
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="mb-8 text-3xl font-bold text-red-600">Completa il tuo profilo</h1>

	<form class="flex flex-col space-y-8" action="">
		<!-- Contact Information Section -->
		<div class="space-y-6 border-b border-gray-200 pb-8">
			<h2 class="text-lg font-semibold text-red-600">Informazioni di Contatto</h2>
			<div class="flex flex-col gap-4 md:flex-row">
				<div class="flex flex-1 flex-col space-y-2">
					<label class="text-sm font-medium text-gray-700" for="Nome">Nome</label>
					<input
						type="text"
						alt="name"
						placeholder="Nome"
						class="rounded-lg border border-gray-300 px-4 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600"
						bind:value={name}
					/>
				</div>
				<div class="flex flex-1 flex-col space-y-2">
					<label class="text-sm font-medium text-gray-700" for="Cognome">Cognome</label>
					<input
						type="text"
						alt="surname"
						placeholder="Cognome"
						class="rounded-lg border border-gray-300 px-4 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600"
						bind:value={surname}
					/>
				</div>
			</div>

			<div class="flex flex-col space-y-2">
				<label for="phoneNumber" class="text-sm font-medium text-gray-700">Telefono</label>
				<div class="flex gap-4" id="phoneNumber">
					<select
						class="mr-2 w-1/3 rounded-lg border border-gray-300 px-4 py-2 pr-2 focus:border-red-600 focus:ring-2 focus:ring-red-600"
						name="prefix"
						id="prefix"
						bind:value={prefix}
					>
						{#each prefixes as prefix}
							<option selected={prefix.default} value={prefix.dial_code}>
								{prefix.emoji}
								{prefix.name} ({prefix.dial_code})
							</option>
						{/each}
					</select>
					<input
						type="text"
						alt="phone"
						placeholder="Numero di telefono"
						class="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600"
						bind:value={phone}
					/>
				</div>
			</div>
		</div>

		<!-- Personal Information Section -->
		<div class="space-y-6 border-b border-gray-200 pb-8">
			<div class="mb-4">
				<h2 class="text-lg font-semibold text-red-600">Informazioni Personali</h2>
				<p class=" text-sm text-gray-600">
					Inserisci il codice fiscale o inserisci a mano le informazioni
				</p>
			</div>
			<div class="flex flex-col space-y-2">
				<label for="fiscalCode" class="text-sm font-medium text-gray-700">Codice Fiscale</label>
				<input
					type="text"
					id="fiscalCode"
					alt="fiscalCode"
					placeholder="Codice Fiscale"
					class="rounded-lg border border-gray-300 px-4 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600"
					bind:value={fiscalCode}

				/>
			</div>

			<div class="flex flex-col space-y-2">
				<label for="gender" class="text-sm font-medium text-gray-700">Genere</label>
				<div class="flex gap-6" id="gender">
					<div class="flex items-center gap-2">
						<input
							type="radio"
							class="h-4 w-4 accent-red-600"
							bind:group={gender}
							id="maschio"
							value="Maschio"
						/>
						<label for="maschio">Maschio</label>
					</div>
					<div class="flex items-center gap-2">
						<input
							type="radio"
							class="h-4 w-4 accent-red-600"
							bind:group={gender}
							id="femmina"
							value="Femmina"
						/>
						<label for="femmina">Femmina</label>
					</div>
					<div class="flex items-center gap-2">
						<input
							type="radio"
							class="h-4 w-4 accent-red-600"
							bind:group={gender}
							id="altro"
							value="Altro"
						/>
						<label for="altro">Altro</label>
					</div>
				</div>
			</div>

			<div class="flex flex-col space-y-2">
				<label class="text-sm font-medium text-gray-700" for="birthDate">Data di Nascita</label>
				<input
					id="birthDate"
					type="date"
					class="rounded-lg border border-gray-300 px-4 py-2 focus:border-red-600 focus:ring-2 focus:ring-red-600"
					bind:value={birthDate}
				/>
			</div>
		</div>

		<!-- Social Information Section -->
		<div class="space-y-6">
			<h2 class="text-lg font-semibold text-red-600">Informazioni Sociali</h2>

			<div class="mt-2">
				<div class="mt-10">
					<div class="sm:col-span-4">
						<label for="username" class="block text-sm/6 font-medium text-gray-900">Username</label>
						<div class="mt-2">
							<div
								class="flex items-center rounded-lg border bg-white pl-3 outline-gray-300 focus-within:border-red-600 focus-within:ring-1 focus-within:ring-red-600"
							>
								<div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
									{userDomain}
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
						<p class="mb-2 text-xs/5 text-gray-600">
							Il nickname sará usato per creare il tuo URL personalizzato con la quale potrai
							condividere il profilo.
						</p>
					</div>
				</div>
				<!-- <div
					class="flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600 focus:border-red-600 focus:ring-2 focus:ring-red-600"
				>
					<div class="shrink-0 text-base text-gray-500 select-none sm:text-sm/6">
						www.boxrally.eu/u/
					</div>
					<input type="text" placeholder="Nickname" class="" bind:value={nick} />
					
				</div> -->
			</div>
		</div>

		<!-- Submit Button -->
		<button
			type="submit"
			class="mt-8 w-full rounded-lg bg-red-600 py-3 font-medium text-white transition-colors hover:bg-red-700 focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:outline-none"
		>
			Completa registrazione
		</button>
	</form>
</main>

<style></style>
