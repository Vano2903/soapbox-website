<script lang="ts">
	import type { UserNonExpand } from '$tsTypes/user';
	interface Props {
		data: {
			user: UserNonExpand;
			slug: string;
		};
	}
	// }

	// const backgroundImage =

	const { data }: Props = $props();
	// 	user: UserNonExpand;
	// 	slug: string;
	// }>();
	let { user, slug } = data;
</script>

<div class="flex w-full justify-center">
	<div class="flex w-full flex-col items-center justify-center md:max-w-[70%] lg:max-w-[55%]">
		<div class="h-2xl w-full">
			<img src={user.bannerCropped} alt="banner" class="h-full w-full object-fill" />
		</div>

		<div class="flex w-full items-center justify-evenly">
			<div class="mt-[-1rem] mb-4 h-20 w-20 rounded-full bg-gray-200 md:h-24 md:w-24">
				<div class="avatar">
					<div class="w-20 rounded-full ring-2 ring-black md:w-24">
						<img src={user.avatarCropped} alt="User Avatar" />
					</div>
				</div>
			</div>
			<div class="mt-[-1rem]">
				<h2 class="text-xl font-semibold">{user.name}</h2>
				<p class="text-gray-600">@{user.nick}</p>
			</div>
		</div>
		<!-- <img src={user.avatarCropped} alt="User Avatar" class="mb-4 h-24 w-24 rounded-full" /> -->

		<h1 class="text-3xl font-bold">User Profile</h1>
		<p class="mt-2 text-lg">
			Welcome, {user.nick}!
		</p>
		<p class="mt-4">This is your profile page.</p>
		<p class="mt-2">Your slug is: {slug}</p>
		<!-- Add more user-specific information here -->
	</div>
</div>
