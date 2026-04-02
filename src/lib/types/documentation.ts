import type { ContextualHelps } from './contextualHelp';
import type { DocsIconKey } from '$lib/utils/docsIconRegistry';

export interface DocsFaqItem {
	question: string;
	linkLabel: string;
	targetId: string;
}

export interface DocsChapter {
	title: string;
	body: string;
}

export interface DocsPages {
	id: string;
	title: string;
	icon: DocsIconKey;
	path: string;
	summary: string;
	notes: string[];
	chapters: DocsChapter[];
	helpKeys: string[];
}

export interface DocsCategory {
	id: string;
	title: string;
	intro: string;
	icon: DocsIconKey;
	pages: DocsPages[];
}

export interface DocsContent {
	faq: DocsFaqItem[];
	categories: DocsCategory[];
	contextualHelps: ContextualHelps;
}
