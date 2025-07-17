<script lang="ts">
	import { onMount } from 'svelte';
	import 'leaflet/dist/leaflet.css';
	import type { Map } from 'leaflet';

	let map: Map;

	onMount(async () => {
		const L = await import('leaflet');

		map = L.map('map');

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
			attribution: '&copy; OpenStreetMap contributors'
		}).addTo(map);

		const locations = [
			{ name: 'Nembro', coords: [45.7439737, 9.7592752] },
			{ name: 'Bergamo', coords: [45.70124, 9.66302] },
			{ name: 'Leffe', coords: [45.87019, 9.87466] },
			{ name: 'Chiuduno', coords: [45.6935, 9.9047] },
			{ name: "Villa d'Adda", coords: [45.7150185, 9.4628333] },
			{ name: 'Valbondione', coords: [45.9667, 9.9] },
			{ name: 'Premolo', coords: [45.87019, 9.87466] },
			{ name: 'Bossico', coords: [45.828388, 10.045059] },
			{ name: 'Vilminore di Scalve', coords: [45.9269, 10.1358] },
			{ name: 'Palazzago', coords: [45.7636, 9.553] },
			{ name: 'Peia', coords: [45.7744, 9.7895] }
		];

		const group = L.featureGroup(
			locations.map((loc) => L.marker(loc.coords).bindPopup(loc.name))
		).addTo(map);

		map.fitBounds(group.getBounds().pad(0.1));
	});
</script>

<main>
	<div id="map"></div>
</main>

<style>
	#map {
		height: 400px;
		width: 100%;
	}
</style>
