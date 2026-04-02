import {
	BookOpenText,
	CalendarDays,
	Image,
	Trophy,
	Users,
	CircleHelp,
	SquarePen,
	Map,
	Camera,
	ChartSpline,
	ShieldCheck,
	UserRoundPlus,
	Route
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const docsIcons = {
	book: BookOpenText,
	calendar: CalendarDays,
	image: Image,
	trophy: Trophy,
	users: Users,
	help: CircleHelp,
	pen: SquarePen,
	map: Map,
	camera: Camera,
	chart: ChartSpline,
	shield: ShieldCheck,
	userAdd: UserRoundPlus,
	route: Route
} as const;

export type DocsIconKey = keyof typeof docsIcons;
export type LucideComponent = ComponentType;

export function resolveDocsIcon(icon: unknown, fallback: DocsIconKey = 'help'): LucideComponent {
	if (typeof icon === 'string' && icon in docsIcons) {
		return docsIcons[icon as DocsIconKey] as LucideComponent;
	}
	return docsIcons[fallback] as LucideComponent;
}
