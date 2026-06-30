<script lang="ts">
	import EntityCard from '$components/entityCard/entityCard.svelte';
	import type { Team } from '$types/pocketbase/team.js';
	import { type UserNonExpand } from '$types/pocketbase/user.js';
	import { Crown } from 'lucide-svelte';

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

	const { data } = $props();
	// const teamsCount = data.teamsCount;
	// onMount(async () => {
	// 	console.log('teams', teams);
	// });

	// 	console.log('subscribed to teams');
	// 	pb.collection('teams').subscribe('*', (e) => {
	// 		console.log('Team event:', e);
	// 	});
	// });
	let user = $state(data.user);
	let teams = $state(data.teams);
</script>

<div class="px-6 py-2">
	<div class=" flex h-full w-full flex-col-reverse md:flex-row">
		<div class="w-full md:max-w-1/2">
			<div>
				<div class="h-2xl line-clamp-3 w-full">
					{#if user.bannerCropped}
						<img src={user.bannerCropped} alt="banner" class="h-full w-full object-fill" />
					{:else}
						<div class="h-48 w-full bg-blue-400"></div>
					{/if}
				</div>

				<div class="flex w-full items-center justify-center space-x-5 pb-8">
					<div class="mt-[-4rem] mb-4 size-24 rounded-full bg-gray-200 md:size-32 lg:mt-[-6rem]">
						<div class="avatar">
							<div class="size-24 rounded-full ring-1 ring-black md:size-32">
								<img src={user.avatarCropped} alt="User Avatar" />
							</div>
						</div>
					</div>
				</div>
				<div class="mt-[-2rem]">
					<h2 class="text-xl font-bold md:text-2xl lg:text-4xl">{user.name} {user.lastName}</h2>
					<a
						href={'/user/' + user.nick}
						target="_blank"
						class="text-normal ml-2 font-semibold text-red-600 md:text-lg lg:text-2xl"
					>
						@{user.nick}
					</a>
				</div>

				<div class="mt-4 w-full">
					<p class="text-normal text-gray-600 md:text-lg">{user.bio}</p>
				</div>
			</div>
			<div class="divider"></div>
			<button
				class="btn my-4 w-full bg-gray-100"
				onclick={() => {
					window.location.href = '/settings';
				}}>Modifica Profilo</button
			>
		</div>

		<div class="divider md:divider-horizontal"></div>

		<div class="w-full">
			<!-- notizie -->
			<!--
			<div class="flex w-full flex-col items-start justify-between">
				<p class="mt-4 text-xl font-bold md:text-3xl">NOTIZIE:</p>
				<p class="mt-2 text-gray-600">Non ci sono notizie al momento.</p>
			</div>
			-->

			<!--
				Sono costretto a fare il check con la stringa e non con UserVisiblityKind.Private perché il file del db è stato modificato eccessivamente e non trova più il tipo sbagliato.
				Evidentemente tra una modifica e l'altra mi ero già accorto di qualche errore ed è stato fatto uno step intermedio. Ora però mi ritrovo questa feature vincolata a tutte le modifiche strutturali delle pagine utente, che invece devono ancora essere completate.
				Rilascio questa feature con controllo "sporco" per non bloccare il lavoro, ma una volta aggiornato il db e le pagine utente, bisognerà fare un style per sistemare la user visibility di questo controllo.
			-->
			{#if user.visibility == "private"}
			<div class="flex w-full flex-col items-start justify-between">
				<p class="mt-4 text-xl font-bold md:text-3xl">INFORMAZIONI:</p>
					<div class="mt-2 block w-full">
						<div class="rounded-lg bg-gray-200 p-4 transition-colors group-hover:bg-gray-300">
							<div class="flex items-center space-x-3">
								<div class="shrink-0">
									<img src="/images/icons/eye-off.png" alt="Team Logo" class="size-16 rounded-full ring-1" />
								</div>
								<div class="min-w-0 flex-1">
									<div class="min-w-0">
										<div class="flex min-w-0 items-center space-x-2">
											<div class="min-w-0 flex-1">
												<div class="flex items-center space-x-2">
													<p class="text-lg font-bold transition duration-300">
														Visibilità del profilo
													</p>
												</div>
											</div>
										</div>
									</div>
									<p class="mt-1 text-sm text-gray-700"><span class="font-semibold">Hai impostato il tuo profilo come privato: il tuo profilo non sarà visibile a nessun utente in nessuna sezione del sito.</span><br>Nonostante ciò, tutte le funzionalità, come lapartecipazione a team, le iscrizioni ad eventi, ecc. saranno fruibili correttamente.</p>
								</div>
							</div>
						</div>
					</div>
			</div>
			<div class="divider"></div>
			{/if}
			<div>
				<div class="flex w-full flex-col items-start justify-between">
					<p class="mt-4 mb-2 text-xl font-bold md:text-3xl">TEAMS:</p>
					{#if teams.length == 0}
						<p class="mt-4 text-lg font-semibold">Non fai parte di nessun team</p>
					{/if}
					<div class="w-full space-y-2">
						{#each teams as team}
							<EntityCard
								title={team.name}
								description={team.bio}
								slug={team.slug}
								link={'/team/' + team.slug + '/dash'}
							>
								{#snippet picture()}
									<img src={team.logoCropped} alt="Team Logo" class="size-16 rounded-full ring-1" />
								{/snippet}
								{#snippet iconSnippet()}
									{#if team.owner == user.person}
										<Crown class="text-yellow-500" size={16} />
									{/if}
								{/snippet}
								<!-- {#snippet actionButtons()}
							<a href={'/team/' + team.slug + '/dash'} class="btn btn-primary">Dashboard</a>
						{/snippet} -->
							</EntityCard>
						{/each}
					</div>
				</div>
				<!-- <button class="btn btn-primary just mt-2 flex flex-nowrap items-center"> -->
				<a
					class="btn btn-primary just mt-2 flex max-w-32 flex-nowrap items-center"
					href={`/user/${user.nick}/dash/team/new`}>Creane Uno</a
				>
				<!-- </button> -->
			</div>

			<!-- {#if teamsCount == 1}
				<a class="btn" href="/dash/team">Visualizza il tuo team</a>
			{:else if teamsCount > 1}
				<p class="my-4">Hai {teamsCount} teams:</p>
				<a class="btn" href="/dash/team">Visualizza i tuoi teams</a>
			{:else}
				<p class="my-4">Non fai parte di nessun team.</p>
				<a class="btn" href="/dash/team/new">Crea un nuovo team</a>
				<button class="btn">Entra a far parte di un nuovo team</button>
			{/if} -->
		</div>
	</div>

	<!-- <button onclick={logout} class="btn btn-info my-4"> logout </button> -->
</div>
