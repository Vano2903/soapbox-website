import type { Event } from '$types/pocketbase/event';
import type { ChampionshipExpand } from '$types/pocketbase/championship';
import { addDays } from '$lib/utils';

/**
 * Single source of truth for the homepage "Prossimo Evento" box.
 *
 * Desktop (aside on the carousel) and mobile ("Aspettando l'Evento") used to
 * compute enrollability and link targets independently, with different rules
 * and a dead `/championships` link. Everything now goes through this module.
 */

/** An event that started up to this many days ago still counts as "current". */
export const EVENT_GRACE_DAYS = 2;

export interface HomepageEventState {
	/** Next upcoming (or in-progress) non-canceled event; null when the season is over. */
	nextEvent: Event | null;
	/** Most recent past non-canceled event, used for the results ("Guarda") link. */
	previousEvent: Event | null;
	/** Whether the Iscriviti button should be active for nextEvent. */
	enrollable: boolean;
}

/** Events without a start date ("Da definirsi") sort after every dated event. */
export function sortEventsByStartDate<T extends { startDate?: Date }>(events: T[]): T[] {
	const time = (e: T) => (e.startDate ? new Date(e.startDate).valueOf() : Infinity);
	return [...events].sort((a, b) => time(a) - time(b));
}

/**
 * Whether users can enroll in an event right now: subscriptions open, event not
 * canceled, spots available (max 0/null means unlimited) and start date not past
 * the grace window. Mirrors the checks /enroll itself performs, so the homepage
 * never links to an enroll page that would reject the user.
 */
export function canEnroll(event: Event | null, now = new Date()): boolean {
	if (!event) return false;
	if (!event.subscriptionsOpen || event.canceled) return false;
	const max = event.maxSubscriptions ?? 0;
	if (max > 0 && event.numSubscriptions >= max) return false;
	if (event.startDate) {
		return new Date(event.startDate).valueOf() >= addDays(now, -EVENT_GRACE_DAYS).valueOf();
	}
	return true;
}

export function resolveHomepageEventState(
	championship: ChampionshipExpand,
	now = new Date()
): HomepageEventState {
	const cutoff = addDays(now, -EVENT_GRACE_DAYS).valueOf();
	const isPast = (e: Event) => !!e.startDate && new Date(e.startDate).valueOf() <= cutoff;

	// Canceled events are never "the next event" (nothing to enroll in or wait
	// for) nor "the previous event" (no results to show).
	const relevant = sortEventsByStartDate(championship.expand?.events ?? []).filter(
		(e) => !e.canceled
	);

	const nextEvent = relevant.find((e) => !isPast(e)) ?? null;
	const previousEvent = relevant.filter(isPast).at(-1) ?? null;

	return { nextEvent, previousEvent, enrollable: canEnroll(nextEvent, now) };
}

const withParams = (path: string, params: Record<string, string | undefined>): string => {
	const search = new URLSearchParams();
	for (const [key, value] of Object.entries(params)) {
		if (value) search.set(key, value);
	}
	const query = search.toString();
	return query ? `${path}?${query}` : path;
};

export function enrollHref(championshipName: string, event: Event): string {
	return withParams('/enroll', { championship: championshipName, event: event.shortName });
}

export function eventInfoHref(championshipName: string, event: Event): string {
	return withParams('/events', { championship: championshipName, event: event.shortName });
}

/** Results live on /leaderboards (the old /championships route no longer exists). */
export function resultsHref(championshipName: string, event?: Event | null): string {
	return withParams('/leaderboards', { championship: championshipName, event: event?.shortName });
}
