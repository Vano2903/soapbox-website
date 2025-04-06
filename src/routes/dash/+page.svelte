<script lang="ts">
	import type { TypedPocketBase } from '$tsTypes/pocketbase.js';
	import PocketBase, { type RecordModel } from 'pocketbase';

	const { data } = $props();
	const pb = new PocketBase(data.pbUri) as TypedPocketBase;

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

	<button class="btn">Crea un nuovo team</button>
	<button class="btn">Entra a far parte di un nuovo team</button>

	<button onclick={logout} class="btn btn-info my-4"> logout </button>
</div>
