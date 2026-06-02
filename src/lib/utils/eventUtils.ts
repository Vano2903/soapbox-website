import { EventCategory, EventLeaderboard, type EventAvailableLeaderboards } from "$types/pocketbase/event";

export function ToEventAvailableCategoriesArray(eventAvailableLeaderboards: EventAvailableLeaderboards | undefined): Array<EventCategory> {
	const result: Array<EventCategory> = [];
	if (!eventAvailableLeaderboards) {
		return result;
	}

	if (eventAvailableLeaderboards.SoapBox) result.push(EventCategory.SoapBox);
	if (eventAvailableLeaderboards.Pinocchio) result.push(EventCategory.Pinocchio);
	if (eventAvailableLeaderboards.Trike) result.push(EventCategory.Trike);
	if (eventAvailableLeaderboards.Junior) result.push(EventCategory.Junior);
	if (eventAvailableLeaderboards.Altro) result.push(EventCategory.Other);
	return result;
}

export const DefaultEventAvailableLeaderboards: EventAvailableLeaderboards = {
	SoapBox: [EventLeaderboard.Stage1, EventLeaderboard.Stage2, EventLeaderboard.Speed],
	Trike: [EventLeaderboard.Stage1, EventLeaderboard.Stage2, EventLeaderboard.Speed]
};