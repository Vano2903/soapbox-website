<script lang="ts">
	import type { TypedPocketBase } from '$types/pocketbase/pocketbase';
	import type { Team } from '$types/pocketbase/team';
	import { ArrowUpDown, ArrowDown, ArrowUp, Search, SlidersHorizontal, X, User, ChevronRight, ChevronLeft } from 'lucide-svelte';
	import type { ListResult } from 'pocketbase';
	import EntityCard2 from '$components/entityCard/entityCard2.svelte';
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

	// --- Search state & options ---
	let researchField = $state('');
	let showAdvanced = $state(false);

	let nameEnabled = $state(true);
	let slugEnabled = $state(true);
	let numberEnabled = $state(true);
	let strictSearchEnabled = $state(false);
	
	let activeFieldCount = $derived([nameEnabled, slugEnabled, numberEnabled].filter(Boolean).length);
	const bannedSlugs = ['admin', 'root', 'superuser', 'user', 'guest', 'test', 'users', 'dash'];

	// --- Sort state & options ---
	let sortField = $state('name');
	let sortOrder = $state('asc');

	const sortOptions: { label: string; field: string }[] = [
		{ label: 'Nome', field: 'name' },
		{ label: 'Slug', field: 'slug' },
		{ label: 'Numero', field: 'number' },
		// { label: 'Data creazione', field: 'created' }
	];

	async function fetchNewPage(page: number, query?: string) {
		if (!pb) return;
		if (query !== undefined && bannedSlugs.includes(query)) return;

		let filtersString = [];
		const operator = strictSearchEnabled ? '=' : '~';
		const value = query ?? '';
		if (nameEnabled) {
			filtersString.push(`name${operator}"${value}"`);
		}
		if (slugEnabled) {
			filtersString.push(`slug${operator}"${value}"`);
		}
		if (numberEnabled) {
			filtersString.push(`number${operator}"${value}"`);
		}
		let sortString = `${sortOrder === 'desc' ? '-' : ''}${sortField}`;

		const result = await pb.collection('teams').getList(page, 10, {
			sort: sortString,
			filter: filtersString.join(' || ')
		});

		paginatedTeams = result;
		expandedTeams = paginatedTeams.items.map((team: Team) => {
			team.logoCropped =
				pb.files.getURL(team, team.logoCropped || '') || createAvatarUrl(team.slug, 'small');
			team.bannerCropped = pb.files.getURL(team, team.bannerCropped || '') || undefined;
			return team;
		});
	}

	function clearSearch() {
		researchField = '';
		fetchNewPage(1, researchField);
	}

	function clearFilters() {
		researchField = '';
		nameEnabled = true;
		slugEnabled = true;
		numberEnabled = true;
		strictSearchEnabled = false;
		sortField = 'name';
		sortOrder = 'asc';
		fetchNewPage(1, researchField);
	}

	function pageRange () {
		const radius = 2;
		const start = Math.max(1, paginatedTeams.page - radius);
		const end = Math.min(paginatedTeams.totalPages, paginatedTeams.page + radius);
		// console.log('New pageRange calculated: (', start, '-', end, ') =\n |- ', Array.from({ length: end - start + 1 }, (_, i) => start + i));
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
	pageRange();
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

	<div class="mx-auto w-full max-w-3xl mt-2">
		<div class="flex items-center gap-2">
			<label class="input flex-1 flex items-center gap-2">
				<Search class="h-4 w-4 text-base-content/40" />
				<input
					autocomplete="off"
					type="text"
					name="team"
					bind:value={
						() => researchField,
						// (n) => (researchField = n.trimStart().replaceAll(' ', '-').toLowerCase())
						(n) => (researchField = n.trimStart())
					}
					placeholder="team-rossi"
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
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={nameEnabled} />
							<span class="text-sm">Nome</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={slugEnabled} />
							<span class="text-sm">Slug</span>
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input type="checkbox" class="checkbox checkbox-sm" bind:checked={numberEnabled} />
							<span class="text-sm">Numero</span>
						</label>
					</div>
				</div>

				<div class="flex items-center justify-between">
					<div>
						<span class="text-sm font-medium">Ricerca rigorosa</span>
						<p class="text-xs text-base-content/50">Cerca solo corrispondenze esatte</p>
					</div>
					<input type="checkbox" class="toggle toggle-sm toggle-primary" bind:checked={strictSearchEnabled} />
				</div>

				<hr class="border-base-200" />

				<div>
					<span class="text-xs font-semibold uppercase tracking-wider text-base-content/50">Ordinamento</span>
					<div class="mt-2 flex flex-wrap items-center gap-2">
						{#each sortOptions as option}
							<button
								class="btn btn-xs btn-ghost"
								class:btn-active={sortField === option.field}
								onclick={() => {
									if (sortField === option.field) {
										sortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
									} else {
										sortField = option.field;
									}
									fetchNewPage(1, researchField);
								}}
							>
								{option.label}
								{#if sortField === option.field}
									{#if sortOrder === 'asc'}
										<ArrowUp class="h-3 w-3" />
									{:else}
										<ArrowDown class="h-3 w-3" />
									{/if}
								{/if}
							</button>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>

	<hr>

	<div class="mx-auto w-full max-w-md">
		<div class="flex items-center justify-around">
			<span class="text-sm text-base-content/50">
				{#if paginatedTeams.totalItems === 0}
					Nessun team trovato
				{:else}
					{paginatedTeams.totalItems} team{paginatedTeams.totalItems === 1 ? '' : 's'} trovat{paginatedTeams.totalItems === 1 ? 'o' : 'i'}
				{/if}
			</span>
			{#if !showAdvanced}
				<button
					onclick={() => (showAdvanced = true)}
					class="flex items-center gap-1 text-xs text-base-content/50 hover:text-base-content transition-colors"
				>
					<ArrowUpDown class="h-3 w-3" />
					{sortOptions.find(o => o.field === sortField)?.label}
					{#if sortOrder === 'asc'}
						<ArrowUp class="h-3 w-3" />
					{:else}
						<ArrowDown class="h-3 w-3" />
					{/if}
				</button>
			{/if}
		</div>
	</div>

	<div class="mx-5 lg:mx-15">
		{#if expandedTeams.length === 0}
			<div class="flex flex-col items-center justify-center rounded-xl border border-base-300 bg-base-100 py-16 px-6 text-center">
				<div class="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-base-200">
					<User class="h-8 w-8 text-base-content/30" />
				</div>
				<h3 class="text-base font-semibold">Nessun team trovato</h3>
				<p class="mt-1 text-sm text-base-content/50">
					{#if researchField.length > 0 || strictSearchEnabled}
						Prova a modificare la ricerca o cambia i filtri
					{:else}
						Non ci sono ancora team registrati
					{/if}
				</p>
				{#if researchField.length > 0 || strictSearchEnabled}
					<button onclick={clearFilters} class="btn btn-sm btn-ghost mt-4">
						Cancella filtro
					</button>
				{/if}
			</div>

		{:else}
			<div class="space-y-2">
				{#each expandedTeams as team}
					<EntityCard2
						title={team.name}
						slug={team.slug}
						description={team.bio}
						link="/team/{team.slug}"
					>
						{#snippet picture()}
							<img src={team.logoCropped} alt="Logo di {team.name}" class="h-14 w-14 rounded-full object-cover" />
						{/snippet}
					</EntityCard2>
				{/each}
			</div>
		{/if}
	</div>

	<br />
	
	{#if paginatedTeams.totalPages > 1}
		<div class="mx-auto w-full max-w-xl">
			<div class="flex items-center justify-center gap-1">
				<button
					class="btn btn-ghost btn-sm"
					disabled={!(paginatedTeams.page > 1)}
					onclick={() => fetchNewPage(paginatedTeams.page - 1, researchField)}
				>
					<ChevronLeft class="h-4 w-4" />
				</button>

				{#if pageRange()[0] > 1}
					<button
						class="btn btn-ghost btn-sm btn-square"
						onclick={() => fetchNewPage(1, researchField)}
					>1</button>
					{#if pageRange()[0] > 2}
						<span class="text-base-content px-1 btn-sm btn-square flex items-center">…</span>
					{/if}
				{/if}

				{#each pageRange() as p}
					<button
						class="btn btn-ghost btn-sm btn-square"
						class:btn-active={p === paginatedTeams.page}
						onclick={() => fetchNewPage(p, researchField)}
					>{p}</button>
				{/each}

				{#if pageRange()[pageRange().length - 1] < paginatedTeams.totalPages}
					{#if pageRange()[pageRange().length - 1] < paginatedTeams.totalPages - 1}
						<span class="text-base-content px-1 btn-sm btn-square flex items-center">…</span>
					{/if}
					<button
						class="btn btn-ghost btn-sm btn-square"
						onclick={() => fetchNewPage(paginatedTeams.totalPages, researchField)}
					>{paginatedTeams.totalPages}</button>
				{/if}

				<button
					class="btn btn-ghost btn-sm"
					disabled={!(paginatedTeams.page < paginatedTeams.totalPages)}
					onclick={() => fetchNewPage(paginatedTeams.page + 1, researchField)}
				>
					<ChevronRight class="h-4 w-4" />
				</button>
			</div>
		</div>
	{/if}
</div>
