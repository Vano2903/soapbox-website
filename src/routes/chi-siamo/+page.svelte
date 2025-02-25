<script lang="ts">
	const sections = [
		{
			header: 'La Nostra Passione',
			content:
				'Siamo appassionati costruttori di Soap-Box: veicoli senza motore in legno, nati da un regolamento tecnico di 50 anni fa. Ogni mezzo è unico, frutto di teorie strampalate su aerodinamica e velocità, realizzato con materiali semplici e tanta inventiva. Non siamo professionisti, ma miglioriamo le nostre creazioni gara dopo gara, trasformando libri maltrattati da studenti in ispirazione. L’adrenalina della discesa si unisce alla gioia di progettare opere in continua evoluzione.',
			image: '/images/chi-siamo/soapbox.jpg',
			alt: 'macchine soapbox'
		},
		{
			header: 'La Corsa che Ci Unisce',
			content:
				'La gara storica sulle Mura di Bergamo Alta è il nostro palcoscenico dal 1955. Qui sfidiamo la gravità a 80 km/h, davanti a 20.000 spettatori, competendo per due trofei: velocità e originalità. Coreografie spettacolari, materiali stravaganti e un mix tra arte e follia ci spingono a dare il massimo. È un’emozione che fa tremare le ginocchia, ma quando parte la discesa, l’energia del pubblico ci trasforma in protagonisti di un’opera collettiva.',
			image: '/images/chi-siamo/race.jpeg',
			alt: 'discesa di bergamo con macchina'
		},
		{
			header: 'Lo Spettacolo Continua',
			content:
				'Curve? Tornanti? Per noi è solo l’inizio! Aggiungiamo scalinate in pietra, salti mozzafiato, vasche d’acqua e tunnel di schiuma. Ogni ostacolo mette alla prova veicoli e abilità, regalando colpi di scena al pubblico. Le rotture sono frequenti, ma anche quelle fanno ridere e uniscono: non c’è tifo avverso, solo incitamenti per tutti. Che sia su pavè o in percorsi "di guerra", ogni gara è una festa dove l’imprevisto diventa leggenda.',
			image: '/images/chi-siamo/jump.jpeg',
			alt: 'macchina salta tra la schiuma'
		},
		{
			header: 'Una Squadra con un Sogno',
			content:
				'Siamo quattro amici (Scheggia, Max, Gio e Pier) decisi a rilanciare questo sport. Organizziamo gare in tutta la provincia, collaborando con comuni e Pro Loco, e abbiamo rispolverato il campionato con coppe simboliche e zero agonismi. Il sito e i social sono il nostro diario di bordo: foto, consigli tecnici e un forum vivace. Cerchiamo nuovi alleati per crescere, perché per noi l’obiettivo è uno solo: divertirsi come ragazzini, oggi e per altri 50 anni.',
			image: 'images/chi-siamo/persone.jpeg',
			alt: 'foto di gruppo degli organizzatori'
		}
	];
</script>

<main class="px-20 pb-16">
	<header class="flex flex-col items-center space-y-2 pt-14 pb-20">
		<span class="text-5xl font-bold"> Chi siamo </span>
		<p class="text-gray-500">Lorem ipsum dolor sit amet</p>
	</header>
	<div class="space-y-16">
		{#each sections as section, i}
			<section class="flex {i % 2 === 0 ? `flex-row` : `flex-row-reverse`}">
				<div class="{i % 2 === 0 ? `pr-8` : `pl-8`} w-1/2 pt-4">
					<h1 class="pb-8 text-3xl font-bold">{section.header}</h1>
					<p class="text-base">{section.content}</p>
				</div>
				<img loading="lazy" class="w-1/2 object-cover" src={section.image} alt={section.alt} />
			</section>
		{/each}
	</div>
</main>

<style>
</style>
