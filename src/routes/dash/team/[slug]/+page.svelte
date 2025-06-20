<script lang="ts">
	const { data } = $props();
	const { slug, team } = data;
</script>

<div class="p-2">
	questa è la pagina del team con slug {slug}

	la pagina del tuo team

	<div class="mx-3 my-3 grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
		<button class="btn">Crea un nuovo team</button>
		<button class="btn">Entra a far parte di un nuovo team</button>
		<button class="btn">lascia il team</button>
		<button class="btn">elimina team</button>
		<button class="btn">trasferisci la proprietà del team</button>
	</div>
	<div class="overflow-x-auto">
		<div class="flex justify-center">
			<div class="w-1/2">
				<div>
					<h1 class="flex justify-center text-3xl">Membri</h1>
				</div>
				<table class="table">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Azioni</th>
						</tr>
					</thead>
					<tbody>
						{#each team.expand.members as member}
							<tr>
								<td>{member.name} {member.lastName}</td>
								<!-- <td>{member.role}</td> -->
								<td>
									<button class="btn btn-info">Modifica</button>
									<button class="btn btn-error">Rimuovi</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
	<div class="divider"></div>
	<div class="overflow-x-auto">
		<div class="flex justify-center">
			<div class="w-1/2">
				<div>
					<h1 class="flex justify-center text-3xl">Inviti</h1>
				</div>
				<table class="table">
					<thead>
						<tr>
							<th>Nome</th>
							<th>Azioni</th>
						</tr>
					</thead>
					<tbody>
						{#each team.expand.members as member}
							<tr>
								<td>{member.name} {member.lastName}</td>
								<!-- <td>{member.role}</td> -->
								<td>
									<button class="btn btn-info">Modifica</button>
									<button class="btn btn-error">Rimuovi</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>
</div>
