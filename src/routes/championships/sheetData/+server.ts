import { error } from "@sveltejs/kit";
import { fetchSheetData } from "./fetchSheetData";
// import { formatSheetData } from './formatData';
import { formatSheetDataFromFullJson } from './formatSheetData';

const enableTestURL = false;
const testURL = `'TEST-API'!$B$2:$F$21`;

const categoryValues: string[] = ['SoapBox', 'Pinocchio', 'Trike'];
const leaderboardRanges = new Map<string, string>([
	['Creatività', '$B$2:$H$55'],
	['Originalità', '$B$2:$K$55'],
	['Manche 1', '$B$2:$H$55'],
	['Manche 2', '$B$2:$H$55'],
	['Velocità', '$B$2:$H$55'],
	['Finale', '$B$2:$I$55']
]);

export async function GET({ url }) {
	const category = url.searchParams.get("category")
	const leaderboard = url.searchParams.get("leaderboard")

	if (category == null) {
		error(400, "category must be specified")
	} else if (!categoryValues.includes(category)) {
		error(404, "category not found")
	}
	if (leaderboard == null) {
		error(400, "leaderboard must be specified")
	} else if (!leaderboardRanges.has(leaderboard)) {
		error(404, "leaderboard not found")
	}

	const data = await fetchSheetData((enableTestURL ? testURL : `'Cl. ${leaderboard} [${category.toUpperCase()}]'!${leaderboardRanges.get(leaderboard)}`))

	// return new Response(String(formatSheetData(data)))
	return new Response(String(formatSheetDataFromFullJson(data)))
}