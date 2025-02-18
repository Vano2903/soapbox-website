<script lang="ts">
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';

	import { resetMode, setMode } from 'mode-watcher';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 stroke-black transition-all dark:scale-0 dark:-rotate-90"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 stroke-white transition-all dark:scale-100 dark:rotate-0"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end">
		<DropdownMenu.Item class="cursor-pointer" on:click={() => setMode('light')}
			>Light</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer" on:click={() => setMode('dark')}
			>Dark</DropdownMenu.Item
		>
		<DropdownMenu.Item class="cursor-pointer" on:click={() => resetMode()}>System</DropdownMenu.Item
		>
	</DropdownMenu.Content>
</DropdownMenu.Root>
