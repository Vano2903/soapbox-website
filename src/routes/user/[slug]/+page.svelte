<script lang="ts">
	import type { UserNonExpand } from '$tsTypes/user';
	import { ExternalLink } from 'lucide-svelte';
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
	<div class="flex w-full flex-col items-center justify-center md:max-w-[80%] lg:max-w-[55%]">
		<div class="h-2xl w-full">
			<img src={user.bannerCropped} alt="banner" class="h-full w-full object-fill" />
		</div>

		<div class="flex w-full items-center justify-center space-x-5 pb-8">
			<div class="mt-[-1rem] mb-4 h-20 w-20 rounded-full bg-gray-200 md:h-24 md:w-24">
				<div class="avatar">
					<div class="w-20 rounded-full ring-1 ring-black md:w-24">
						<img src={user.avatarCropped} alt="User Avatar" />
					</div>
				</div>
			</div>
			<div class="mt-[-1rem]">
				<h2 class="text-2xl font-bold">{user.name} {user.lastName}</h2>
				<!-- <div class="flex flex-nowrap items-center space-x-2"> -->
				<a href={'/user/' + user.nick} target="_blank" class="ml-2 font-bold text-red-600">
					@{user.nick}
				</a>
				<!-- <ExternalLink size={16} /> -->
				<!-- </div> -->
			</div>
		</div>

		<!-- bio section -->
		<div class="w-full px-4">
			<p class="text-lg">{user.bio}</p>
		</div>
		<!-- <img src={user.avatarCropped} alt="User Avatar" class="mb-4 h-24 w-24 rounded-full" /> -->
		<!-- 
		<h1 class="text-3xl font-bold">User Profile</h1>
		<p class="mt-2 text-lg">
			Welcome, {user.nick}!
		</p>
		<p class="mt-4">This is your profile page.</p>
		<p class="mt-2">Your slug is: {slug}</p> -->
		<!-- Add more user-specific information here -->
	</div>
</div>
