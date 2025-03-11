<script lang="ts">
	const { data } = $props();
	const { user } = data;
	const { countryPhoneCodes } = data;

	let name = $state(user.name.split(' ').slice(0, -1).join(' '));
	let surname = $state(user.name.split(' ').slice(-1).join(' '));

	let fiscalCode = $state('');
	let phone = $state('');

	let prefixes = $state(countryPhoneCodes);

	let nick = $state('');
	$effect(() => {
		nick.replaceAll(' ', '-');
	});
</script>

<main>
	<h1>Onboarding</h1>
	<p>This is the onboarding page</p>
	<form action="">
		<input type="text" placeholder="Nome" />
		<input type="text" placeholder="Cognome" />

		<button type="submit">Submit</button>
	</form>
</main>

<style></style>
