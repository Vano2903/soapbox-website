import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNick } from './helpers/userNick';
import { waitForHydration } from './helpers/waitForHydration';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = (name: string) => path.resolve(HERE, 'fixtures', name);

async function goToCreateTeam(page: Page) {
	const nick = readNick();
	await page.goto(`/user/${nick}/dash/team/new`);
	await expect(page.getByRole('heading', { name: /crea il tuo team/i })).toBeVisible();
	// setInputFiles before hydration fires the change event with no Svelte
	// listeners attached yet — the ImageField never reacts.
	await waitForHydration(page);
}

test.describe('team creation', () => {
	test('rejects a renamed PDF as logo', async ({ page }) => {
		await goToCreateTeam(page);
		const logoShell = page.locator('fieldset', { hasText: 'Logo del team' });
		await logoShell.locator('input[type="file"]').setInputFiles(FIXTURE('evil.png'));
		await expect(logoShell.getByText(/non.*immagine valida|tipo "application\/pdf"/i)).toBeVisible({
			timeout: 5_000
		});
		// Still in empty state, no cropper.
		await expect(logoShell.getByRole('button', { name: /conferma ritaglio/i })).toHaveCount(0);
	});

	test('happy path — name, slug, png logo crop preview is webp', async ({ page }) => {
		await goToCreateTeam(page);

		const uniqueSlug = `claude-team-${Date.now().toString(36)}`;
		await page.locator('input[name="name"]').first().fill(`Claude Test Team ${uniqueSlug}`);

		const slugInput = page.locator('input[form="check"][name="slug"]');
		await slugInput.fill(uniqueSlug);
		await expect(slugInput).toHaveValue(uniqueSlug);

		const logoShell = page.locator('fieldset', { hasText: 'Logo del team' });
		await logoShell.locator('input[type="file"]').setInputFiles(FIXTURE('valid-portrait.png'));
		const confirm = logoShell.getByRole('button', { name: /conferma ritaglio/i });
		await expect(confirm).toBeVisible({ timeout: 10_000 });
		await confirm.click();
		await expect(logoShell.getByRole('button', { name: /modifica ritaglio/i })).toBeVisible();

		// Verify the cropped preview is a WebP blob.
		const previewSrc = await logoShell.locator('img').first().getAttribute('src');
		const head = await page.evaluate(async (src) => {
			const r = await fetch(src!);
			const buf = await r.arrayBuffer();
			return Array.from(new Uint8Array(buf).slice(0, 4))
				.map((b) => String.fromCharCode(b))
				.join('');
		}, previewSrc);
		expect(head).toBe('RIFF');

		// Submit. Success surfaces a flash message linking to the new team's dash.
		const submit = page.getByRole('button', { name: /crea il tuo team/i });
		await submit.click();
		await expect(page.locator('.alert-success')).toBeVisible({ timeout: 30_000 });
	});
});
