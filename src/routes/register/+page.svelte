<script lang="ts"></script>

<div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-sm">
		<!-- <img
			class="mx-auto h-10 w-auto"
			src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=red&shade=600"
			alt="Your Company"
		/> -->
		<h2 class="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
			Crea il tuo nuovo account pilota
		</h2>
	</div>

	<div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
		<form class="space-y-6" action="#" method="POST">
			<div>
				<label for="fullName" class="block text-sm/6 font-medium text-gray-900">Nome Completo</label
				>
				<div class="mt-2">
					<input
						type="text"
						name="fullName"
						id="fulleName"
						autocomplete="name"
						required
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm/6 font-medium text-gray-900">Password</label>
				</div>
				<div class="mt-2">
					<input
						type="password"
						name="password"
						id="password"
						required
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<div class="flex items-center justify-between">
					<label for="password" class="block text-sm/6 font-medium text-gray-900"
						>Conferma la Password</label
					>
				</div>
				<div class="mt-2">
					<input
						type="password"
						name="confirmPassword"
						id="confirmPassowrd"
						required
						class="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-red-600 sm:text-sm/6"
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					class="flex w-full justify-center rounded-md bg-red-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
					>Sign in</button
				>
			</div>
		</form>
		<hr class="my-6 border-gray-300" />

		

		<p class="mt-10 text-center text-sm/6 text-gray-500">
			Hai già un account?
			<a href="/login" class="font-semibold text-red-600 hover:text-red-500"
				>Vai alla pagina di Login</a
			>
		</p>
	</div>
</div>

<style>
	input[type='text'],
	input[type='password'] {
		width: 100%;
	}
</style>
