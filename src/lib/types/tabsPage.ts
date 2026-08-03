import type { Icon as IconType } from '@lucide/svelte';

export type TabsPageType = {
	headers: TabsPageHeader[];
	contents: Record<string, TabsPageContent>;
};

export type TabsPageHeader = {
	label: string;
	icon?: typeof IconType;
};

export type TabsPageContent = {
	text: string;
	image: TabsImageContent;
};

export type TabsImageContent = {
	url: string;
	alt: string;
};
