import { test, expect, type Page } from '@playwright/test';

/**
 * Homepage "Prossimo Evento" box.
 *
 * Guards the fixes from the fix/form branch:
 * - desktop (carousel aside) and mobile ("Aspettando l'Evento") must show the
 *   same event and offer the same primary action;
 * - every link in the box must resolve (the old mobile "Guarda" button pointed
 *   to /championships, a route that does not exist).
 *
 * Data comes from the live PB instance, so assertions are written to hold both
 * when subscriptions are open (Iscriviti) and when they are closed (Guarda).
 */

const DESKTOP_BOX = '[data-testid="event-box-desktop"]';
const MOBILE_BOX = '[data-testid="event-box-mobile"]';

async function collectBoxLinks(page: Page, boxSelector: string): Promise<string[]> {
	return page
		.locator(`${boxSelector} a[href]`)
		.evaluateAll((anchors) =>
			anchors.map((a) => (a as HTMLAnchorElement).getAttribute('href') ?? '')
		);
}

test.describe('homepage next-event box', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/');
	});

	test('desktop shows the aside and hides the mobile section', async ({ page }) => {
		test.skip(
			(await page.locator(DESKTOP_BOX).count()) === 0,
			'no ongoing championship with events'
		);

		await expect(page.locator(DESKTOP_BOX)).toBeVisible();
		await expect(page.locator(MOBILE_BOX)).toBeHidden();
	});

	test('mobile shows the section and hides the aside', async ({ page }) => {
		await page.setViewportSize({ width: 390, height: 844 });
		test.skip(
			(await page.locator(MOBILE_BOX).count()) === 0,
			'no ongoing championship with events'
		);

		await expect(page.locator(MOBILE_BOX)).toBeVisible();
		await expect(page.locator(DESKTOP_BOX)).toBeHidden();
	});

	test('desktop and mobile describe the same event with the same action', async ({ page }) => {
		test.skip(
			(await page.locator(DESKTOP_BOX).count()) === 0,
			'no ongoing championship with events'
		);

		// Both variants are always in the DOM (visibility is CSS-only), so we can
		// compare their content regardless of viewport. EventInfoBox renders the
		// championship in a "Campionato <name>" paragraph and the event name in a
		// text-2xl paragraph in both variants.
		const championshipOf = (box: string) =>
			page
				.locator(box)
				.locator('p', { hasText: /^Campionato / })
				.first()
				.textContent();
		const eventNameOf = (box: string) =>
			page.locator(box).locator('p.text-2xl').first().textContent();

		expect(await championshipOf(DESKTOP_BOX), 'desktop box shows the championship').toBeTruthy();
		expect((await championshipOf(MOBILE_BOX))?.trim()).toBe(
			(await championshipOf(DESKTOP_BOX))?.trim()
		);
		expect(await eventNameOf(DESKTOP_BOX), 'desktop box shows the event name').toBeTruthy();
		expect((await eventNameOf(MOBILE_BOX))?.trim()).toBe((await eventNameOf(DESKTOP_BOX))?.trim());

		// Same primary action on both: either both enroll or both watch results.
		// Plain locators (not getByRole) because the CSS-hidden variant has no
		// accessibility tree, yet we want to compare both variants in one pass.
		const actionCount = (box: string, label: string) =>
			page.locator(`${box} a`, { hasText: label }).count();

		expect(
			await actionCount(MOBILE_BOX, 'Iscriviti'),
			'Iscriviti offered on both variants or neither'
		).toBe(await actionCount(DESKTOP_BOX, 'Iscriviti'));
		expect(
			await actionCount(MOBILE_BOX, 'Guarda'),
			'Guarda offered on both variants or neither'
		).toBe(await actionCount(DESKTOP_BOX, 'Guarda'));
	});

	test('every link in the box resolves to an existing page', async ({ page }) => {
		test.skip(
			(await page.locator(DESKTOP_BOX).count()) === 0,
			'no ongoing championship with events'
		);

		const links = [
			...(await collectBoxLinks(page, DESKTOP_BOX)),
			...(await collectBoxLinks(page, MOBILE_BOX))
		];
		expect(links.length, 'the event box exposes at least one link').toBeGreaterThan(0);

		for (const href of new Set(links)) {
			const response = await page.request.get(href);
			expect(response.status(), `${href} must not be a dead link`).toBeLessThan(400);
		}
	});
});
