<script lang="ts">
	import type { User } from '$types/user';

	let { user }: { user: User } = $props();
	let isDropdownOpen = $state(false);
	const handleDropdownClick = () => {
		console.log('Dropdown click handled.');
		if (!user) window.location.href = '/login';
		isDropdownOpen = !isDropdownOpen;
		console.log('Updated isDropdownOpen = ', isDropdownOpen);
	};

	const handleDropdownFocusLoss = ({
		relatedTarget,
		currentTarget
	}: {
		relatedTarget: EventTarget | null;
		currentTarget: EventTarget & Element;
	}) => {
		if (relatedTarget instanceof HTMLElement && currentTarget.contains(relatedTarget)) return; // check if the new focus target doesn't present in the dropdown tree (exclude ul\li padding area because relatedTarget, in this case, will be null)
		isDropdownOpen = false;
	};

	function logout() {
		console.log('logout');
		document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		window.location.href = '/';
	}
</script>

{#snippet avatar(user: User)}
	<div class="avatar">
		<div class="ring-offset-primary w-10 rounded-full ring-2 ring-white ring-offset-2">
			<img
				src={user ? user.avatarCropped : '/images/navbar/profile.svg'}
				alt={user ? 'User icon' : 'Login icon'}
			/>
		</div>
	</div>
{/snippet}

<div class="dropdown dropdown-end" onfocusout={handleDropdownFocusLoss}>
	{#if user}
		<button
			onclick={handleDropdownClick}
			data-sveltekit-reload
			class="link-hover flex cursor-pointer items-center text-white"
		>
			{@render avatar(user)}
		</button>
		<ul
			class="dropdown-content menu bg-base-100 rounded-box mt-2 w-52 border-2 p-2 shadow"
			class:hidden={!isDropdownOpen}
			aria-hidden={!isDropdownOpen}
		>
			<div class="join join-vertical">
				<li><a class="btn join-item btn-soft" href="/me">Profilo</a></li>
				<li><a class="btn join-item btn-soft" href="/dash">Dashboard</a></li>
				<br />
				<li><a class="btn join-item btn-soft" href="/settings">Impostazioni</a></li>
			</div>

			<div class="divider"></div>
			<li><button class="btn btn-soft bg-info" onclick={logout}>Logout</button></li>
		</ul>
	{:else}
		<a class="link-hover flex cursor-pointer items-center text-white" href="/login">
			{@render avatar(user)}
		</a>
	{/if}
</div>
