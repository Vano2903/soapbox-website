<script lang="ts">
	import { page } from '$app/state';
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import type { TypedPocketBase } from '$lib/types/pocketbase.js';
	import type { Team, TeamInvitationNonExpand } from '$lib/types/team.js';
	import type { UserNonExpand } from '$lib/types/user.js';
	import { Crown, Users } from 'lucide-svelte';
	import PocketBase, { ClientResponseError, type RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';

	interface Props {
		data: {
			user: UserNonExpand;
			pbUri: string;
			team: Team;
			members: UserNonExpand[];
			error: {
				kind: 'teams' | 'members' | 'other';
				message: string;
			} | null;
			isCurrentUser: boolean;
			isCurrentOwner: boolean;
			isCurrentMember: boolean;
			slug: string;
			invites?: TeamInvitationNonExpand[];
		};
	}

	const { data }: Props = $props();
	const pb = new PocketBase(data.pbUri) as TypedPocketBase;
	// const teamsCount = data.teamsCount;
	// onMount(async () => {
	// 	console.log('teams', teams);
	// });

	// 	console.log('subscribed to teams');
	// 	pb.collection('teams').subscribe('*', (e) => {
	// 		console.log('Team event:', e);
	// 	});
	// });
	let user = $state(data.user);
	let team = $state(data.team);
	let members = $state(data.members);
	let isCurrentOwner = $state(data.isCurrentOwner);
	let isCurrentMember = $state(data.isCurrentMember);
	let error = $state(data.error);
	let invites = $state(data.invites);

	let tabs = [
		{ anchor: 'news', label: 'NOTIZIE' },
		{ anchor: 'members', label: 'MEMBRI' }
	];
	if (isCurrentOwner) {
		tabs.push({ anchor: 'invites', label: 'INVITI' });
	}

	let defaultTab = tabs[2].anchor;

	let currentTab = $state(defaultTab); // Default to 'members'

	async function leaveTeam() {
		if (confirm('Sei sicuro di voler abbandonare il team?')) {
			try {
				await pb.collection('teams').update(team.id, { members: [] });
				members = [];
				isCurrentMember = false;
				alert('Hai abbandonato il team con successo.');
			} catch (err) {
				console.error('Error leaving team:', err);
				alert("Si è verificato un errore durante l'abbandono del team.");
			}
		}
	}

	function datediff(first: number, second: number): number {
		return Math.round((second - first) / (1000 * 60 * 60 * 24));
	}

	let newInviteModal = $state(false);
	let inviteCode = $state<string>('');
	// let baseUrl = `${window.location.origin}/team/${team.slug}/dash/invite/`;
	let baseUrl = 'localhost:5173/join/';

	let inviteError = $state<string | null>(null);

	let creatingInvite = $state(false);
	async function createInvite() {
		try {
			creatingInvite = true;
			const pb = new PocketBase(data.pbUri) as TypedPocketBase;

			console.log('Creating invite with code:', inviteCode);
			if (!inviteCode || inviteCode.length < 3 || inviteCode.length > 16) {
				inviteError = 'Il codice invito deve essere tra 3 e 16 caratteri.';
				creatingInvite = false;
				return;
			}

			let existingInvite;
			try {
				existingInvite = await pb
					.collection('teamInvitations')
					.getFirstListItem(`code="${inviteCode}"`);
			} catch (err) {
				if (err instanceof ClientResponseError && err.status === 404) {
					existingInvite = null; // No existing invite found
				} else {
					throw err; // Rethrow other errors
				}
			}
			if (existingInvite) {
				inviteError = 'Un invito con questo codice esiste già.';
				creatingInvite = false;
				return;
			}
			console.log('Invite code is valid:', inviteCode);

			let uses = -1;
			const maxUsesInput = document.getElementById('max-uses') as HTMLInputElement;
			if (maxUsesInput && maxUsesInput.value) {
				uses = parseInt(maxUsesInput.value, 10);
				if (isNaN(uses) || uses < 1) {
					inviteError = 'Il numero di utilizzi deve essere un numero positivo.';
					creatingInvite = false;
					return;
				}
			}

			const expirationInput = document.getElementById('invite-expiration') as HTMLInputElement;
			let expiration: Date | null = null;
			if (expirationInput && expirationInput.value) {
				expiration = new Date(expirationInput.value);
				if (isNaN(expiration.getTime())) {
					inviteError = 'La data di scadenza non è valida.';
					creatingInvite = false;
					return;
				}
				if (expiration < new Date()) {
					inviteError = 'La data di scadenza non può essere nel passato.';
					creatingInvite = false;
					return;
				}
			}

			let disabled = false;
			const disabledCheckbox = document.querySelector('.toggle-error') as HTMLInputElement;
			if (disabledCheckbox && disabledCheckbox.checked) {
				disabled = true;
			}

			console.log('Invite settings:', {
				code: inviteCode,
				uses,
				expiration,
				disabled
			});
			try {
				const invite = await pb.collection('teamInvitations').create({
					code: inviteCode,
					team: team.id,
					uses: uses, // Set the number of uses or leave it as -1 for unlimited
					expiration: expiration ? expiration.toISOString() : null, // Set expiration date if needed
					disabled: disabled // Set to true if you want to disable the invite
				});
			} catch (err) {
				console.error("Errore durante la creazione dell'invito:", err);
				inviteError = "Si è verificato un errore durante la creazione dell'invito.";
				creatingInvite = false;
				return;
			}
			creatingInvite = false;
			inviteError = null;
			(document.getElementById('invite_modal') as HTMLDialogElement)?.close();
		} catch (err) {
			console.error("Errore durante la creazione dell'invito:", err);
			inviteError = "Si è verificato un errore durante la creazione dell'invito.";
			creatingInvite = false;
			return;
		}
	}

	function copyInviteLink(inviteCode: string) {
		const link = `${baseUrl}${inviteCode}`;
		navigator.clipboard
			.writeText(link)
			.then(() => {
				alert('Link copiato negli appunti!');
			})
			.catch((err) => {
				console.error('Errore durante la copia:', err);
				alert('Errore durante la copia del link');
			});
	}

	function toggleInviteDisabled(inviteCode: string, isDisabled: boolean) {
		alert(`disabled ${isDisabled}`);
		// Here you can add the actual API call to update the invite
		// Example:
		// await pb.collection('teamInvitations').update(inviteId, { disabled: isDisabled });
	}

	async function disableInvite(inviteCode: string) {
		// Keep your existing disableInvite function or rename it to deleteInvite
	}
</script>

<div class="px-6 py-2">
	<div class=" flex h-full w-full flex-col-reverse lg:flex-row">
		<div class="w-full lg:max-w-1/2">
			<div>
				<div class="h-2xl line-clamp-3 w-full">
					{#if team.bannerCropped}
						<img src={team.bannerCropped} alt="banner" class="h-full w-full object-fill" />
					{:else}
						<div class="h-48 w-full bg-blue-400"></div>
					{/if}
				</div>

				<div class="flex w-full items-center justify-center space-x-5 pb-8">
					<div class="mt-[-4rem] mb-4 size-24 rounded-full bg-gray-200 md:size-32 lg:mt-[-6rem]">
						<div class="avatar">
							<div class="size-24 rounded-full ring-1 ring-black md:size-32">
								<img src={team.logoCropped} alt="Team Logo" />
							</div>
						</div>
					</div>
				</div>
				<div class="mt-[-2rem]">
					<h2 class="text-xl font-bold md:text-2xl lg:text-4xl">{team.name}</h2>
					<a
						href={'/team/' + team.slug}
						target="_blank"
						class="text-normal ml-2 font-semibold text-red-600 md:text-lg lg:text-2xl"
					>
						@{team.slug}
					</a>
				</div>

				<div class="mt-4 w-full">
					<p class="text-normal text-gray-600 md:text-lg">{team.description}</p>
				</div>
			</div>
			<div class="divider"></div>
			{#if isCurrentOwner}
				<a class="btn my-4 w-full bg-gray-100" href="./settings">Modifica Profilo</a>
			{/if}
		</div>

		<div class="divider lg:divider-horizontal"></div>

		<div class="w-full">
			<div role="tablist" class="tabs tabs-border flex w-full justify-center">
				{#each tabs as tab}
					<button
						role="tab"
						class="tab text-3xl transition-all"
						class:tab-active={currentTab === tab.anchor}
						class:text-red-600={currentTab === tab.anchor}
						class:hover:text-red-800={currentTab === tab.anchor}
						onclick={() => (currentTab = tab.anchor)}
					>
						{tab.label}
					</button>
				{/each}
			</div>
			<div>
				<div class="mt-4 flex w-full flex-col items-start justify-between">
					{#if currentTab === 'news'}
						<div class="w-full space-y-4">
							<p class="text-3xl font-bold">NOTIZIE:</p>
							<p class="text-lg">Non ci sono notizie al momento. francone</p>
						</div>
					{:else if currentTab === 'members'}
						<div class="w-full space-y-4">
							<p class=" text-3xl font-bold">MEMBRI:</p>
							{#if members.length == 0}
								<p class="mt-4 text-lg font-semibold">Non ci sono persone in questo team</p>
							{/if}

							<div class="flex w-full justify-end">
								<button class="btn btn-error" onclick={leaveTeam}>Abbandona Team</button>
							</div>

							<div class="w-full space-y-1">
								{#each members as member}
									<EntityCard
										title={member.name + ' ' + member.lastName}
										slug={member.nick}
										link={'/user/' + member.nick}
										description={member.bio}
									>
										{#snippet picture()}
											<img
												src={member.avatarCropped}
												alt={member.name}
												class="h-12 w-12 rounded-full"
											/>
										{/snippet}
										{#snippet iconSnippet()}
											{#if team.owner == member.person}
												<Crown class="size-4 text-yellow-500" />
											{/if}
										{/snippet}
									</EntityCard>
								{/each}
							</div>
						</div>
					{:else if currentTab === 'invites'}
						<p class="mt-4 w-full text-3xl font-bold">INVITI:</p>

						<div class="flex w-full justify-end">
							<button
								class=" btn btn-primary"
								onclick={() =>
									(document.getElementById('invite_modal') as HTMLDialogElement)?.showModal()}
							>
								Crea Nuovo Invito
							</button>
						</div>

						<dialog id="invite_modal" class="modal modal-bottom sm:modal-middle">
							<div class="modal-box">
								<!-- <form method="dialog">
									<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
								</form> -->
								<h3 class="text-lg font-bold">Crea Nuovo Invito</h3>
								<p class="py-4">Configura le impostazioni per il nuovo invito al team.</p>

								<!-- Your invite form content here -->
								<div class="form-control space-y-2">
									<!-- <label class="input w-full">
										<span class="label">{baseUrl}</span>
										<input type="text" placeholder="codice-invito" />
									</label> -->

									<fieldset class="fieldset">
										<legend class="fieldset-legend">Codice Invito</legend>
										<label class="input validator w-full">
											<span class="label">{baseUrl}</span>
											<!-- <input type="text" placeholder="codice-invito" /> -->
											<input
												min="3"
												max="16"
												type="text"
												class=""
												placeholder="codice-invito"
												bind:value={inviteCode}
											/>
										</label>
										<p class="label">
											Questo é un codice univoco che permetterá l'accesso al team.<br />
											Se non lo inserisci, verrá generato un codice casuale.
										</p>
									</fieldset>

									<!-- <div tabindex="0" class="collapse-plus bg-base-100 border-base-300 collapse border">
									<div class="collapse-title font-semibold">How do I create an account?</div>
									<div class="collapse-content text-sm">
										Click the "Sign Up" button in the top right corner and follow the registration
										process.
									</div>
								</div> -->

									<div class="bg-base-100 border-base-300 collapse-plus collapse mt-4 border">
										<input type="checkbox" />
										<div class="collapse-title">Impostazioni Avanzate</div>
										<div class="collapse-content text-sm">
											<fieldset class="fieldset">
												<legend class="fieldset-legend">Numero di Utilizzi</legend>
												<input id="max-uses" type="number" class="input input-bordered w-full" />
												<p class="label">Quante persone potranno utilizzare questo invito.</p>
											</fieldset>

											<fieldset class="fieldset">
												<legend class="fieldset-legend">Data di Scadenza</legend>
												<input
													id="invite-expiration"
													type="datetime-local"
													class="input input-bordered w-full"
												/>
												<p class="label">Durata dell'invito</p>
											</fieldset>

											<fieldset class="fieldset">
												<legend class="fieldset-legend">Disabilitato</legend>
												<label class="label">
													<input type="checkbox" class="toggle toggle-error" />
													Disabilita questo invito
												</label>
												<p class="label text-wrap">
													Altre persone non potranno accedere al team quando l'invito è
													disabilitato. Puoi riabilitarlo in seguito.
												</p>
											</fieldset>
										</div>
									</div>
								</div>
								{#if inviteError}
									<p class="text-error mt-2">{inviteError}</p>
								{/if}
								<div class="modal-action">
									<form method="dialog">
										<button class="btn">Annulla</button>
									</form>
									<button class="btn btn-primary" onclick={createInvite} disabled={creatingInvite}>
										{#if creatingInvite}
											<span class="loading loading-spinner loading-sm"></span>
										{/if}
										Crea Invito
									</button>
								</div>

								<!-- <button class="btn btn-primary" onclick={createInvite}>Crea Invito</button> -->
							</div>
							<!-- This form closes the modal when clicked outside -->
							<form method="dialog" class="modal-backdrop">
								<button>close</button>
							</form>
						</dialog>

						{#if invites && invites.length > 0}
							<div class="mt-4 w-full space-y-4">
								{#each invites as invite}
									{@const joinedCount = invite.joined.length}
									{@const maxUses = invite.uses + joinedCount}
									{@const isDisabled =
										invite.disabled ||
										(invite.expiration && new Date(invite.expiration) < new Date()) ||
										(invite.uses !== -1 && invite.uses <= 0)}
									{@const daysRemaining = invite.expiration
										? datediff(new Date().valueOf(), invite.expiration.valueOf())
										: null}

									<div
										class="collapse-arrow w collapse rounded-lg bg-gray-200 {isDisabled
											? 'opacity-60'
											: ''}"
									>
										<input type="checkbox" class="peer" />
										<div class="collapse-title flex items-center justify-between">
											<div class="flex items-center space-x-4">
												<div class="flex items-center">
													<Users />
													<span class="ml-2 font-mono text-lg font-bold">{invite.code}</span>
												</div>
											</div>

											<div class="flex items-center space-x-4">
												<button
													class="btn btn-sm btn-outline"
													onclick={() => copyInviteLink(invite.code)}
												>
													Copia Link
												</button>

												{#if isDisabled}
													<span class="badge badge-error">Non attivo</span>
												{:else}
													<span class="badge badge-success">Attivo</span>
												{/if}
											</div>
										</div>

										<div class="collapse-content">
											<div class="space-y-4">
												<!-- Invite Information -->
												<div class="rounded-lg bg-gray-100 p-4">
													<h4 class="mb-2 font-semibold">Informazioni Invito</h4>

													<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
														<!-- Uses Count -->
														<div>
															<div class="label">
																<span class="label-text font-medium">Utilizzi</span>
															</div>
															{#if invite.uses === -1}
																<p class="text-sm">Illimitato ({joinedCount} partecipanti)</p>
															{:else}
																<p class="text-sm">{joinedCount}/{maxUses} partecipanti</p>
															{/if}
														</div>

														<!-- Expiration -->
														<div>
															<div class="label">
																<span class="label-text font-medium">Scadenza</span>
															</div>
															{#if invite.expiration}
																<p class="text-sm">
																	{new Date(invite.expiration).toLocaleDateString('it-IT')}
																	{#if daysRemaining && daysRemaining > 0}
																		<span class="text-success"
																			>({daysRemaining} giorni rimanenti)</span
																		>
																	{:else}
																		<span class="text-error">(Scaduto)</span>
																	{/if}
																</p>
															{:else}
																<p class="text-sm text-gray-500">Nessuna scadenza</p>
															{/if}
														</div>
													</div>

													<!-- Disabled Toggle -->
													<div class="mt-4">
														<label class="label cursor-pointer justify-start space-x-3">
															<span class="label-text font-medium">Disabilitato</span>
															<input
																type="checkbox"
																class="toggle toggle-error"
																checked={invite.disabled}
																onchange={(e) =>
																	toggleInviteDisabled(invite.code, e.target.checked)}
															/>
														</label>
													</div>

													<!-- People who joined -->
													<div class="mt-4">
														<p class="text-sm">
															Persone che hanno usato questo invito: {joinedCount} persone
														</p>
													</div>
												</div>

												<!-- Action Buttons -->
												<div class="flex justify-end space-x-2">
													<button
														class="btn btn-sm btn-outline"
														onclick={() =>
															(window.location.href = `/team/${team.slug}/dash/invite/${invite.code}/edit`)}
													>
														Modifica
													</button>

													<button
														class="btn btn-sm btn-error"
														onclick={() => disableInvite(invite.code)}
													>
														Elimina
													</button>
												</div>
											</div>
										</div>
									</div>
								{/each}
							</div>
						{:else}
							<div class="py-6 text-center">
								<p class="text-lg text-gray-600">Non hai ancora creato nessun invito.</p>
							</div>
						{/if}
					{/if}
				</div>
			</div>
		</div>
	</div>
</div>
