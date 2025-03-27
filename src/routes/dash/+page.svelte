<script lang="ts">
	const { data } = $props();

	function logout() {
		console.log('logout');
		// const pb = new PocketBase(data.pbUri);
		// pb.authStore.clear();
		// document.cookie = pb.authStore.exportToCookie({ httpOnly: false, secure: true });
		// window.location.href = '/';
		document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

		window.location.href = '/';
	}
</script>

<div class="p-2">
	<p>
		Ciao <span class="font-bold"
			>{data.user?.name} {data.user?.lastName} aka {data.user?.nick}
		</span>, benvenuto nella tua dashboard.
	</p>

	<button
		onclick={logout}
		class="my-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
	>
		logout
	</button>
</div>
