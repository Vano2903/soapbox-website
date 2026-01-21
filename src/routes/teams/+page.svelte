<script lang="ts">
	import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
	import type { ListResult } from 'pocketbase';
	import type { Team } from '$types/pocketbase/team';
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import { createAvatarUrl } from '$lib/utils/avatar';

	interface Props {
		data: {
			paginatedTeams: ListResult<Team>;
			expandedTeams: Team[];
			pb: TypedPocketBase;
			error: string | null;
		};
	}

	const { data }: Props = $props();
	let { pb, error } = $derived(data);
	let paginatedTeams = $derived(data.paginatedTeams);
	let expandedTeams = $derived(data.expandedTeams);

	async function fetchNewPage(page: number) {
		if (pb) {
			console.log('fetching page', page);

			const result = await pb.collection('teams').getList(page, 10, {
				sort: 'slug'
			});
			paginatedTeams = result;

			expandedTeams = paginatedTeams.items.map((team: Team) => {
				team.logoCropped =
					pb.files.getURL(team, team.logoCropped || '') || createAvatarUrl(team.slug, 'small');
				team.bannerCropped = pb.files.getURL(team, team.bannerCropped || '') || undefined;
				return team;
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
		<div class="alert alert-error w-full md:max-w-1/2">
			<span>{error}</span>
		</div>
	{/if}

	<div class="space-y-1">
		{#each expandedTeams as team}
			<EntityCard
				title={team.name}
				slug={team.slug}
				description={team.bio}
				link={`/team/${team.slug}`}
			>
				{#snippet picture()}
					<img src={team.logoCropped} alt="Team Logo" class="size-16 rounded-full ring-1" />
				{/snippet}
			</EntityCard>
		{/each}
	</div>

	<br />
	<div class="join">
		{#each paginatedTeams.totalPages > 0 ? Array(paginatedTeams.totalPages) : [] as _, i}
			<button
				class="join-item btn"
				class:btn-active={i === paginatedTeams.page}
				onclick={() => fetchNewPage(i + 1)}>{i + 1}</button
			>
		{/each}
	</div>
</div>
