<script lang="ts">
	import type { TypedPocketBase } from '$tsTypes/pocketbase';
	import type { UserNonExpand, UserPublicInfo } from '$tsTypes/user';
	import { ExternalLink } from 'lucide-svelte';
	import { env } from '$env/dynamic/public';
	import { createPocketBaseInstance } from '$lib/utils/pocketbase';
	import type { ListResult } from 'pocketbase';
	import { onMount } from 'svelte';
	import EntityCard from '$components/entityCard/entityCard.svelte';

	interface Props {
		data: {
			paginatedUsers: ListResult<UserPublicInfo>;
			expandedUsers: UserPublicInfo[];
			pb: TypedPocketBase;
			error: string | null;
		};
	}

	const { data }: Props = $props();
	let { pb, error } = data;
	let paginatedUsers = $state(data.paginatedUsers);
	let expandedUsers = $state(data.expandedUsers);

	async function fetchnNewPage(page: number) {
		if (pb) {
			const result = await pb.collection('publicUserInfo').getList(page, 10, {
				sort: 'nick'
			});
			paginatedUsers = result;
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
</script>

<div class="mx-4 space-y-2">
	<label class="input">
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
	</label>

	{#if error}
		<div class="alert alert-error alert-soft m-auto my-2 w-full md:max-w-1/2">
			<span>{error}</span>
		</div>
	{/if}

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
				onclick={() => fetchnNewPage(i + 1)}>{i + 1}</button
			>
		{/each}
	</div>
</div>
