import type { Page } from '@playwright/test';

/**
 * Wait until Svelte has hydrated the page. We treat networkidle as a proxy
 * (all JS bundles have loaded) and then poll a known interactive control until
 * its bound state can be observed via Svelte's reactivity. Without this wait,
 * pre-hydration fills work (Svelte 5 adopts DOM values for `bind:value` on
 * input/select), but pre-hydration radio clicks do NOT — hydration resets
 * `checked` to match the bound value, which is empty at SSR time.
 */
export async function waitForHydration(page: Page) {
	await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});
	// One extra animation frame so Svelte's mount effects can run.
	await page.evaluate(
		() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))
	);
}
