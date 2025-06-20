<script lang="ts">
	const { data } = $props();
	const team = data.teams;
</script>

la pagina del tuo team

<button class="btn">Crea un nuovo team</button>
<button class="btn">Entra a far parte di un nuovo team</button>
<button class="btn">lascia il team</button>
<button class="btn">elimina team</button>
<button class="btn">trasferisci la proprietà del team</button>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>Nome</th>
				<th>Ruolo</th>
				<th>Azioni</th>
			</tr>
		</thead>
		<tbody>
			{#each team.members as member}
				<tr>
					<td>{member.name} {member.lastName}</td>
					<td>{member.role}</td>
					<td>
						<button class="btn btn-info">Modifica</button>
						<button class="btn btn-error">Rimuovi</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
<div class="divider"></div>
