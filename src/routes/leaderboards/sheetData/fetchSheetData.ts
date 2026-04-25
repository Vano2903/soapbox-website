import { env } from '$env/dynamic/private';

const SHEET_ID = '1NABWpOsyOXXQ4egnotZySWwydPt7u44s3zWD5bTV_BU';

export async function fetchSheetData(RANGE: string) {
	const API_KEY = env.GSHEETS_APIKEY;
	if (!API_KEY) {
		throw new Error('Google Sheets API key is not set');
	}
	const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}?ranges=${RANGE}&includeGridData=true&key=${API_KEY}`;
	// console.log('[DEBUG] Fetch url: ', url);

	const res = await fetch(url);
	const json = await res.json();
	// console.log("[DEBUG] Fetch data:\n", json)

	if (!json) {
		throw new Error('No response from Google Sheets API');
	}
	if (json.error) {
		throw new Error(`Google Sheets API error ${json.error.code}: ${json.error.message}`);
	}
	if (!json.sheets || json.sheets.length === 0) {
		throw new Error(`Sheet not found for range: ${RANGE}`);
	}
	return json;
}
