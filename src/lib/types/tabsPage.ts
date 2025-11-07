import type { Icon as IconType } from 'lucide-svelte';
import type { Picture } from 'vite-imagetools';

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
	image: Picture;
};
