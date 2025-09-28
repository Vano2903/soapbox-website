<script lang="ts">
	import { enhance } from '$app/forms';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const { invite, isAlreadyMember, team, user, code } = data;

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
			<h1 class="mb-2 text-3xl font-bold text-gray-900">Invito al Team</h1>
			<p class="text-gray-600">Sei stato invitato a unirti a questo team</p>
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
						{#if team.bio}
							<p class="mt-2 text-gray-600">{team.bio}</p>
						{/if}
					</div>

					<!-- Team Stats -->
					<div class="flex justify-center space-x-6 text-sm text-gray-500">
						<div class="text-center">
							<div class="font-semibold text-gray-900">{team.members?.length || 0}</div>
							<div>{team.members?.length === 1 ? 'Membro' : 'Membri'}</div>
						</div>
						{#if team.expand?.owner}
							<div class="text-center">
								<div class="font-semibold text-gray-900">{team.expand.owner.name}</div>
								<div>Proprietario</div>
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
					<h2 class="text-xl font-bold text-gray-900">Team sconosciuto</h2>
				</div>
			{/if}

			<!-- Invite Status -->
			{#if isAlreadyMember}
				<div class="rounded-md border border-green-200 bg-green-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-green-800">Già membro</h3>
							<div class="mt-2 text-sm text-green-700">
								<p>Sei già un membro di questo team!</p>
							</div>
						</div>
					</div>
				</div>

				<!-- Go to Team Button -->
				<a
					href={`/team/${team?.slug}/dash`}
					class="flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:outline-none"
				>
					Vai al pannello di controllo di {team?.name || 'Team'}
				</a>
			{:else if isDisabled}
				<div class="rounded-md border border-red-200 bg-red-50 p-4">
					<div class="flex">
						<div class="ml-3">
							<h3 class="text-sm font-medium text-red-800">Invito non disponibile</h3>
							<div class="mt-2 text-sm text-red-700">
								{#if isExpired}
									<p>Questo invito è scaduto.</p>
								{:else if isUseLimitReached}
									<p>Questo invito ha raggiunto il suo limite di utilizzo.</p>
								{:else if invite.disabled}
									<p>Questo invito è stato disabilitato.</p>
								{/if}
							</div>
						</div>
					</div>
				</div>
			{:else}
				<!-- Invite Details -->
				{#if invite.uses !== -1 || invite.expiration || invite.joined.length > 0}
					<div class="rounded-md border border-blue-200 bg-blue-50 p-4">
						<div class="space-y-1 text-sm text-blue-700">
							{#if invite.uses !== -1}
								<p>• {invite.uses - invite.joined.length} utilizzi rimanenti</p>
							{/if}
							{#if invite.expiration}
								<p>• Scade: {new Date(invite.expiration).toLocaleDateString()}</p>
							{/if}
							{#if invite.joined.length > 0}
								<p>• {invite.joined.length} persone hanno già aderito</p>
							{/if}
						</div>
					</div>
				{/if}

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
						class=" flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
							Adesione...
						{:else}
							Entra a far parte di {team?.name || 'Team'}
						{/if}
					</button>
				</form>
			{/if}

			<!-- Footer Links -->
			<div class="space-y-2 text-center text-sm text-gray-500">
				<p>Non vuoi unirti? Puoi chiudere questa pagina.</p>
				<a href={`/login?redirectTo=/join/${code}`} class="text-blue-600 hover:text-blue-500">
					Fai login con un altro account
				</a>
			</div>
		</div>
	</div>
</div>
