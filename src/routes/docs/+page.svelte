<script lang="ts">
	import { onMount } from 'svelte';
	import { ArrowRight } from 'lucide-svelte';
	import type { DocsContent, DocsCategory } from '$lib/types/documentation';
	import { resolveDocsIcon } from '$lib/utils/docsIconRegistry';

	const { data } = $props();
	const docsContent = $derived(data.docsContent as DocsContent);
	const HeaderIcon = resolveDocsIcon('book');

	type InlineToken =
		| { kind: 'text'; value: string }
		| { kind: 'icon'; component: ReturnType<typeof resolveDocsIcon> };

	function parseInlineTokens(content: string): InlineToken[] {
		const iconPattern = /\[\[icon:([a-zA-Z0-9_-]+)\]\]/g;
		const tokens: InlineToken[] = [];
		let cursor = 0;

		for (const match of content.matchAll(iconPattern)) {
			const fullMatch = match[0];
			const iconName = match[1];
			const start = match.index ?? 0;

			if (start > cursor) {
				tokens.push({ kind: 'text', value: content.slice(cursor, start) });
			}

			tokens.push({ kind: 'icon', component: resolveDocsIcon(iconName, 'CircleHelp') });
			cursor = start + fullMatch.length;
		}

		if (cursor < content.length) {
			tokens.push({ kind: 'text', value: content.slice(cursor) });
		}

		if (tokens.length === 0) {
			return [{ kind: 'text', value: content }];
		}

		return tokens;
	}

	const docsCategoriesView = $derived(
		docsContent.categories.map((category) => ({
			...category,
			iconComponent: resolveDocsIcon(category.icon, 'CircleHelp'),
			pages: category.pages.map((page) => ({
				...page,
				iconComponent: resolveDocsIcon(page.icon, 'Route'),
				noteTokens: page.notes.map((note) => parseInlineTokens(note))
			}))
		}))
	);
	const contextualHelpsView = $derived(
		Object.fromEntries(
			Object.entries(docsContent.contextualHelps).map(([key, help]) => [
				key,
				{
					...help,
					shortTokens: parseInlineTokens(help.shortContent),
					longTokens: parseInlineTokens(help.longContent)
				}
			])
		)
	);

	let activeSectionId = $state('');
	function isCategoryActive(category: DocsCategory): boolean {
		return activeSectionId === category.id || category.pages.some((page) => page.id === activeSectionId);
	}

	onMount(() => {
		const sectionElements = Array.from(document.querySelectorAll<HTMLElement>('[data-doc-nav-section="true"]'));
		if (sectionElements.length === 0) {
			return;
		}

		let visibleIds = new Set<string>();

		const updateActiveFromViewport = () => {
			const orderedVisible = sectionElements
				.filter((el) => visibleIds.has(el.id))
				.sort((a, b) => Math.abs(a.getBoundingClientRect().top - 120) - Math.abs(b.getBoundingClientRect().top - 120));

			if (orderedVisible.length > 0) {
				activeSectionId = orderedVisible[0].id;
			}
		};

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						visibleIds.add((entry.target as HTMLElement).id);
					} else {
						visibleIds.delete((entry.target as HTMLElement).id);
					}
				}
				updateActiveFromViewport();
			},
			{
				root: null,
				rootMargin: '-18% 0px -58% 0px',
				threshold: [0.15, 0.3, 0.5]
			}
		);

		for (const sectionElement of sectionElements) {
			observer.observe(sectionElement);
		}

		if (sectionElements[0]) {
			activeSectionId = sectionElements[0].id;
		}

		return () => {
			observer.disconnect();
		};
	});
</script>

<!-- Remove it from production for consistency but keept it as trace for future implementation reference -->
<!--
<svelte:head>
	<title>Documentation | SoapBoxRally</title>
	<meta
		name="description"
		content="Route-scoped documentation for SoapBoxRally with contextual helps and navigation by category and page."
	/>
</svelte:head>
-->

<main class="pb-16">
	<div class="min-h-screen bg-base-100">
		<section class="relative overflow-hidden border-b border-base-300 bg-linear-to-tl from-zinc-100 via-stone-100 to-red-400 shadow-[0_12px_28px_-24px_rgba(31,41,55,0.42)]">
			<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_70%_at_85%_0%,rgba(220,38,38,0.30),transparent_68%),radial-gradient(70%_55%_at_18%_10%,rgba(185,28,28,0.18),transparent_72%),radial-gradient(62%_66%_at_92%_100%,rgba(236,239,243,0.80),transparent_74%),linear-gradient(145deg,rgba(247,249,251,0.46)_4%,rgba(255,255,255,0)_42%,rgba(236,239,243,0.36)_100%)]"></div>
			<div class="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
				<div class="relative space-y-4">
					<div class="inline-flex items-center gap-2 rounded-full border border-red-300/80 bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-red-700">
						<HeaderIcon class="h-4 w-4" />
						Documentazione Sito
					</div>
					<h1 class="max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
						Tutta la documentazione in un posto: aggiornata e facile da navigare
					</h1>
					<p class="max-w-3xl text-base-content/70 md:text-lg">
						Tutto il contenuto del sito web è riassunto in questa sezione dedicata alla spiegazione della struttura delle pagine e degli aiuti contestuali disponibili.
					</p>
				</div>
			</div>
		</section>

		<section id="faq" data-doc-nav-section="true" class="mx-auto mt-8 max-w-7xl scroll-mt-28 px-4 md:px-6">
			<div class="rounded-3xl border border-base-300 bg-base-200/50 p-6 md:p-8">
				<h2 class="text-2xl font-bold md:text-3xl">Domande frequenti</h2>
				<p class="mt-2 text-sm text-base-content/70">Scorciatoie rapide per raggiungere velocemente la sezione desiderata.</p>
				<div class="mt-6 grid gap-3 md:grid-cols-2">
					{#each docsContent.faq as item}
						<div class="group rounded-2xl border border-base-300 bg-base-100/95 p-4 shadow-sm transition-colors duration-250 hover:border-red-100/80 hover:bg-red-50/50">
							<p class="text-sm font-medium">{item.question}</p>
							<a href={`#${item.targetId}`} class="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-primary">
								<span class="transition-transform duration-300 group-hover:translate-x-1.5">Vedi {item.linkLabel}</span>
								<ArrowRight class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
							</a>
						</div>
					{/each}
				</div>
			</div>
		</section>

		<div class="mx-auto mt-10 max-w-7xl px-4 md:px-6">
			<div class="grid gap-8 lg:grid-cols-[18rem_minmax(0,1fr)]">
				<aside class="hidden h-fit lg:sticky lg:top-24 lg:block lg:border-r lg:border-base-300 lg:pr-5">
					<p class="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-base-content/50">Indice documentazione</p>
					<nav class="space-y-2">
						<div>
							<a
								href="#faq"
								class={`block rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-300 ${activeSectionId === 'faq' ? 'bg-base-200 text-base-content' : 'text-base-content/65'}`}
							>
								Domande frequenti
							</a>
						</div>

						{#each docsCategoriesView as category}
							<div>
								<a
									href={`#${category.id}`}
									class={`block rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-300 ${isCategoryActive(category) ? 'bg-base-200 text-base-content' : 'text-base-content/65'}`}
								>
									{category.title}
								</a>
								<div class="mt-1 space-y-1 border-l border-base-300 pl-3">
									{#each category.pages as page}
										<a
											href={`#${page.id}`}
											class={`block rounded-lg px-3 py-1.5 text-sm transition-colors duration-300 ${activeSectionId === page.id ? 'bg-base-200 text-base-content' : 'text-base-content/60'}`}
										>
											{page.title}
										</a>
									{/each}
								</div>
							</div>
						{/each}
					</nav>
				</aside>

				<div class="space-y-16">
					{#each docsCategoriesView as category}
						<section id={category.id} data-doc-nav-section="true" class="scroll-mt-28 border-t-4 border-base-300 pt-9">
							<div class="rounded-3xl bg-base-200/35 p-6 md:p-7">
								<div class="flex items-start md:items-center gap-4">
									<div class="rounded-2xl bg-red-50 p-3 text-red-700">
										<category.iconComponent class="h-5 w-5 md:h-8 md:w-8" />
									</div>
									<div>
										<h2 class="text-2xl font-bold md:text-4xl">{category.title}</h2>
										<p class="mt-2 max-w-4xl text-base-content/70">{category.intro}</p>
									</div>
								</div>
							</div>

							<div class="mt-4 space-y-4">
								{#each category.pages as page}
									<article id={page.id} data-doc-nav-section="true" class="scroll-mt-28 rounded-3xl border border-base-300 bg-base-100 shadow-sm">
										<div class="p-6 md:p-7">
											<div class="flex flex-wrap items-center justify-between gap-3">
												<div class="flex items-center gap-2">
													<page.iconComponent class="h-5 w-5 text-primary" />
													<h3 class="text-xl md:text-2xl font-semibold">{page.title}</h3>
												</div>
												<a href={page.path} class="btn btn-ghost btn-sm gap-2 rounded-full">
													<span class="block md:hidden">Vedi pagina</span>
													<span class="hidden md:block">Vai alla pagina</span>
													<ArrowRight class="h-4 w-4" />
												</a>
											</div>
											<p class="mt-3 max-w-3xl text-sm text-base-content/70">{page.summary}</p>

											{#if page.notes && page.notes.length > 0}
												<div class="mt-5 rounded-2xl bg-base-200 p-4">
													<p class="text-sm font-semibold">Note</p>
													<ul class="mt-2 list-disc space-y-1 pl-5 text-sm text-base-content/70">
														{#each page.noteTokens as noteTokens}
															<li>
																{#each noteTokens as token}
																	{#if token.kind === 'icon'}
																		<token.component class="mx-1 inline h-4 w-4 text-primary align-[-1px]" />
																	{:else}
																		{token.value}
																	{/if}
																{/each}
															</li>
														{/each}
													</ul>
												</div>
											{/if}

											{#if page.chapters.length > 0}
												<div class={`mt-5 grid gap-3 ${page.chapters.length === 1 ? 'md:grid-cols-1' : page.chapters.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'}`}>
													{#each page.chapters as chapter}
														<div class="rounded-2xl bg-base-200 p-4">
															<p class="text-sm font-semibold text-primary">{chapter.title}</p>
															<p class="mt-2 text-sm text-base-content/70">{chapter.body}</p>
														</div>
													{/each}
												</div>
											{/if}

											{#if page.helpKeys.length > 0}
												<div class="mt-5 border-t border-base-300 pt-5">
													<h4 class="font-semibold">Aiuti contestuali</h4>
													<div class={`mt-4 grid grid-cols-1 gap-4 ${page.helpKeys.length > 1 ? 'md:grid-cols-2' : ''}`}>
														{#each page.helpKeys as helpKey}
															{@const help = contextualHelpsView[helpKey]}
															{#if help}
																<article id={help.docReference} data-doc-section="true" class="scroll-mt-28 rounded-2xl border border-red-100 bg-red-50/60 p-4">
																	<p class="text-xs font-semibold uppercase tracking-[0.2em] text-red-700/70">{help.location}</p>
																	<h5 class="mt-1 text-lg font-semibold">{help.name}</h5>
																	<p class="mt-3 text-sm text-base-content/80">
																		{#each help.shortTokens as token}
																			{#if token.kind === 'icon'}
																				<token.component class="mx-1 inline h-4 w-4 text-primary align-[-1px]" />
																			{:else}
																				{token.value}
																			{/if}
																		{/each}
																	</p>
																	<hr class="my-2 border-neutral-200">
																	<p class="font-semibold text-sm text-base-content/80">Nel dettaglio:</p>
																	<p class="text-sm text-base-content/70">
																		{#each help.longTokens as token}
																			{#if token.kind === 'icon'}
																				<token.component class="mx-1 inline h-4 w-4 text-primary align-[-1px]" />
																			{:else}
																				{token.value}
																			{/if}
																		{/each}
																	</p>
																</article>
															{/if}
														{/each}
													</div>
												</div>
											{/if}
										</div>
									</article>
								{/each}
							</div>
						</section>
					{/each}
				</div>
			</div>
		</div>
	</div>
</main>
