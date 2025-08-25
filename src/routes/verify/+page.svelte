<main class="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
	<div class="w-full max-w-md">
		<div class="rounded-xl bg-white p-8 text-center shadow-lg">
			<!-- Header -->
			<div class="mb-6">
				<div
					class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-600"
				>
					<svg class="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
						></path>
					</svg>
				</div>
				<h1 class="mb-2 text-3xl font-bold text-gray-900">
					Verifica la tua <span class="text-red-600">email</span>
				</h1>
				<hr class="mx-auto mb-4 h-1 w-20 rounded-sm border-0 bg-red-600" />
			</div>

			<!-- Content -->
			<div class="mb-8">
				<p class="mb-6 text-base leading-relaxed text-gray-600">
					Vai nella tua posta elettronica e clicca sul link per verificare la mail. Quando hai
					completato la verifica, clicca sul pulsante qui sotto per continuare.
				</p>

				<div class="mb-6 rounded-lg bg-neutral-100 p-4">
					<p class="text-sm text-gray-500">
						💡 Non hai ricevuto l'email? Controlla nella cartella spam o nelle promozioni.
					</p>
				</div>
			</div>

			<!-- Action Button -->
			<div class="space-y-4">
				<a
					class="btn btn-error w-full rounded-lg py-3 text-lg font-semibold text-white transition-all duration-200 hover:shadow-lg"
					href="/onboarding"
				>
					Completa la registrazione
				</a>

				<p class="text-xs text-gray-400">
					Hai problemi? <a href="/register" class="text-red-600 hover:underline"
						>Registrati di nuovo</a
					>
				</p>
			</div>
		</div>

		<!-- Background decoration -->
		<div class="absolute top-1/4 left-1/4 -z-10 h-32 w-32 rounded-full bg-red-100 opacity-20"></div>
		<div
			class="absolute right-1/4 bottom-1/4 -z-10 h-24 w-24 rounded-full bg-red-200 opacity-30"
		></div>
	</div>
</main>
