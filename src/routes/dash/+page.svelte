<script lang="ts">
	import type { TypedPocketBase } from '$tsTypes/pocketbase.js';
	import PocketBase, { type RecordModel } from 'pocketbase';

	const { data } = $props();
	const pb = new PocketBase(data.pbUri) as TypedPocketBase;
</script>

<div class="p-2">
	<p>
		Ciao <span class="font-bold"
			>{data.user?.name} {data.user?.lastName} aka {data.user?.nick}
		</span>, benvenuto nella tua dashboard.
	</p>

	<a class="btn" href="/dash/team/new">Crea un nuovo team</a>
	<button class="btn">Entra a far parte di un nuovo team</button>

	<!-- <button onclick={logout} class="btn btn-info my-4"> logout </button> -->
</div>
