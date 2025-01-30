<!-- <script lang="ts">
	import { LinkPreview } from 'bits-ui';
</script> -->
<!-- <script lang="ts">
	import { Avatar, LinkPreview } from 'bits-ui';
	import { CalendarBlank, MapPin } from '$icons/index.js';
	import { flyAndScale } from '$lib/utils/index.js';
	let loadingStatusTrigger: Avatar.Props['loadingStatus'] = undefined;
	let loadingStatusContent: Avatar.Props['loadingStatus'] = undefined;
</script> -->
<!-- 
<LinkPreview.Root>
	<LinkPreview.Trigger
		href="https://github.com/sveltejs"
		target="_blank"
		rel="noreferrer noopener"
		class="rounded-sm underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-black"
	>
		<Avatar.Root
			bind:loadingStatus={loadingStatusTrigger}
			class="h-12 w-12 rounded-full border {loadingStatusTrigger === 'loaded'
				? 'border-foreground'
				: 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
		>
			<div
				class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
			>
				<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
				<Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
			</div>
		</Avatar.Root>
	</LinkPreview.Trigger>
	<LinkPreview.Content
		class="w-[331px] rounded-xl border border-muted bg-background p-[17px] shadow-popover"
		sideOffset={8}
		transition={flyAndScale}
		transitionConfig={{ duration: 150, y: -8 }}
	>
		<div class="flex space-x-4">
			<Avatar.Root
				bind:loadingStatus={loadingStatusContent}
				class="h-12 w-12 rounded-full border {loadingStatusContent === 'loaded'
					? 'border-foreground'
					: 'border-transparent'} bg-muted text-[17px] font-medium uppercase text-muted-foreground"
			>
				<div
					class="flex h-full w-full items-center justify-center overflow-hidden rounded-full border-2 border-transparent"
				>
					<Avatar.Image src="/avatar-1.png" alt="@huntabyte" />
					<Avatar.Fallback class="border border-muted">HB</Avatar.Fallback>
				</div>
			</Avatar.Root>
			<div class="space-y-1 text-sm">
				<h4 class="font-medium">@huntabyte</h4>
				<p>I do things on the internet.</p>
				<div class="flex items-center gap-[21px] pt-2 text-xs text-muted-foreground">
					<div class="flex items-center text-xs">
						<MapPin class="mr-1 size-4" />
						<span> FL, USA </span>
					</div>
					<div class="flex items-center text-xs">
						<CalendarBlank class="mr-1 size-4" />
						<span> Joined May 2020</span>
					</div>
				</div>
			</div>
		</div>
	</LinkPreview.Content>
</LinkPreview.Root> -->

<footer>
	<div class="container">
		<span class="inner-container">
			Copyright &copy {new Date().getFullYear()} all rights reserved | Made with love by
			<!-- 
			<LinkPreview.Root>
				<LinkPreview.Trigger />
				<LinkPreview.Content />
			</LinkPreview.Root> -->
			<a target="_blank" href="https://github.com/vano2903">Vano</a>
			and <a target="_blank" href="https://github.com/MoraGames">Morandi</a>
		</span>
	</div>
</footer>

<style>
	footer {
		min-height: 160px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.container {
		min-height: 80px;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		border-radius: 15px;
		background-color: var(--grey);
		font-size: max(16px, 10px + 0.5vw);
	}

	.inner-container {
		font-weight: normal;
	}

	@media (max-width: 900px) {
		.container {
			padding-inline: 20px;
		}
	}

	@media (max-width: 600px) {
		footer {
			min-height: 120px;
		}
	}

	a {
		color: hsl(var(--foreground));
		transition: color 0.2s ease;
	}

	a:hover {
		/* color: rgb(240, 104, 104); */
		color: hsl(var(--red));
	}
</style>
