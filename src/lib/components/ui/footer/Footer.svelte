<script lang="ts">
	import SocialIcons from '@rodneylab/svelte-social-icons';

	const basePath = '/images/footer/';

	const socialColors = {
		foreground: '#000000',
		background: '#f5f5f5'
	};
	const socials = [
		{
			active: true,
			network: 'youtube',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Canale Youtube',
			href: 'https://www.youtube.com/channel/UCw1pbrZpdikVRmootOMrFQg'
		},
		{
			active: true,
			network: 'facebook',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Pagina Facebook',
			href: 'https://www.facebook.com/OfficialASDBoxRallyClub/'
		},
		{
			active: true,
			network: 'instagram',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Pagina Instagram',
			href: 'https://www.instagram.com/box.rally/'
		},
		{
			active: false,
			network: 'whatsapp',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Feed WhatsApp',
			href: ''
		},
		{
			active: false,
			network: 'telegram',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Canale Telegram',
			href: ''
		},
		{
			active: false,
			network: 'reddit',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Community Reddit',
			href: ''
		},
		{
			active: false,
			network: 'twitter',
			fgColor: socialColors.foreground,
			bgColor: socialColors.background,
			alt: 'Profilo Twitter',
			href: ''
		}
	];
	const sections = [
		{
			name: 'informazioni',
			active: true,
			links: [
				{ herf: '/site-map', name: 'mappa del sito', active: false },
				{
					href: '/documents/privacy-policy.pdf',
					name: 'informativa privacy',
					active: true
				},
				{
					href: '/documents/terms-and-conditions.pdf',
					name: 'termini e condizioni',
					active: true
				},
				{
					href: '/documents/statute-of-liability.pdf',
					name: 'sgravio responsabilità',
					active: true
				}
			]
		},
		{
			name: 'contenuti',
			active: true,
			links: [
				{ herf: '/', name: 'home', active: true },
				{ herf: '/leaderboards', name: 'classifiche', active: true },
				{ herf: '/bulletin-board', name: 'regolamenti', active: true },
				{ href: '/contacts', name: 'contatti', active: true },
				{ href: '/lavora-con-noi', name: 'lavora con noi', active: false }
			]
		},
		{
			name: 'assistenza',
			active: true,
			links: [
				{ herf: '/content-removal', name: 'rimozione contenuti', active: false },
				{ herf: '/faq', name: 'domande frequenti', active: true },
				{ herf: '/cookies', name: 'gestione cookies', active: true },
				{ herf: '/support', name: 'supporto clienti', active: false }
			]
		}
	];
</script>

<footer class="flex min-h-[160px] flex-col bg-black pt-2 pr-4 pl-4">
	<hr class="mx-4 mt-0.75 mb-3 h-1 w-auto rounded-sm border-0 bg-red-600" />
	<div
		class="flex flex-col flex-wrap items-center justify-center gap-2 text-center lg:flex-row lg:items-start lg:justify-between 2xl:text-left"
	>
		<!-- Brand and Socials -->
		<div
			class="flex flex-col items-center justify-center gap-1 lg:ml-4 lg:max-w-1/2 lg:flex-row lg:items-start lg:justify-normal lg:gap-4"
		>
			<!--
			<img
				class="h-16 w-16 md:hidden lg:block lg:h-32 lg:w-32"
				src="/images/footer/logo.jpg"
				alt="Logo ASD Boxrally"
			/>
			-->
			<div>
				<span class="flex flex-wrap justify-center p-1 text-base/6 whitespace-nowrap">
					<span
						class="xs:block hidden text-4xl leading-none font-bold text-neutral-100 md:text-5xl xl:text-7xl"
						>ASD</span
					>&nbsp;&nbsp;
					<span class="text-4xl leading-none font-bold text-red-600 md:text-5xl xl:text-7xl"
						>BOXRALLY</span
					>
				</span>
				<div
					class="flex flex-wrap items-center justify-center gap-3 lg:flex-nowrap lg:justify-normal"
				>
					{#each socials as social}
						{#if social.active}
							<a class="block md:hidden" href={social.href} target="_blank">
								<SocialIcons
									network={social.network}
									alt={social.alt}
									fgColor={social.fgColor}
									bgColor={social.bgColor}
									width="36"
									height="36"
								/>
							</a>
							<a class="hidden md:block xl:hidden" href={social.href} target="_blank">
								<SocialIcons
									network={social.network}
									alt={social.alt}
									fgColor={social.fgColor}
									bgColor={social.bgColor}
									width="42"
									height="42"
								/>
							</a>
							<a class="hidden xl:block" href={social.href} target="_blank">
								<SocialIcons
									network={social.network}
									alt={social.alt}
									fgColor={social.fgColor}
									bgColor={social.bgColor}
								/>
							</a>
						{/if}
					{/each}
				</div>
			</div>
		</div>
		<!-- Navigations link -->
		<div class="flex flex-col flex-wrap justify-center gap-4 sm:flex-row lg:mr-4 lg:gap-6">
			<!-- <div class={`m-auto grid grid-cols-1 ${largeSectionGridCols}`}> -->
			<!-- <div class="m-auto grid grid-cols-1 lg:grid-cols-{sectionsGridCols}"> -->
			<!-- <div class="lg:grid-cols- grid w-100 grid-cols-1"> -->
			{#each sections as section}
				{#if section.active}
					<div class="flex flex-col">
						<span
							class="text-base font-bold text-gray-400 uppercase md:text-xl lg:text-2xl 2xl:text-3xl"
							>{section.name}</span
						>
						<span class="flex flex-col text-sm md:text-base 2xl:pl-3">
							{#each section.links as link}
								{#if link.active}
									<a href={link.href} class="text-gray-400 hover:text-red-600">{link.name}</a>
								{/if}
							{/each}
						</span>
					</div>
				{/if}
			{/each}
		</div>
	</div>
	<div class="flex w-full items-center justify-center py-2 pt-4 text-center text-gray-500">
		<div class="group">
			<span class="inner-container">
				Copyright &copy {new Date().getFullYear()} all rights reserved | Made by

				<div class="tooltip" data-tip="with ❤️">
					<!-- <button class="btn">Hover me</button> -->
					<a target="_blank" class="underline hover:text-red-600" href="https://github.com/vano2903"
						>Vano</a
					>
				</div>
				and
				<div class="tooltip" data-tip="with ❤️">
					<a
						target="_blank"
						class="underline hover:text-red-600"
						href="https://github.com/MoraGames">Mora</a
					>
				</div>
				<!-- <span class="ml-1 opacity-0 transition-opacity group-hover:opacity-100"> with Love </span> -->
			</span>
		</div>
	</div>
</footer>

<style>
	a {
		transition: color 0.25s ease;
		cursor: pointer;
	}
</style>
