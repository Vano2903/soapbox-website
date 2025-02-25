<script>
	import ModeDropDown from '$components/modeDropDown/modeDropDown.svelte';
	import Carousel from '$components/carousel/carousel.svelte';
	import Carousel2 from '$components/carousel/carousel2.svelte';
	import EventInfoBox from '$components/eventInfoBox/eventInfoBox.svelte';
	const { data } = $props();
	const event = data.NextRace;

	const achivements = [
		{ value: 136, over: 'trofei', under: 'consegnati' },
		{ value: 257, over: 'eventi', under: 'organizzati' },
		{ value: 19, over: 'cittá', under: 'visitate' }
	];
</script>

<main class="gap-2 pb-10">
	<div class="carousel">
		<!-- <Carousel /> -->
		<Carousel2 />
		<aside class="info-box">
			<div class="inner">
				<EventInfoBox {event} />
			</div>
		</aside>
	</div>
	<div class="px-4">
		<hr class="mb-3 h-1 w-auto rounded-sm border-0 bg-red-600" />
		<div class=" px-2">
			<p class="pb-10 text-5xl font-bold">
				Questa é <span class="text-red-600">ASD BOXRALLY</span>!
			</p>
			<div class="flex h-64 w-full justify-center pb-4">
				<div
					class="divide-h-1/2 border-sm grid h-52 w-2/3 grid-cols-3 content-center divide-x-3 divide-neutral-400 rounded-sm border-0 bg-neutral-300"
				>
					{#each achivements as achivement}
						<div class="flex flex-col content-center items-center justify-center">
							<span class="text-8xl">{achivement.value}</span>
							<span class="text-3xl font-bold text-red-600">{achivement.over}</span>
							<span class="text-3xl font-bold">{achivement.under}</span>
						</div>
					{/each}
				</div>
			</div>
			<p class="pb-10 text-justify">
				Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae tenetur explicabo odio
				illum, et rationebeatae ipsa eum. Quaerat aut exercitationem rem laudantium id corrupti
				libero blanditiis perspiciatis aspernatur esse. lorem ipsum dolor sit amet consectetur
				adipisicing elit. Quaerat aut exercitationem rem Lorem ipsum dolor sit amet consectetur
				adipisicing elit. Explicabo odio cupiditate labore optio quam quisquam temporibus rem id
				animi quibusdam placeat, ab corrupti porro obcaecati illum quos numquam, recusandae a! lorem
				ipsum dolor sit amet consectetur adipisicing elit. Quaerat aut exercitationem Lorem ipsum
				dolor sit amet consectetur adipisicing elit. Sit, quibusdam non sed magnam veritatis
				voluptate fuga impedit ipsa culpa labore ab repellat, fugiat debitis molestias unde qui
				soluta consequuntur rem!
			</p>
			<div class="flex justify-center">
				<a href="/chi-siamo" class="group text-3xl font-bold transition duration-300">
					Conoscici Meglio
					<span
						class="mx-1 block h-1 max-w-0 bg-red-600 transition-all duration-500 group-hover:max-w-full"
					></span>
				</a>
			</div>
		</div>
	</div>
</main>

<style>
	.carousel {
		overflow: hidden;
		display: flex;
		position: relative;
		justify-content: end;
		align-items: center;
	}

	.info-box {
		border-radius: 1rem 0 0 1rem;
		position: absolute;
		height: 75%;
		width: 25%;
		z-index: 20;
		padding: 0.5rem 0 0 0.5rem;
		box-sizing: border-box;
		background: white;
		padding-bottom: 1rem;
	}

	.inner {
		padding: 1rem;
		border-radius: 0.5rem 0 0 0;
		border-top: 4px solid red;
		border-left: 4px solid red;
		box-sizing: border-box;
		height: 100%;
		width: 100%;
	}

	main {
		display: flex;
		flex-direction: column;
	}
</style>
