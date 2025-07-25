<script lang="ts">
	import type { TypedPocketBase } from '$lib/types/pocketbase';
	import type { ListResult } from 'pocketbase';
	import type { Team } from '$lib/types/team';
	import EntityCard from '$components/entityCard/entityCard.svelte';

	interface Props {
		data: {
			paginatedTeams: ListResult<Team>;
			expandedTeams: Team[];
			pb: TypedPocketBase;
			error: string | null;
		};
	}

	const { data }: Props = $props();
	let { pb, error } = data;
	let paginatedTeams = $state(data.paginatedTeams);
	let expandedTeams = $state(data.expandedTeams);

	async function fetchnNewPage(page: number) {
		if (pb) {
			const result = await pb.collection('teams').getList(page, 10, {
				sort: 'nick'
			});
			paginatedTeams = result;
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
				description={team.description}
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
				onclick={() => fetchnNewPage(i + 1)}>{i + 1}</button
			>
		{/each}
	</div>
</div>
