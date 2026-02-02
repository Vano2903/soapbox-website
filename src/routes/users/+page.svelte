<script lang="ts">
	import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
	import type { UserNonExpand, UserPublicInfo } from '$types/pocketbase/user';
	import { ExternalLink } from 'lucide-svelte';
	import { env } from '$env/dynamic/public';
	import { createPocketBaseInstance } from '$lib/utils/pocketbase';
	import type { ListResult } from 'pocketbase';
	import { onMount } from 'svelte';
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import { createAvatarUrl } from '$lib/utils/avatar';

	interface Props {
		data: {
			paginatedUsers: ListResult<UserPublicInfo>;
			expandedUsers: UserPublicInfo[];
			pb: TypedPocketBase;
			error: string | null;
		};
	}

	const { data }: Props = $props();
	let { pb, error } = $derived(data);
	let paginatedUsers = $derived(data.paginatedUsers);
	let expandedUsers = $derived(data.expandedUsers);

	let username = $state("");
	const bannedUsernames = ['admin', 'root', 'superuser', 'user', 'guest', 'test', 'users', 'dash'];
	async function fetchNewPage(page: number, username?: string) {
		if (pb) {
			if (username !== undefined && bannedUsernames.includes(username)) {
				return;
			}

			let filterString = [];
			if (usernameEnabled) {
				filterString.push(`nick${strictSearchEnabled ? '=' : '~'}"${username ?? ''}"`);
			}
			if (nameEnabled) {
				filterString.push(`name${strictSearchEnabled ? '=' : '~'}"${username ?? ''}"`);
			}
			if (lastNameEnabled) {
				filterString.push(`lastName${strictSearchEnabled ? '=' : '~'}"${username ?? ''}"`);
			}

			console.log('Fetching new page from PocketBase: (', page, ', ', username, ')');
			console.log(filterString.join(' || '));
			const result = await pb.collection('publicUserInfo').getList(page, 10, {
				sort: 'nick',
				filter: filterString.join(' || ')
			});
			paginatedUsers = result;

			expandedUsers = paginatedUsers.items.map((user: UserPublicInfo) => {
				user.avatarCropped =
					pb.files.getURL(user, user.avatarCropped || '', { thumb: '64x0' }) ||
					createAvatarUrl(user.nick, 'small');
				user.bannerCropped = pb.files.getURL(user, user.bannerCropped || '') || undefined;
				return user;
			});
		}
	}

	// let users = $derived(() => paginatedUsers.items);
	// const pbEndpoint = env.PUBLIC_PB_INSTANCE;
	// const pb = createPocketBaseInstance(pbEndpoint);
	// if (!pbEndpoint) {
	// 	throw new Error('Pocketbase instance not found');
	// }

	// const publicUsersPaginated = await pb.collection('publicUserInfo').getList(1, 10, {
	// 	sort: 'nick'
	// });
	// (1, 10, {
	// sort: 'nick'
	// });

	// return {
	// 	users: $state(publicUsersPaginated.items),
	// 	totalItems: publicUsersPaginated.totalItems,
	// 	totalPages: publicUsersPaginated.totalPages,
	// 	currentPage: publicUsersPaginated.page,
	// 	pb: pb
	// };

	// let { users, totalItems, totalPages, currentPage, pb } = data;
	// let error = $state<string | null>(null);

	console.log('data', data);

	let showResearch = $state(false);
	let nameEnabled = $state(true);
	let lastNameEnabled = $state(true);
	let usernameEnabled = $state(true);
	let strictSearchEnabled = $state(false);
</script>

<div class="mx-4 space-y-2">
	<!-- <label class="input">
		<svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<g
				stroke-linejoin="round"
				stroke-linecap="round"
				stroke-width="2.5"
				fill="none"
				stroke="currentColor"
			>
				<circle cx="11" cy="11" r="8"></circle>
				<path d="m21 21-4.3-4.3"></path>
			</g>
		</svg>
		<input type="search" class="grow" placeholder="Search" />
		<kbd class="kbd kbd-sm">⌘</kbd>
		<kbd class="kbd kbd-sm">K</kbd>
	</label> -->

	{#if error}
		<div class="alert alert-error alert-soft m-auto my-2 w-full md:max-w-1/2">
			<span>{error}</span>
		</div>
	{/if}

	<div class="flex flex-row items-center justify-center gap-2">
		<!-- <h2 class="card-title text-2xl">Ricerca Utenti</h2> -->
		<fieldset class="swap-off fieldset flex-1 text-base max-w-1/1 md:max-w-1/2">
			<legend class="fieldset-legend">Ricerca Utente</legend>

			<label
				class="input w-full"
			>
				<input
					autocomplete="username"
					type="text"
					form="check"
					name="username"
					id="username"
					bind:value={
						() => username,
						(n) => (username = n.trimStart().replaceAll(' ', '-').toLowerCase())
					}
					placeholder="mario-rossi"
					oninput={() => fetchNewPage(1, username)}
				/>
			</label>
			<input type="hidden" name="username" value={username} />
		</fieldset>
		<!-- <div class="bg-base-100 border-base-300 collapse-plus collapse mt-4 border">
			<input type="checkbox" bind:checked={showResearch} />
			<div class="collapse-title">Ricerca Avanzata</div>
			<div class="collapse-content text-sm">
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Parametri</legend>
					<label class="label">
						<input
							type="checkbox"
							bind:checked={nameEnabled}
							class="toggle toggle-error"
						/>
						Nome
					</label>
					<label class="label">
						<input
							type="checkbox"
							bind:checked={lastNameEnabled}
							class="toggle toggle-error"
						/>
						Cognome
					</label>
					<label class="label">
						<input
							type="checkbox"
							bind:checked={usernameEnabled}
							class="toggle toggle-error"
						/>
						Username
					</label>
				</fieldset>
				<fieldset class="fieldset">
					<legend class="fieldset-legend">Ricerca Rigorosa</legend>
					<label class="label">
						<input
							type="checkbox"
							bind:checked={strictSearchEnabled}
							class="toggle toggle-error"
						/>
					</label>
				</fieldset>
			</div>
		</div> -->
	</div>

	<hr>

	<div class="space-y-1">
		{#each expandedUsers as user}
			<EntityCard
				title={`${user.name} ${user.lastName}`}
				slug={user.nick}
				description={user.bio}
				link={`/user/${user.nick}`}
			>
				{#snippet picture()}
					<img src={user.avatarCropped} alt="User Avatar" class="size-16 rounded-full ring-1" />
				{/snippet}
			</EntityCard>
		{/each}
	</div>

	<br />
	<div class="join">
		{#each paginatedUsers.totalPages > 0 ? Array(paginatedUsers.totalPages) : [] as _, i}
			<button
				class="join-item btn"
				class:btn-active={i === paginatedUsers.page}
				onclick={() => fetchNewPage(i + 1)}>{i + 1}</button
			>
		{/each}
	</div>
</div>
