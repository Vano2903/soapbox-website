import type { PageLoad } from './$types';
import { goto } from '$app/navigation';

export const load: PageLoad = async ({ url, fetch }) => {
	console.log(url.searchParams.get('year'));

	const latest = 2015;
	let shouldSetQueryParam = false;
	let year = url.searchParams.get('year');
	if (year === null) {
		year = latest.toString();
		shouldSetQueryParam = true;
	}

	console.log('selected year: ', year);

	const yearResponse = await fetch(`gallery/response-${year}.json`);
	if (!yearResponse.ok) {
		console.log('year does not exist, redirecting to latest year');
		goto(`/gallery?year=${latest}`);
		return;
	}
	const yearData = await yearResponse.json();
	// const eventLeaderboard = (await eventLeaderboardJson.json()) as EventLeaderboardType;
	return {
		setQueryParameter: shouldSetQueryParam,
		availableYears: [2003, 2004, 2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015],
		currentReturnedYear: parseInt(year, 10),
		groups: yearData.groups
	};
};
