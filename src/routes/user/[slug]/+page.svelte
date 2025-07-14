<script lang="ts">
	import type { Team } from '$tsTypes/team';
	import type { UserNonExpand } from '$tsTypes/user';
	import { Crown, ExternalLink } from 'lucide-svelte';
	interface Props {
		data: {
			user: UserNonExpand;
			slug: string;
			teams: Team[];
			error: {
				kind: 'teams' | 'other';
				message: string;
			} | null;
			isCurrentUser: boolean;
		};
	}
	// }

	// const backgroundImage =

	const { data }: Props = $props();
	// 	user: UserNonExpand;
	// 	slug: string;
	// }>();
	let { user, slug, teams, isCurrentUser } = data;
</script>

<div class="flex w-full justify-center">
	<div class="flex w-full flex-col items-center justify-center md:max-w-[80%] lg:max-w-[55%]">
		<div class="h-2xl line-clamp-3 w-full">
			{#if user.bannerCropped}
				<!-- <img src={user.bannerCropped} alt="banner" class="h-full w-full object-fill" /> -->
				<img src={user.bannerCropped} alt="banner" class="h-full w-full object-fill" />
			{:else}
				<div class="h-48 w-full bg-blue-400">
					<!-- <p class="text-center text-gray-500">No banner available</p> -->
				</div>
			{/if}
		</div>

		<div class="flex w-full items-center justify-center space-x-5 px-2 pb-8">
			<div class="mt-[-1rem] mb-4 h-20 w-20 rounded-full bg-gray-200 md:h-24 md:w-24">
				<div class="avatar">
					<div class="w-20 rounded-full ring-1 ring-black md:w-24">
						<img src={user.avatarCropped} alt="User Avatar" />
					</div>
				</div>
			</div>
			<div class="mt-[-1rem] min-w-0">
				<h2 class="text-xl font-bold md:text-2xl">{user.name} {user.lastName}</h2>
				<a
					href={'/user/' + user.nick}
					target="_blank"
					rel="noopener noreferrer"
					class="ml-2 block max-w-full min-w-0 truncate font-semibold text-red-600 md:font-bold"
				>
					@{user.nick}
				</a>
			</div>
		</div>

		<!-- bio section -->
		{#if user.bio && user.bio.length > 0}
			<div class="w-full px-4">
				<p class="">Bio:</p>
				<p class="ml-2 text-lg text-gray-600">{user.bio}</p>
			</div>
		{:else if isCurrentUser}
			<div class="w-full px-4">
				<p class="text-lg text-gray-600">Non hai ancora scritto una bio.</p>
			</div>
		{/if}

		<div class="flex w-full flex-col items-center justify-between px-4">
			<p class="mt-4 text-3xl font-bold">TEAMS:</p>
			{#if teams.length == 0}
				{#if isCurrentUser}
					<p class="mt-4 text-lg font-semibold">Non fai parte di nessun team</p>
					<button class="btn btn-primary mt-2">
						<a href="/teams/new">Creane Uno</a>
					</button>
				{:else}
					<p class="mt-4 text-lg font-normal text-gray-600">
						Questo account non fa parte di nessun team
					</p>
				{/if}
			{/if}
			{#each teams as team}
				<a href={'/team/' + team.slug} class="group my-4 w-full cursor-pointer">
					<div class="rounded-lg bg-gray-200 p-4 transition-colors group-hover:bg-gray-300">
						<div class="flex items-start space-x-3">
							<img src={team.logoCropped} alt="Team Logo" class="size-16 rounded-full" />
							<div class="flex-1">
								<div class="justify-right flex items-center space-x-2">
									<div class="flex flex-nowrap items-center">
										<p class="group text-lg font-bold transition duration-300">
											{team.name}
											<span
												class="mx-1 block h-0.5 max-w-0 bg-red-600 transition-all duration-500 group-hover:max-w-full"
											></span>
										</p>

										<!-- <h3 class="text-xl font-bold group-hover:underline md:text-2xl"></h3> -->
										{#if team.owner == user.person}
											<Crown class="ml-1 text-yellow-600" size={16} />
										{/if}
									</div>
									<span class="text-sm font-semibold text-red-600 group-hover:font-bold"
										>@{team.slug}</span
									>
								</div>
								<p class="mt-1 line-clamp-1 text-gray-700">{team.description}</p>
							</div>
						</div>
					</div>
				</a>
			{/each}
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
