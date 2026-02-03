<script lang="ts">
	import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
	import type { UserNonExpand, UserPublicInfo } from '$types/pocketbase/user';
	import { ExternalLink, Search, SlidersHorizontal, X } from 'lucide-svelte';
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

	// --- Search state & options ---
	let researchField = $state('');
	let showAdvanced = $state(false);

	let nameEnabled = $state(true);
	let lastNameEnabled = $state(true);
	let usernameEnabled = $state(true);
	let strictSearchEnabled = $state(false);
	
	let activeFieldCount = $derived([nameEnabled, lastNameEnabled, usernameEnabled].filter(Boolean).length);
	const bannedUsernames = ['admin', 'root', 'superuser', 'user', 'guest', 'test', 'users', 'dash'];

	async function fetchNewPage(page: number, query?: string) {
		if (!pb) return;
		if (query !== undefined && bannedUsernames.includes(query)) return;

		let filtersString = [];
		const operator = strictSearchEnabled ? '=' : '~';
		const value = query ?? '';
		if (usernameEnabled) {
			filtersString.push(`nick${operator}"${value}"`);
		}
		if (nameEnabled) {
			filtersString.push(`name${operator}"${value}"`);
		}
		if (lastNameEnabled) {
			filtersString.push(`lastName${operator}"${value}"`);
		}

		const result = await pb.collection('publicUserInfo').getList(page, 10, {
			sort: 'nick',
			filter: filtersString.join(' || ')
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

	function clearSearch() {
		researchField = '';
		fetchNewPage(1, researchField);
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

	<div class="mx-auto w-full max-w-xl mt-2">
		<div class="flex items-center gap-2">
			<label class="input flex-1 flex items-center gap-2">
				<Search class="h-4 w-4 text-base-content/40" />
				<input
					autocomplete="off"
					type="text"
					name="username"
					bind:value={
						() => researchField,
						(n) => (researchField = n.trimStart().replaceAll(' ', '-').toLowerCase())
					}
					placeholder="mario-rossi"
					oninput={() => fetchNewPage(1, researchField)}
				/>
				{#if researchField.length > 0}
					<button onclick={clearSearch} class="ml-auto text-base-content/40 hover:text-base-content transition-colors">
						<X class="h-4 w-4" />
					</button>
				{/if}
			</label>
			
			<button
				onclick={() => (showAdvanced = !showAdvanced)}
				class="btn btn-ghost btn-sm relative"
				class:btn-active={showAdvanced}
				aria-expanded={showAdvanced}
				title="Opzioni di ricerca"
			>
				<SlidersHorizontal class="h-4 w-4" />
				{#if activeFieldCount < 3}
					<span class="badge badge-xs badge-error absolute -top-1 -right-1">{activeFieldCount}</span>
				{/if}
			</button>
		</div>

		{#if showAdvanced}
			<div class="mt-2 rounded-lg border border-base-300 bg-base-100 p-4 space-y-4">
				<div>
					<span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">Cerca in</span>
					<div class="mt-2 flex flex-wrap gap-2">
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={usernameEnabled} />
							<span class="text-sm">Username</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={nameEnabled} />
							<span class="text-sm">Nome</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={lastNameEnabled} />
							<span class="text-sm">Cognome</span>
						</label>
					</div>
				</div>

				<hr class="border-base-200" />

				<div class="flex items-center justify-between">
					<div>
						<span class="text-sm font-medium">Ricerca rigorosa</span>
						<p class="text-xs text-base-content/50">Cerca solo corrispondenze esatte</p>
					</div>
					<input type="checkbox" class="toggle toggle-sm toggle-primary" bind:checked={strictSearchEnabled} />
				</div>
			</div>
		{/if}
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

	<div class="flex justify-center">
		<div class="join">
			{#each paginatedUsers.totalPages > 0 ? Array(paginatedUsers.totalPages) : [] as _, i}
				<button
					class="join-item btn"
					class:btn-active={i+1 === paginatedUsers.page}
					onclick={() => fetchNewPage(i + 1, researchField)}>{i + 1}</button
				>
			{/each}
		</div>
	</div>
</div>
