<script lang="ts">
	import { page } from '$app/state';
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import type { TypedPocketBase } from '$types/pocketbase/pocketbase.js';
	import type { Team, TeamInvitationNonExpand, TeamNonexpand } from '$types/pocketbase/team.js';
	import type { UserNonExpand } from '$types/pocketbase/user.js';
	import { Crown, Users, UserX } from 'lucide-svelte';
	import PocketBase, { ClientResponseError, type RecordModel } from 'pocketbase';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import ClipboardButton from '$components/clipboardButton/clipboardButton.svelte';
	import ContextualHelp from '$components/contextualHelp/contextualHelp.svelte';
	import type { ContextualHelps as ContextualHelpsType } from '$types/documentation';

	interface Props {
		data: {
			user: UserNonExpand;
			pb: TypedPocketBase;
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
			contextualHelps: ContextualHelpsType;
		};
	}

	const { data }: Props = $props();
	// const pb = new PocketBase(data.pbUri) as TypedPocketBase;
	const pb = data.pb;
	const contextualHelps = $derived(data.contextualHelps);
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

	let defaultTab = tabs[1].anchor;

	let currentTab = $state(defaultTab); // Default to 'members'

	function datediff(date1: Date, date2: Date): number {
		console.log('Calculating date difference:', date1, date2);
		const diffTime = Math.abs(date2 - date1);
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		return diffDays;
	}

	let newInviteModal = $state(false);
	let isAdvancedSettingShowing = $state(false);
	let newInviteCode = $state<string>('');
	let newInviteMaxUses = $state<number | null>(null);
	let newInviteExpirationDate = $state<string | null>(null);
	let newInviteDisabled = $state<boolean>(false);
	// let baseUrl = `${window.location.origin}/team/${team.slug}/dash/invite/`;
	let baseUrl = env.PUBLIC_BASE_URL + '/join/';

	let inviteError = $state<string | null>(null);

	let modifyingInvite = $state(false);
	let creatingInvite = $state(false);

	function resetModal() {
		console.log('Resetting invite modal state');
		newInviteCode = '';
		newInviteMaxUses = null;
		newInviteExpirationDate = null;
		newInviteDisabled = false;
		inviteError = null;
		modifyingInvite = false;
		creatingInvite = false;
		isAdvancedSettingShowing = false;
	}

	function showModalToModifyInvite(inviteCode: string) {
		modifyingInvite = true;
		inviteCode = inviteCode;
		let invite = invites?.find((i) => i.code === inviteCode);
		if (!invite) {
			console.error('Invite not found:', inviteCode);
			return;
		}
		newInviteCode = invite.code;
		newInviteMaxUses = invite.uses !== -1 ? invite.uses : null; // Use -1 for unlimited
		newInviteExpirationDate = invite.expiration
			? new Date(invite.expiration).toISOString().split('T')[0]
			: null;
		newInviteDisabled = invite.disabled;

		(document.getElementById('invite_modal') as HTMLDialogElement)?.showModal();
	}

	async function updateInvite() {
		try {
			creatingInvite = true;
			let invite = invites?.find((i) => i.code === newInviteCode);
			if (!invite) {
				console.error('Invite not found:', newInviteCode);
				return;
			}
			try {
				let updatedInvite = (await pb.collection('teamInvitations').update(invite.id, {
					code: newInviteCode,
					uses: newInviteMaxUses !== null ? newInviteMaxUses + 1 : -1, // Use -1 for unlimited
					expiration: newInviteExpirationDate
						? new Date(newInviteExpirationDate).toISOString()
						: null,
					disabled: newInviteDisabled
				})) as TeamInvitationNonExpand;

				// Update the invite in the local state
				invites = invites?.map((i) => (i.id === updatedInvite.id ? updatedInvite : i));

				inviteError = null;
				(document.getElementById('invite_modal') as HTMLDialogElement)?.close();
			} catch (err) {
				console.error("Errore durante la modifica dell'invito:", err);
				inviteError = "Si è verificato un errore durante la modifica dell'invito.";
			}
		} catch (err) {
			console.error("Errore durante la modifica dell'invito:", err);
			inviteError = "Si è verificato un errore durante la modifica dell'invito.";
			return;
		} finally {
			creatingInvite = false;
			modifyingInvite = false;
		}
		resetModal();
	}

	async function createInvite() {
		try {
			creatingInvite = true;
			const pb = new PocketBase(data.pbUri) as TypedPocketBase;

			console.log('Creating invite with code:', newInviteCode);
			if (newInviteCode !== '') {
				if (newInviteCode.length < 3 || newInviteCode.length > 16) {
					inviteError = 'Il codice invito deve essere tra 3 e 16 caratteri.';
					return;
				}
			}

			let existingInvite;
			try {
				existingInvite = await pb
					.collection('teamInvitations')
					.getFirstListItem(`code="${newInviteCode}"`);
			} catch (err) {
				if (err instanceof ClientResponseError && err.status === 404) {
					existingInvite = null; // No existing invite found
				} else {
					throw err; // Rethrow other errors
				}
			}
			if (existingInvite) {
				inviteError = 'Un invito con questo codice esiste già.';
				return;
			}
			console.log('Invite code is valid:', newInviteCode);

			if (newInviteMaxUses !== null && newInviteMaxUses !== undefined) {
				if (newInviteMaxUses < 1) {
					inviteError = 'Il numero di utilizzi deve essere almeno 1, lascia vuoto per illimitato.';
					return;
				}
			} else {
				newInviteMaxUses = -1; // Default to unlimited uses
			}

			if (newInviteExpirationDate) {
				// expiration = new Date(newInviteExpirationDate);
				if (isNaN(newInviteExpirationDate.getTime())) {
					inviteError = 'La data di scadenza non è valida.';
					return;
				}
				if (newInviteExpirationDate < new Date()) {
					inviteError = 'La data di scadenza non può essere nel passato.';
					return;
				}
			}

			console.log('Invite settings:', {
				code: newInviteCode,
				newInviteMaxUses,
				newInviteExpirationDate,
				newInviteDisabled
			});
			try {
				const invite = (await pb.collection('teamInvitations').create({
					code: newInviteCode,
					team: team.id,
					uses: newInviteMaxUses, // Set the number of uses or leave it as -1 for unlimited
					expiration: newInviteExpirationDate ? newInviteExpirationDate.toISOString() : null, // Set expiration date if needed
					disabled: newInviteDisabled // Set to true if you want to disable the invite
				})) as TeamInvitationNonExpand;
				if (!invites) {
					invites = [];
				}
				invites.unshift(invite);
			} catch (err) {
				console.error("Errore durante la creazione dell'invito:", err);
				inviteError = "Si è verificato un errore durante la creazione dell'invito.";
				return;
			}
			inviteError = null;
			(document.getElementById('invite_modal') as HTMLDialogElement)?.close();
		} catch (err) {
			console.error("Errore durante la creazione dell'invito:", err);
			inviteError = "Si è verificato un errore durante la creazione dell'invito.";
			return;
		} finally {
			creatingInvite = false;
		}
		resetModal();
	}

	const baseInviteUrl = `https://${env.PUBLIC_BASE_URL}/join/`;

	let userToKick: UserNonExpand = $state({} as UserNonExpand);
	let kickUserError: string | null = $state(null);
	function askUserToKickModal(userId: string) {
		const user = members.find((m) => m.id === userId);
		if (!user) {
			console.error('User not found:', userId);
			return;
		}
		userToKick = user;
		(document.getElementById('kick_user_modal') as HTMLDialogElement)?.showModal();
	}

	function resetKickUserModal() {
		userToKick = {} as UserNonExpand;
		kickUserError = null;
		(document.getElementById('kick_user_modal') as HTMLDialogElement)?.close();
	}

	async function kickUser(user: UserNonExpand) {
		try {
			await pb.collection('teams').update(team.id, { 'members-': user.person });
			members = members.filter((m) => m.id !== user.id);
			(document.getElementById('kick_user_modal') as HTMLDialogElement)?.close();
			resetKickUserModal();
		} catch (err) {
			console.error('Error kicking user:', err);
			kickUserError = "Si è verificato un errore durante l'espulsione del membro.";
		}
	}

	function leaveTeamModal() {
		if (isCurrentOwner) {
			alert(
				'Non puoi abbandonare il team in quanto sei il capo, promuovi un altro membro a capo per poter abbandonare il team.'
			);
			return;
		}
		(document.getElementById('leave_team_modal') as HTMLDialogElement)?.showModal();
	}

	async function leaveTeam() {
		try {
			await pb.collection('teams').update(team.id, { 'members-': user.person });
			members = members.filter((m) => m.id !== user.id);
			(document.getElementById('leave_team_modal') as HTMLDialogElement)?.close();
		} catch (err) {
			console.error('Error leaving team:', err);
		}
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
					<p class="text-normal text-gray-600 md:text-lg">{team.bio}</p>
				</div>
			</div>
			{#if isCurrentOwner}
				<div class="divider"></div>
				<a class="btn my-4 w-full bg-gray-100" href="./settings">Modifica Profilo</a>
			{/if}
		</div>

		<div class="divider lg:divider-horizontal"></div>

		<div class="w-full">
			<div role="tablist" class="tabs tabs-md lg:tabs tabs-border flex w-full justify-center">
				{#each tabs as tab}
					<button
						role="tab"
						class="tab text-2xl transition-all lg:text-3xl"
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

							<!-- TODO: LEAVE TEAM -->
							<!-- <div class="flex w-full justify-end">
								<div
									class="overflow-clip"
									class:tooltip={isCurrentOwner}
									class:tooltip-left={isCurrentOwner}
									data-tip="Non puoi abbandonare il team in quanto sei il capo, promuovi un altro membro a capo per poter abbandonare il team."
								>
									<button class="btn btn-error" onclick={leaveTeamModal} disabled={isCurrentOwner}
										>Abbandona Team</button
									>
								</div>
							</div>

							<dialog id="leave_team_modal" class="modal modal-bottom sm:modal-middle">
								<div class="modal-box">
									<h3 class="text-lg font-bold">Sei sicuro di voler abbandonare il team?</h3>
									<p class="py-4">Non potrai più accedere alle risorse del team.</p>
									<div class="modal-action">
										<form method="dialog">
											<button class="btn">Annulla</button>
										</form>
										<button class="btn btn-error" onclick={leaveTeam}>Abbandona Team</button>
									</div>
								</div>
								<form method="dialog" class="modal-backdrop">
									<button>close</button>
								</form>
							</dialog> -->

							<dialog
								oncancel={resetKickUserModal}
								onclose={resetKickUserModal}
								id="kick_user_modal"
								class="modal modal-bottom sm:modal-middle"
							>
								<div class="modal-box">
									<!-- <form method="dialog">
									<button class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2">✕</button>
								</form> -->
									<h3 class="text-lg font-bold">Sei sicuro di voler espellere questo membro?</h3>
									<p class="py-4">
										Quest'azione non può essere annullata, sei sicuro di voler procedere?
									</p>

									{#if kickUserError}
										<p class="text-error">{kickUserError}</p>
									{/if}

									<!-- show who is being kicked by showing the profile pic and the full name with the user nick -->
									<div class="flex items-center space-x-4">
										<!-- {#snippet picture()} -->
										<img
											src={userToKick.avatarCropped}
											alt={userToKick.name}
											class="h-12 w-12 rounded-full ring-1"
										/>
										<!-- {/snippet} -->
										<p class="text-lg font-semibold">{userToKick.name} {userToKick.lastName}</p>
									</div>
									<!-- <p class="py-4">Stai per espellere: {userToKick.name} {userToKick.lastName}</p> -->

									<div class="modal-action">
										<form method="dialog">
											<button class="btn">Annulla</button>
										</form>
										<button class="btn btn-error" onclick={() => kickUser(userToKick)}
											>Espelli Membro</button
										>
									</div>
								</div>
							</dialog>

							<div class="w-full space-y-2">
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
												class="h-12 w-12 rounded-full ring-1"
											/>
										{/snippet}
										{#snippet iconSnippet()}
											{#if team.owner == member.person}
												<Crown class="size-4 text-yellow-500" />
											{/if}
										{/snippet}
										{#snippet actionButtons()}
											{#if isCurrentOwner && team.owner !== member.person}
												<button
													class="btn btn-sm btn-outline btn-error"
													onclick={() => askUserToKickModal(member.id)}
												>
													<UserX class="size-4" />
												</button>
												<!-- <button
													class="btn btn-sm btn-outline btn-warning"
													onclick={() => promoteUser(member.id)}
												>
													<Crown class="size-4" />
												</button> -->
											{/if}
										{/snippet}
									</EntityCard>
								{/each}
							</div>
						</div>
					{:else if currentTab === 'invites'}
						<p class="mt-4 w-full text-3xl font-bold">INVITI:</p>

						<div class="flex w-full justify-end items-center gap-2">
							<ContextualHelp contextualHelp={contextualHelps.invites_optionalParameters} />
							<button
								class=" btn btn-primary"
								onclick={() =>
									(document.getElementById('invite_modal') as HTMLDialogElement)?.showModal()}
							>
								Crea Nuovo Invito
							</button>
						</div>

						<dialog
							id="invite_modal"
							onclose={resetModal}
							oncancel={resetModal}
							class="modal modal-bottom sm:modal-middle"
						>
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
												disabled={creatingInvite || modifyingInvite}
												bind:value={newInviteCode}
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
										<input type="checkbox" bind:checked={isAdvancedSettingShowing} />
										<div class="collapse-title">Impostazioni Avanzate</div>
										<div class="collapse-content text-sm">
											<fieldset class="fieldset">
												<legend class="fieldset-legend">Numero di Utilizzi</legend>
												<input
													bind:value={newInviteMaxUses}
													id="max-uses"
													type="number"
													class="input input-bordered w-full"
												/>
												<p class="label">
													Quante persone potranno utilizzare questo invito.<br /> lascia vuoto per creare
													un invito con utilizzi illimitati
												</p>
											</fieldset>

											<fieldset class="fieldset">
												<legend class="fieldset-legend">Data di Scadenza</legend>
												<input
													id="invite-expiration"
													type="date"
													bind:value={newInviteExpirationDate}
													min={new Date().toISOString().split('T')[0]}
													class="input input-bordered w-full"
												/>
												<p class="label">
													Durata dell'invito<br />
													Se non viene specificata, l'invito non avrá scadenza.
												</p>
											</fieldset>

											<fieldset class="fieldset">
												<legend class="fieldset-legend">Disabilitato</legend>
												<label class="label">
													<input
														type="checkbox"
														bind:checked={newInviteDisabled}
														class="toggle toggle-error"
													/>
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

									{#if modifyingInvite}
										<button
											class="btn btn-warning"
											onclick={updateInvite}
											disabled={creatingInvite}
										>
											{#if creatingInvite}
												<span class="loading loading-spinner loading-sm"></span>
											{/if}
											Modifica Invito
										</button>
									{:else}
										<button
											class="btn btn-primary"
											onclick={createInvite}
											disabled={creatingInvite}
										>
											{#if creatingInvite}
												<span class="loading loading-spinner loading-sm"></span>
											{/if}
											Crea Invito
										</button>
									{/if}
								</div>

								<!-- <button class="btn btn-primary" onclick={createInvite}>Crea Invito</button> -->
							</div>
							<!-- This form closes the modal when clicked outside -->
							<form method="dialog" class="modal-backdrop">
								<button>close</button>
							</form>
						</dialog>

						{#if invites && invites.length > 0}
							<div class="mt-4 w-full space-y-2">
								{#each invites as invite}
									{@const joinedCount = invite.joined.length}
									{@const maxUses = invite.uses + joinedCount}
									{@const isDisabled =
										invite.disabled ||
										(invite.expiration && new Date(invite.expiration) < new Date()) ||
										(invite.uses !== -1 && invite.uses <= 0)}
									{@const daysRemaining = invite.expiration
										? datediff(new Date(), new Date(invite.expiration)) + 1
										: null}
									<div
										class="collapse-arrow collapse rounded-lg bg-gray-200 {isDisabled
											? 'opacity-60'
											: ''}"
									>
										<input type="checkbox" class="peer" />
										<div class="collapse-title flex items-center justify-between">
											<div class="flex items-center space-x-4">
												<div class="flex items-center">
													<Users />
													<span class="text-mdmd:text-lg ml-2 font-mono font-bold"
														>{invite.code}</span
													>
												</div>
											</div>

											<div class="flex items-center space-x-4">
												<!-- <button
													class="btn btn-sm btn-outline z-10"
													onclick={() => copyInviteLink(invite.code)}
												>
													Copia Link
												</button> -->
												<ClipboardButton class="z-10" content={`${baseInviteUrl}${invite.code}`} />

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
																	<!-- {new Date(invite.expiration).toLocaleDateString('it-IT')} -->
																	{console.log('days remaining:', daysRemaining)}
																	{#if daysRemaining !== null && daysRemaining > 0 && new Date(invite.expiration) >= new Date()}
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
																disabled
															/>
														</label>
													</div>

													<!-- People who joined -->
													<!-- <div class="mt-4">
														<p class="text-sm">
															Persone che hanno usato questo invito: {joinedCount} persone
														</p>
													</div> -->
												</div>

												<!-- Action Buttons -->
												<div class="flex justify-end space-x-2">
													<button
														class="btn btn-sm btn-outline"
														onclick={() => showModalToModifyInvite(invite.code)}
													>
														Modifica
													</button>

													<!-- <button
														class="btn btn-sm btn-error"
														onclick={() => disableInvite(invite.code)}
													>
														Elimina
													</button> -->
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
