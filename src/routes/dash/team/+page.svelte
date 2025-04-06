<script lang="ts">
	const team = {
		name: 'team name',
		id: 'team-1',
		owner: {
			id: '1'
		},
		members: [
			{
				id: '1',
				name: 'Mario',
				lastName: 'Rossi',
				nick: 'mario.rossi',
				role: 'admin'
			},
			{
				id: '2',
				name: 'Luigi',
				lastName: 'Verdi',
				nick: 'luigi.verdi',
				role: 'member'
			},
			{
				id: '3',
				name: 'Giovanni',
				lastName: 'Bianchi',
				nick: 'giovanni.bianchi',
				role: 'member'
			}
		]
	};
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
