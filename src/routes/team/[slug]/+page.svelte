<script lang="ts">
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import type { Team } from '$types/team';
	import type { UserNonExpand } from '$types/user';
	import { Crown, ExternalLink } from 'lucide-svelte';
	interface Props {
		data: {
			team: Team;
			members: UserNonExpand[];
			error: {
				kind: 'teams' | 'members' | 'other';
				message: string;
			} | null;
			isCurrentOwner: boolean;
			isCurrentMember: boolean;
			slug: string;
		};
	}
	// }

	// const backgroundImage =

	const { data }: Props = $props();
	// 	user: UserNonExpand;
	// 	slug: string;
	// }>();
	let { team, slug, members, isCurrentOwner, isCurrentMember } = data;
</script>

<div class="flex w-full justify-center">
	<div class="flex w-full flex-col items-center justify-center md:max-w-[80%] lg:max-w-[55%]">
		<div class="h-2xl line-clamp-3 w-full">
			{#if team.bannerCropped}
				<!-- <img src={user.bannerCropped} alt="banner" class="h-full w-full object-fill" /> -->
				<img src={team.bannerCropped} alt="banner" class="h-full w-full object-fill" />
			{:else}
				<div class="h-48 w-full bg-blue-400">
					<!-- <p class="text-center text-gray-500">No banner available</p> -->
				</div>
			{/if}
		</div>

		<div class="flex w-full items-center justify-center space-x-5 pb-8">
			<div class="mt-[-1rem] mb-4 h-20 w-20 rounded-full bg-gray-200 md:h-24 md:w-24">
				<div class="avatar">
					<div class="w-20 rounded-full ring-1 ring-black md:w-24">
						<img src={team.logoCropped} alt="User Avatar" />
					</div>
				</div>
			</div>
			<div class="mt-[-1rem]">
				<h2 class="text-2xl font-bold">{team.name}</h2>
				<!-- <div class="flex flex-nowrap items-center space-x-2"> -->
				<a href={'/team/' + team.slug} target="_blank" class="ml-2 font-bold text-red-600">
					@{team.slug}
				</a>
			</div>
		</div>

		<!-- bio section -->
		{#if team.description && team.description.length > 0}
			<div class="w-full px-4">
				<p class="">Bio:</p>
				<p class="ml-2 text-lg text-gray-600">{team.description}</p>
			</div>
		{:else if isCurrentOwner}
			<div class="w-full px-4">
				<p class="text-lg text-gray-600">Non c'é una descrizione.</p>
				<a class="btn btn-primary" href={`/team/${team.slug}/settings`}>Scrivine una</a>
			</div>
		{/if}

		<div class="flex w-full flex-col items-center justify-between px-4">
			<p class="mt-4 text-3xl font-bold">MEMBRI:</p>
			{#if members.length == 0}
				{#if isCurrentOwner}
					<p class="mt-4 text-lg font-semibold">Non hai membri nel tuo team.</p>
					<button class="btn btn-primary mt-2">
						<a href={'/team/' + team.slug + '/invite/new'}>Creane un invito</a>
					</button>
				{:else}
					<p class="mt-4 text-lg font-normal text-gray-600">Questo team non ha membri.</p>
				{/if}
			{/if}

			<div class="w-full space-y-2">
				{#each members as user}
					<EntityCard
						title={`${user.name} ${user.lastName}`}
						slug={user.nick}
						description={user.bio}
						link={`/user/${user.nick}`}
					>
						{#snippet picture()}
							<img src={user.avatarCropped} alt="User Avatar" class="size-16 rounded-full ring-1" />
						{/snippet}
						{#snippet iconSnippet()}
							{#if user.person == team.owner}
								<Crown class="ml-1 text-yellow-600" size={16} />
							{/if}
						{/snippet}
					</EntityCard>
				{/each}
			</div>
			{#if members.length === 1 && isCurrentOwner}
				<p class="mt-4 text-lg font-semibold">Sei l'unico membro del team.</p>
				<button class="btn btn-primary mt-2">
					<a href={'/dash/team/' + team.slug + '/invite/new'}>Invita qualcuno</a>
				</button>
			{/if}
			<div>
				{#if isCurrentMember}
					<a class="btn my-4 w-full bg-gray-100" href={`/team/${team.slug}/dash`}
						>Vai alla pagina privata del team</a
					>
				{/if}
			</div>
		</div>
		<!-- <img src={user.avatarCropped} alt="User Avatar" class="mb-4 h-24 w-24 rounded-full" /> -->
		<!-- 
		<h1 class="text-3xl font-bold">User Profile</h1>
		<p class="mt-2 text-lg">
			Welcome, {user.nick}!
		</p>
		<p class="mt-4">This is your profile page.</p>
		<p class="mt-2">Your slug is: {slug}</p> -->
		<!-- Add more user-specific information here -->
	</div>
</div>
