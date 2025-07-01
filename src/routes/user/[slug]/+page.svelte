<script lang="ts">
	import type { UserNonExpand } from '$tsTypes/user';
	interface Props {
		data: {
			user: UserNonExpand;
			slug: string;
		};
	}
	// }
	const { data }: Props = $props();
	// 	user: UserNonExpand;
	// 	slug: string;
	// }>();
	let { user, slug } = data;
</script>

<div class="flex flex-col items-center justify-center">
	<h1 class="text-3xl font-bold">User Profile</h1>
	<p class="mt-2 text-lg">Welcome, {user.nick}!</p>
	<p class="mt-4">This is your profile page.</p>
	<p class="mt-2">Your slug is: {slug}</p>
	<!-- Add more user-specific information here -->
</div>
