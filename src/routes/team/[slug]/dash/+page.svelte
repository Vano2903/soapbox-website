<script lang="ts">
	import { page } from '$app/state';
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import type { TypedPocketBase } from '$types/pocketbase.js';
	import type { Team, TeamInvitationNonExpand } from '$types/team.js';
	import type { UserNonExpand } from '$types/user.js';
	import { Crown, Users } from 'lucide-svelte';
	import PocketBase, { type RecordModel } from 'pocketbase';
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

	let defaultTab = tabs[1].anchor;

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
							<a class="btn" href="/team/dash/invite/new">Crea un nuovo invito</a>
						</div>

						{#if invites && invites.length > 0}
							<div class="mt-4 space-y-4">
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
										class="collapse-arrow collapse rounded-lg bg-gray-200 {isDisabled
											? 'opacity-60'
											: ''}"
									>
										<input type="checkbox" class="peer" />
										<div class="collapse-title flex items-center justify-between">
											<div class="flex items-center space-x-4">
												<div class="flex items-center">
													<Users />
													{#if invite.uses === -1}
														<span class="ml-2">Invito illimitato: {joinedCount} partecipanti</span>
													{:else}
														<span class="ml-2">{joinedCount}/{maxUses} partecipanti</span>
													{/if}
												</div>
											</div>

											<div class="flex items-center space-x-4">
												{#if invite.expiration}
													<div class="text-sm">
														<span
															>Scade il {new Date(invite.expiration).toLocaleDateString(
																'it-IT'
															)}</span
														>
														{#if daysRemaining && daysRemaining > 0}
															<span class="ml-1">({daysRemaining} giorni rimanenti)</span>
														{:else}
															<span class="text-error ml-1">(Scaduto)</span>
														{/if}
													</div>
												{/if}

												{#if isDisabled}
													<span class="badge badge-error">Non attivo</span>
												{:else}
													<span class="badge badge-success">Attivo</span>
												{/if}
											</div>
										</div>

										<div class="collapse-content">
											<div class="mt-2 rounded-lg bg-gray-100 p-2">
												<p>Persone che hanno usato questo invito: {joinedCount} persone</p>
											</div>

											<div class="mt-4 flex justify-end space-x-2">
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
													Disattiva
												</button>
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
