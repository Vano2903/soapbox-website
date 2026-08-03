<script lang="ts">
	import Map from './../../lib/components/ui/map/map.svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { enrollSchema } from '$lib/schemas/enrollSchema';
	import ContextualHelp from '$components/contextualHelp/contextualHelp.svelte';
	import { CircleQuestionMark } from '@lucide/svelte';

	// retrieve the data from the props
	const { data } = $props();
	const foundChampionshipDerived = $derived(data.foundChampionship);
	const foundEventDerived = $derived(data.foundEvent);
	const teams = $derived(data.userTeams);
	const isAlreadyEnrolled = $derived(data.isAlreadyEnrolled);
	const contextualHelps = $derived(data.contextualHelps);

	// Setup the form
	const { form, errors, message, constraints, enhance } = superForm(data.form, {
		dataType: 'json',
		validators: zod(enrollSchema)
	});

	let selectedTeam = $derived(
		teams.find((team) => {
			return team.id === $form.teamId;
		})
	);
	let teamMembers = $derived(selectedTeam?.expand?.members || []);
	let minDrivers = $derived($form.category === 'SoapBox' ? 2 : 1);
	let maxDrivers = $derived($form.category === 'SoapBox' ? 4 : 2);
	let driversWarning = $derived(
		$form.drivers &&
			(($form.category === 'SoapBox' && $form.drivers.length > 4) ||
				($form.category === 'Drift Trike' && $form.drivers.length > 2))
	);

	$effect(() => {
		$form.teamAlias = selectedTeam?.name ?? '';
	});

	// const {
	// 	delayed,
	// 	submit: submitCheckConfirm,
	// 	enhance: submitEnhance
	// } = superForm({
	// 	invalidateAll: false,
	// 	applyAction: false,
	// 	multipleSubmits: 'abort',
	// 	onSubmit({ cancel }) {
	// 		if (!$form.confirm) cancel();
	// 	},
	// 	onUpdated({ form }) {
	// 		$errors.confirm = form.errors.confirm;
	// 	}
	// });
</script>

<main class="mx-auto max-w-2xl px-4 py-8">
	<h1 class="text-primary xs:text-3xl mb-8 text-center text-xl font-bold">
		Iscrivi un team all'evento:<br /><span class="text-black">{foundEventDerived?.name}</span>
	</h1>

	{#if isAlreadyEnrolled}
		<div role="alert" class="alert alert-success alert-soft">
			<p>Il team è già iscritto a questo evento.</p>
		</div>
	{:else}
		<form method="POST" class="flex flex-col space-y-8" use:enhance action="?/enroll">
			<input type="hidden" name="eventId" value={$form.eventId} />

			<!-- Team Selection -->
			{#if teams.length > 1}
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">Seleziona il team da iscrivere</legend>
					<select
						bind:value={$form.teamId}
						class="select w-full"
						class:select-error={$errors.teamId}
						aria-invalid={$errors.teamId ? 'true' : undefined}
						name="teamId"
					>
						<option value="" disabled selected>Seleziona un team</option>
						{#each teams as team}
							<option value={team.id}>{team.name} ({team.slug})</option>
						{/each}
					</select>
					{#if $errors.teamId}
						<p class="fieldset-label text-error alert-soft">{$errors.teamId}</p>
					{/if}
				</fieldset>
			{:else}
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">Il team selezionato è</legend>
					<input type="text" disabled value="{teams[0]?.name} ({teams[0]?.slug})" />
					<input type="hidden" name="teamId" value={teams[0]?.id} />
				</fieldset>
			{/if}

			<hr class="mx-auto w-4/5" />

			{#if $form.teamId}
				<!-- Category Selection -->
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">Seleziona la categoria</legend>
					<div class="flex gap-4">
						<label class="label cursor-pointer gap-2">
							<input
								type="radio"
								name="category"
								value="SoapBox"
								bind:group={$form.category}
								class="radio"
								class:radio-error={$errors.category}
							/>
							<span class="label-text">SoapBox</span>
						</label>
						<label class="label cursor-pointer gap-2">
							<input
								type="radio"
								name="category"
								value="Drift Trike"
								bind:group={$form.category}
								class="radio"
								class:radio-error={$errors.category}
							/>
							<span class="label-text">Drift Trike</span>
						</label>
					</div>
					{#if $errors.category}
						<p class="fieldset-label text-error">{$errors.category}</p>
					{/if}
				</fieldset>

				<!-- Participants Selection -->
				<fieldset class="fieldset flex-1 text-base">
					<legend class="fieldset-legend">
						Seleziona i partecipanti <span class="text-sm text-gray-600">({minDrivers} minimo)</span
						>
					</legend>
					{#if teamMembers.length > 0}
						<div class="flex flex-col gap-2">
							{#each teamMembers as member}
								<label class="label cursor-pointer justify-start gap-2">
									<input
										type="checkbox"
										name="drivers"
										value={member.id}
										bind:group={$form.drivers}
										class="checkbox"
										class:checkbox-error={$errors.drivers}
									/>
									<span class="label-text">
										{member.name}
										{member.lastName}
									</span>
								</label>
							{/each}
						</div>
					{:else}
						<p class="text-warning alert-soft">Nessun membro del team selezionabile</p>
					{/if}

					{#if $errors.drivers}
						<p class="fieldset-label text-error alert-soft">
							{$errors.drivers._errors?.join(', ')}
						</p>
					{/if}

					{#if driversWarning}
						<p class="fieldset-label text-warning alert-soft">
							Attenzione: per la categoria {$form.category} si consigliano al massimo {maxDrivers}
							partecipanti
						</p>
					{/if}
				</fieldset>

				<!-- Team Alias -->
				<fieldset class="fieldset flex-1 text-base">
					<div class="flex items-center gap-2">
						<legend class="fieldset-legend">Nome del team per questo evento</legend>
						<ContextualHelp contextualHelp={contextualHelps.enroll_teamAliasField}>
							{#snippet iconSnippet()}
								<CircleQuestionMark class="h-4 w-4 text-gray-600" />
							{/snippet}
						</ContextualHelp>
					</div>
					<input
						{...$constraints.teamAlias}
						bind:value={$form.teamAlias}
						class="input w-full"
						class:input-error={$errors.teamAlias}
						aria-invalid={$errors.teamAlias ? 'true' : undefined}
						type="text"
						name="teamAlias"
						placeholder="Nome del team per l'evento"
					/>
					{#if $errors.teamAlias}
						<p class="fieldset-label text-error alert-soft">{$errors.teamAlias}</p>
					{/if}
				</fieldset>

				<!-- Terms Acceptance -->
				<fieldset class="fieldset flex-1 text-base">
					<div class="flex gap-2">
						<input
							type="checkbox"
							bind:checked={$form.confirmTerms}
							class="checkbox"
							class:checkbox-error={$errors.confirmTerms}
							aria-invalid={$errors.confirmTerms ? 'true' : undefined}
							name="confirmTerms"
							id="confirmTerms"
						/>
						<label for="confirmTerms" class="label-text cursor-pointer">
							Ho letto e accetto <a
								class="text-gray-600 underline hover:text-red-600"
								href="/documents/waiver-of-liability.pdf"
								target="_blank">la liberatoria per la partecipazione</a
							> all'evento
						</label>
					</div>
					{#if $errors.confirmTerms}
						<p class="fieldset-label text-error alert-soft">{$errors.confirmTerms}</p>
					{/if}
					<p class="text-xs text-gray-600 italic">
						In caso di partecipanti minorenni, la liberatoria deve essere letta e confermata dal
						genitore/tutore legale.
					</p>
				</fieldset>

				<!-- Submit Button -->
				<button
					type="submit"
					class="btn btn-primary w-full"
					disabled={!$form.teamId ||
						!$form.category ||
						!($form.drivers?.length >= minDrivers) ||
						!$form.confirmTerms}
				>
					Iscrivi il team
				</button>
			{/if}

			<!-- Success/Error Messages -->
			{#if $message}
				<div
					class="alert alert-soft"
					class:alert-success={$message.type === 'success'}
					class:alert-error={$message.type === 'error'}
				>
					{$message.text}
				</div>
			{/if}
		</form>
	{/if}
</main>

<style>
	a {
		transition: color 0.25s ease;
		cursor: pointer;
	}
	.disabled-input {
		border-color: var(--color-base-200);
		background-color: var(--color-base-200);
		color: var(--color-base-content/40);
		&::placeholder {
			color: var(--color-base-content/20);
		}
		cursor: not-allowed;
		box-shadow: none;
	}
</style>
