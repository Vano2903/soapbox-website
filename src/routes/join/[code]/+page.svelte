<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { invite, isAlreadyMember, team } = data;

	let isJoining = $state(false);

	// Check if invite is valid
	const isExpired = new Date(invite.expiration) < new Date();
	const isUseLimitReached = invite.uses !== -1 && invite.joined.length >= invite.uses;
	const isDisabled = invite.disabled || isExpired || isUseLimitReached;
</script>

<svelte:head>
	<title>Join {team?.name || 'Team'} - Brum</title>
	<meta name="description" content="You've been invited to join {team?.name || 'a team'}" />
</svelte:head>

<div class="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
	<div class="w-full max-w-md space-y-8">
		<div class="text-center">
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Team Invitation</h1>
			<p class="text-gray-600">You've been invited to join a team</p>
		</div>

		<div class="space-y-6 rounded-lg bg-white p-6 shadow-md">
			<!-- Team Info -->
			{#if team}
				<div class="space-y-4 text-center">
					<!-- Team Logo -->
					{#if team.logoCropped}
						<div class="flex justify-center">
							<img
								src={team.logoCropped}
								alt="{team.name} logo"
								class="h-20 w-20 rounded-full border-4 border-blue-100 object-cover"
							/>
						</div>
					{:else}
						<div class="flex justify-center">
							<div
								class="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-2xl font-bold text-white"
							>
								{team.name.charAt(0).toUpperCase()}
							</div>
						</div>
					{/if}

					<!-- Team Name & Description -->
					<div>
						<h2 class="text-2xl font-bold text-gray-900">{team.name}</h2>
						{#if team.description}
							<p class="mt-2 text-gray-600">{team.description}</p>
						{/if}
					</div>

					<!-- Team Stats -->
					<div class="flex justify-center space-x-6 text-sm text-gray-500">
						<div class="text-center">
							<div class="font-semibold text-gray-900">{team.members?.length || 0}</div>
							<div>Members</div>
						</div>
						{#if team.expand?.owner}
							<div class="text-center">
								<div class="font-semibold text-gray-900">{team.expand.owner.name}</div>
								<div>Owner</div>
							</div>
						{/if}
					</div>
				</div>
			{:else}
				<div class="text-center">
					<div
						class="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-300 text-2xl text-gray-500"
					>
						?
					</div>
					<h2 class="text-xl font-bold text-gray-900">Unknown Team</h2>
				</div>
			{/if}

			<!-- Invite Status -->
			{#if isAlreadyMember}
				<div class="rounded-md border border-green-200 bg-green-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-green-800">Already a Member</h3>
							<div class="mt-2 text-sm text-green-700">
								<p>You're already a member of this team!</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Go to Team Button -->
				<a
					href="/dash/teams/{team?.slug || team?.id}"
					class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Go to {team?.name || 'Team'}
				</a>
			{:else if isDisabled}
				<div class="rounded-md border border-red-200 bg-red-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Invitation Not Available</h3>
							<div class="mt-2 text-sm text-red-700">
								{#if isExpired}
									<p>This invitation has expired.</p>
								{:else if isUseLimitReached}
									<p>This invitation has reached its usage limit.</p>
								{:else if invite.disabled}
									<p>This invitation has been disabled.</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Invite Details -->
				<div class="rounded-md border border-blue-200 bg-blue-50 p-4">
					<div class="space-y-1 text-sm text-blue-700">
						{#if invite.uses === -1}
							<p>• Unlimited uses</p>
						{:else}
							<p>• {invite.uses - invite.joined.length} uses remaining</p>
						{/if}
						<p>• Expires: {new Date(invite.expiration).toLocaleDateString()}</p>
						{#if invite.joined.length > 0}
							<p>• {invite.joined.length} people already joined</p>
						{/if}
					</div>
				</div>

				<!-- Join Button -->
				<form
					method="POST"
					action="?/join"
					use:enhance={() => {
						isJoining = true;
						return async ({ result }) => {
							isJoining = false;
							if (result.type === 'redirect') {
								goto(result.location);
							}
						};
					}}
				>
					<input type="hidden" name="inviteId" value={invite.id} />
					<button
						type="submit"
						disabled={isJoining}
						class="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					>
						{#if isJoining}
							<svg
								class="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							Joining...
						{:else}
							Join {team?.name || 'Team'}
						{/if}
					</button>
				</form>
			{/if}

			<!-- Footer Links -->
			<div class="space-y-2 text-center text-sm text-gray-500">
				<p>Don't want to join? You can safely close this page.</p>
				<a href="/login" class="text-blue-600 hover:text-blue-500">
					Sign in to a different account
				</a>
			</div>
		</div>
	</div>
</div>
