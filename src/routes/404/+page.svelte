<script lang="ts">
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let raceCarPosition = $state(0);
	let isAnimating = $state(false);

	onMount(() => {
		// Animate the race car across the screen
		const interval = setInterval(() => {
			raceCarPosition = (raceCarPosition + 1) % 100;
		}, 50);

		return () => clearInterval(interval);
	});

	function goHome() {
		isAnimating = true;
		setTimeout(() => {
			goto('/');
		}, 500);
	}
</script>

<svelte:head>
	<title>404 - Off Track! | Brum</title>
	<meta
		name="description"
		content="Looks like you've gone off the racing track! Let's get you back on course."
	/>
</svelte:head>

<div
	class="relative min-h-screen overflow-hidden bg-gradient-to-b from-sky-300 via-sky-200 to-green-300"
>
	<!-- Racing Track Background -->
	<div class="absolute inset-0 z-0">
		<!-- Sky and clouds -->
		<div class="absolute top-10 left-20 h-8 w-16 rounded-full bg-white opacity-70"></div>
		<div class="absolute top-16 right-32 h-10 w-20 rounded-full bg-white opacity-60"></div>
		<div
			class="absolute top-8 left-1/2 h-12 w-24 -translate-x-1/2 rounded-full bg-white opacity-50"
		></div>

		<!-- Grass/sides -->
		<div class="absolute bottom-32 h-20 w-full bg-green-400"></div>

		<!-- Racing track -->
		<div class="absolute bottom-0 h-32 w-full bg-gray-800">
			<!-- Center yellow lines -->
			<div class="absolute top-1/2 right-0 left-0 h-1 -translate-y-1/2 bg-yellow-400"></div>

			<!-- Animated dashed lines -->
			<div
				class="absolute top-1/2 right-0 left-0 flex -translate-y-1/2 items-center justify-around"
			>
				{#each Array(12) as _, i}
					<div
						class="h-2 w-8 animate-pulse rounded bg-yellow-400"
						style="animation-delay: {i * 0.1}s; animation-duration: 1.5s;"
					></div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Main Content -->
	<div class="relative z-10 flex min-h-screen items-center justify-center px-4">
		<div class="max-w-2xl space-y-8 text-center">
			<!-- Animated Race Car -->
			<div class="relative mb-12">
				<div
					class="text-6xl transition-transform duration-500"
					style="transform: translateX({raceCarPosition * 3}px) {raceCarPosition > 80
						? 'rotate(15deg)'
						: 'rotate(0deg)'}"
				>
					🏎️
				</div>
				<div class="mt-2 text-2xl">💨💨💨</div>
			</div>

			<!-- 404 Display -->
			<div class="space-y-4">
				<h1 class="text-8xl font-bold tracking-wider text-gray-800 drop-shadow-lg">
					<span class="text-red-500">4</span><span class="text-yellow-500">0</span><span
						class="text-blue-500">4</span
					>
				</h1>
				<div class="text-2xl font-semibold text-gray-700">WHOOPS! YOU'VE GONE OFF TRACK!</div>
			</div>

			<!-- Racing-themed message -->
			<div class="space-y-4 text-gray-600">
				<p class="text-lg">🏁 Looks like you took a wrong turn at the last checkpoint!</p>
				<p class="text-base">
					The page you're looking for has crashed out of the race, but don't worry - we'll get you
					back on the winning track!
				</p>
			</div>

			<!-- Racing Stats/Info -->
			<div class="rounded-lg border-2 border-gray-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
				<div class="grid grid-cols-1 gap-4 text-center md:grid-cols-3">
					<div class="space-y-1">
						<div class="text-2xl">🏆</div>
						<div class="text-sm text-gray-600">Race Position</div>
						<div class="font-bold text-red-500">DNF</div>
					</div>
					<div class="space-y-1">
						<div class="text-2xl">⏱️</div>
						<div class="text-sm text-gray-600">Lap Time</div>
						<div class="font-bold text-gray-700">404.00s</div>
					</div>
					<div class="space-y-1">
						<div class="text-2xl">🔧</div>
						<div class="text-sm text-gray-600">Status</div>
						<div class="font-bold text-yellow-600">Off Track</div>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="space-y-4">
				<button
					onclick={goHome}
					disabled={isAnimating}
					class="inline-flex transform items-center space-x-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-8 py-4 text-lg font-bold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 disabled:cursor-not-allowed disabled:opacity-50"
				>
					<span>🏠</span>
					<span>{isAnimating ? 'Racing Home...' : 'Return to Pit Stop'}</span>
				</button>

				<div class="flex flex-col justify-center gap-4 sm:flex-row">
					<a
						href="/dash"
						class="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-blue-600 hover:to-blue-700"
					>
						<span>🏁</span>
						<span>Go to Dashboard</span>
					</a>

					<button
						onclick={() => window.history.back()}
						class="inline-flex items-center space-x-2 rounded-full bg-gradient-to-r from-gray-500 to-gray-600 px-6 py-3 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:from-gray-600 hover:to-gray-700"
					>
						<span>↩️</span>
						<span>Back to Track</span>
					</button>
				</div>
			</div>

			<!-- Racing Tips -->
			<div class="rounded-r-lg border-l-4 border-yellow-500 bg-yellow-100 p-4">
				<div class="flex items-start">
					<div class="mr-3 text-2xl">💡</div>
					<div class="text-left">
						<h3 class="font-semibold text-yellow-800">Racing Tip:</h3>
						<p class="mt-1 text-sm text-yellow-700">
							Always check your route before hitting the gas! Double-check those URLs next time,
							champ.
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Racing Flags Animation -->
	<div class="absolute top-20 right-10 space-y-2">
		<div class="bg-checkered animate-wave h-12 w-8 bg-gradient-to-r from-black to-white"></div>
		<div class="bg-brown-600 h-16 w-1"></div>
	</div>
</div>

<style>
	@keyframes wave {
		0%,
		100% {
			transform: rotate(0deg);
		}
		50% {
			transform: rotate(10deg);
		}
	}

	.animate-wave {
		animation: wave 2s ease-in-out infinite;
	}

	.bg-checkered {
		background-image:
			linear-gradient(45deg, #000 25%, transparent 25%),
			linear-gradient(-45deg, #000 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #000 75%),
			linear-gradient(-45deg, transparent 75%, #000 75%);
		background-size: 8px 8px;
		background-position:
			0 0,
			0 4px,
			4px -4px,
			-4px 0px;
	}
</style>
