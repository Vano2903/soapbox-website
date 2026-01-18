export async function GET() {
	const scriptText = await fetch('https://cloud.umami.is/script.js');
	return new Response(await scriptText.text());
}
