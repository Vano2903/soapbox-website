<script lang="ts">
	// JavaScript to toggle the dropdown
	const dropdownButton = document.getElementById('dropdown-button');
	const dropdownMenu = document.getElementById('dropdown-menu');
	const searchInput = document.getElementById('search-input') as HTMLInputElement;
	let isOpen = false; // Set to true to open the dropdown by default

	// Function to toggle the dropdown state
	function toggleDropdown() {
		isOpen = !isOpen;
		dropdownMenu?.classList.toggle('hidden', !isOpen);
	}

	// Set initial state
	toggleDropdown();

	dropdownButton?.addEventListener('click', () => {
		toggleDropdown();
	});

	// Add event listener to filter items based on input
	searchInput?.addEventListener('input', () => {
		const searchTerm = searchInput.value.toLowerCase();
		const items = dropdownMenu?.querySelectorAll('a');

		items?.forEach((item) => {
			const text = item?.textContent?.toLowerCase() ?? '';
			if (text.includes(searchTerm)) {
				item.style.display = 'block';
			} else {
				item.style.display = 'none';
			}
		});
	});
</script>

<div class="flex min-h-screen items-center justify-center">
	<div class="group relative">
		<button
			id="dropdown-button"
			class="inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-100 focus:outline-none"
		>
			<span class="mr-2">Open Dropdown</span>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				class="-mr-1 ml-2 h-5 w-5"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M6.293 9.293a1 1 0 011.414 0L10 11.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
					clip-rule="evenodd"
				/>
			</svg>
		</button>
		<div
			id="dropdown-menu"
			class="ring-opacity-5 absolute right-0 mt-2 hidden space-y-1 rounded-md bg-white p-1 ring-1 shadow-lg ring-black"
		>
			<!-- Search input -->
			<input
				id="search-input"
				class="block w-full rounded-md border border-gray-300 px-4 py-2 text-gray-800 focus:outline-none"
				type="text"
				placeholder="Search items"
				autocomplete="off"
			/>
			<!-- Dropdown content goes here -->
			<a
				href="#"
				class="block cursor-pointer rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100"
				>Uppercase</a
			>
			<a
				href="#"
				class="block cursor-pointer rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100"
				>Lowercase</a
			>
			<a
				href="#"
				class="block cursor-pointer rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100"
				>Camel Case</a
			>
			<a
				href="#"
				class="block cursor-pointer rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100 active:bg-blue-100"
				>Kebab Case</a
			>
		</div>
	</div>
</div>
