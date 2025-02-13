<script lang="ts">
	let mainMenu = $state(false);
	let userMenu = $state(false);
</script>

<nav class="bg-red-600">
	<div class="px-2 sm:pr-6 sm:pl-0 lg:pr-8">
		<div class="relative flex h-16 items-center justify-between">
			<div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
				<!-- <div class="flex shrink-0 items-center">
					<img class="h-8 w-auto" src="/images/navbar/logo.jpg" alt="ASD Box Rally" />
				</div> -->
				<a class="mb-2 flex items-center bg-white" href="/">
					<!-- class="mb-2 flex flex-nowrap items-center bg-white leading-none md:pr-[2rem] lg:pr-[5rem]" -->
					<img
						class="h-14 md:pr-2 lg:h-14"
						src="/images/navbar/logo.jpg"
						alt="Logo ASD box rally"
					/>
					<span
						class="hidden h-12 items-end pb-1 text-base/6 whitespace-nowrap text-red-600 md:flex"
					>
						<span class="text-4xl font-extrabold lg:text-5xl">ASD</span>&nbsp;&nbsp;
						<span class="hidden text-3xl font-bold lg:block"
							><span class="text-5xl">B</span>OXRALLY</span
						>
					</span>
				</a>
				<div
					class=" border-t-[4rem] border-r-30 border-b-0 border-l-0 border-solid border-t-white border-r-transparent border-b-transparent border-l-transparent lg:border-t-[4rem]"
				></div>
				<div class="hidden sm:ml-6 sm:block">
					<div class="flex space-x-4">
						<!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" -->
						<!-- <a
							href="#"
							class="rounded-md bg-red-900 px-3 py-2 text-sm font-medium text-white"
							aria-current="page">Dashboard</a
						> -->
						<a
							href="#"
							class="text-bold rounded-md px-3 py-2 text-2xl font-medium text-white hover:bg-red-700 hover:text-white"
							>Chi Siamo</a
						>
						<a
							href="#"
							class="text-bold rounded-md px-3 py-2 text-2xl font-medium text-white hover:bg-red-700 hover:text-white"
							>Campionati</a
						>
						<a
							href="#"
							class="text-bold rounded-md px-3 py-2 text-2xl font-medium text-white hover:bg-red-700 hover:text-white"
							>Galleria</a
						>
					</div>
				</div>
			</div>
			<div
				class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0"
			>
				<!-- <button
					type="button"
					class="relative rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800 focus:outline-hidden"
				>
					<span class="absolute -inset-1.5"></span>
					<span class="sr-only">View notifications</span>
					<svg
						class="size-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						aria-hidden="true"
						data-slot="icon"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
						/>
					</svg>
				</button> -->

				<!-- Profile dropdown -->
				<!-- Mobile menu button-->
				<div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
					<button
						type="button"
						class="relative inline-flex items-center justify-center rounded-md p-2 text-white hover:bg-red-800 hover:text-white focus:ring-2 focus:ring-white focus:outline-hidden focus:ring-inset"
						aria-controls="mobile-menu"
						aria-expanded={mainMenu ? 'true' : 'false'}
						onclick={() => {
							document.getElementById('mobile-menu')?.classList.toggle('hidden');
						}}
					>
						<span class="absolute -inset-0.5"></span>
						<span class="sr-only">Open main menu</span>
						<!--
			  Icon when menu is closed.
  
			  Menu open: "hidden", Menu closed: "block"
			-->
						<svg
							class="block size-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
							/>
						</svg>
						<!--
			  Icon when menu is open.
  
			  Menu open: "block", Menu closed: "hidden"
			-->
						<svg
							class="hidden size-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke-width="1.5"
							stroke="currentColor"
							aria-hidden="true"
							data-slot="icon"
						>
							<path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
						</svg>
					</button>
				</div>
				<div class="relative ml-3">
					<div>
						<button
							type="button"
							class="relative hidden cursor-pointer rounded-full bg-red-800 text-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-red-800 focus:outline-hidden sm:flex"
							id="user-menu-button"
							aria-expanded="false"
							aria-haspopup="true"
							onclick={() => {
								document.getElementById('user-menu')?.classList.toggle('hidden');
							}}
						>
							<span class="absolute -inset-1.5"></span>
							<span class="sr-only">Open user menu</span>
							<img
								class="size-10 rounded-full"
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
								alt=""
							/>
						</button>
					</div>

					<!--
			  Dropdown menu, show/hide based on menu state.
  
			  Entering: "transition ease-out duration-100"
				From: "transform opacity-0 scale-95"
				To: "transform opacity-100 scale-100"
			  Leaving: "transition ease-in duration-75"
				From: "transform opacity-100 scale-100"
				To: "transform opacity-0 scale-95"
			-->
					<div
						class="absolute right-0 z-10 mt-2 hidden w-48 origin-top-right rounded-md bg-white py-1 ring-1 shadow-lg ring-black/5 focus:outline-hidden"
						role="menu"
						aria-orientation="vertical"
						aria-labelledby="user-menu-button"
						tabindex="-1"
						id="user-menu"
					>
						<!-- Active: "bg-gray-100 outline-hidden", Not Active: "" -->
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-0">Profilo</a
						>
						<!-- <a
							href="#"
							class="block px-4 py-2 text-sm text-gray-700"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-1">Settings</a
						> -->
						<a
							href="#"
							class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
							role="menuitem"
							tabindex="-1"
							id="user-menu-item-2">Log Out</a
						>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile menu, show/hide based on menu state. -->
	<div class="hidden" id="mobile-menu">
		<!-- class="sm:hidden {mainMenu ? 'show' : 'hidden'} -->
		<div class="space-y-1 px-2 pt-2 pb-3">
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-red-700 hover:text-white"
				>Chi Siamo</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-red-700 hover:text-white"
				>Campionati</a
			>
			<a
				href="#"
				class="block rounded-md px-3 py-2 text-base font-medium text-gray-100 hover:bg-red-700 hover:text-white"
				>Galleria</a
			>
			<hr />
			<span class="sr-only">Open user menu</span>
			<imgw
				class="size-10 rounded-full"
				src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
				alt=""
			/>
		</div>
	</div>
</nav>
