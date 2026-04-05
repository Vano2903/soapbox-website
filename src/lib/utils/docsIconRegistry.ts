import {
	CalendarHeart,
	CalendarDays,
	Ticket,
	UserRoundPlus,
	ChartColumn,
	PenTool,
	Signature,
	LogIn,
	PencilRuler,
	TicketPlus,
	Users,
	Store,
	User,
	Handshake,
	SquarePen,
	Map,
	Crown,
	CircleHelp,
	Route
} from 'lucide-svelte';
import type { ComponentType } from 'svelte';

export const docsIcons = {
	// Category or pages icons
	CalendarHeart: CalendarHeart,
	CalendarDays: CalendarDays,
	Ticket: Ticket,
	UserRoundPlus: UserRoundPlus,
	ChartColumn: ChartColumn,
	PenTool: PenTool,
	Signature: Signature,
	LogIn: LogIn,
	PencilRuler: PencilRuler,
	TicketPlus: TicketPlus,
	Users: Users,
	Store: Store,
	User: User,
	Handshake: Handshake,
	// Notes or Contextual Helps icons
	SquarePen: SquarePen,
	Map: Map,
	Crown: Crown,
	// Default or fallback icons
	CircleHelp: CircleHelp,
	Route: Route,
} as const;

export type DocsIconKey = keyof typeof docsIcons;
export type LucideComponent = ComponentType;

export function resolveDocsIcon(icon: unknown, fallback: DocsIconKey = 'CircleHelp'): LucideComponent {
	if (typeof icon === 'string' && icon in docsIcons) {
		return docsIcons[icon as DocsIconKey] as LucideComponent;
	}
	return docsIcons[fallback] as LucideComponent;
}
