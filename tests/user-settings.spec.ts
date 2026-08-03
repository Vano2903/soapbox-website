import { test, expect, type Page } from '@playwright/test';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readNick } from './helpers/userNick';
import { waitForHydration } from './helpers/waitForHydration';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE = (name: string) => path.resolve(HERE, 'fixtures', name);

async function goToSettings(page: Page) {
	const nick = readNick();
	await page.goto(`/user/${nick}/settings`);
	await expect(page.getByRole('heading', { name: /modifica il tuo profilo/i })).toBeVisible();
	// setInputFiles before hydration fires the change event with no Svelte
	// listeners attached yet — the ImageField never reacts.
	await waitForHydration(page);
}

async function pickAvatar(page: Page, file: string) {
	const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });
	// A previous test (or an earlier run against the live PB user) may have left
	// an image in the slot; the file input only exists in the empty state, so
	// clear the field first ("Cancella" while cropping, "Rimuovi immagine" when
	// confirmed).
	const reset = avatarShell.getByRole('button', { name: /rimuovi immagine|cancella/i });
	if ((await reset.count()) > 0) {
		await reset.first().click();
	}
	await avatarShell.locator('input[type="file"]').setInputFiles(file);
}

async function confirmAvatarCrop(page: Page) {
	const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });
	const confirm = avatarShell.getByRole('button', { name: /conferma ritaglio/i });
	await expect(confirm).toBeVisible({ timeout: 10_000 });
	await confirm.click();
	// After confirm, the preview img + "Modifica ritaglio" button appear.
	await expect(avatarShell.getByRole('button', { name: /modifica ritaglio/i })).toBeVisible();
}

test.describe('user settings — image upload pipeline', () => {
	test.beforeEach(async ({ page }) => {
		await goToSettings(page);
	});

	test('rejects a PDF renamed to .png and shows a clear error', async ({ page }) => {
		const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });

		await pickAvatar(page, FIXTURE('evil.png'));

		// Error surfaces inside the field shell, *not* swallowed.
		await expect(
			avatarShell.getByText(/non.*immagine valida|tipo "application\/pdf"/i)
		).toBeVisible({
			timeout: 5_000
		});

		// The file input is still in the "empty" state — no cropper mounted.
		await expect(avatarShell.locator('input[type="file"]')).toBeVisible();
		await expect(avatarShell.getByRole('button', { name: /conferma ritaglio/i })).toHaveCount(0);

		// Picking a real PNG afterwards clears the error and proceeds to the cropper.
		await pickAvatar(page, FIXTURE('valid-portrait.png'));
		await expect(avatarShell.getByRole('button', { name: /conferma ritaglio/i })).toBeVisible({
			timeout: 5_000
		});
		await expect(
			avatarShell.getByText(/non.*immagine valida|tipo "application\/pdf"/i)
		).toHaveCount(0);
	});

	test('accepts PNG, crops to WebP, and submits', async ({ page }) => {
		await pickAvatar(page, FIXTURE('valid-portrait.png'));
		await confirmAvatarCrop(page);

		// Inspect the cropped <img> blob to confirm it's a WebP file under the hood.
		const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });
		const previewSrc = await avatarShell.locator('img').first().getAttribute('src');
		expect(previewSrc).toMatch(/^blob:/);

		// Fetch the blob from the page and inspect its first 4 bytes — must be RIFF (WebP).
		const head = await page.evaluate(async (src) => {
			const r = await fetch(src!);
			const buf = await r.arrayBuffer();
			return Array.from(new Uint8Array(buf).slice(0, 4))
				.map((b) => String.fromCharCode(b))
				.join('');
		}, previewSrc);
		expect(head).toBe('RIFF');

		// Submit. The page redirects to the dash on success.
		const submit = page.getByRole('button', { name: /aggiorna il tuo account/i });
		await Promise.all([
			page.waitForURL((url) => url.pathname.endsWith('/dash'), { timeout: 30_000 }),
			submit.click()
		]);
	});

	test('accepts a JPG upload', async ({ page }) => {
		await pickAvatar(page, FIXTURE('valid-landscape.jpg'));
		await confirmAvatarCrop(page);
		const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });
		const previewSrc = await avatarShell.locator('img').first().getAttribute('src');
		const head = await page.evaluate(async (src) => {
			const r = await fetch(src!);
			const buf = await r.arrayBuffer();
			return Array.from(new Uint8Array(buf).slice(0, 4))
				.map((b) => String.fromCharCode(b))
				.join('');
		}, previewSrc);
		expect(head).toBe('RIFF');
	});

	test('accepts a WebP upload', async ({ page }) => {
		await pickAvatar(page, FIXTURE('valid-square.webp'));
		await confirmAvatarCrop(page);
		const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });
		const previewSrc = await avatarShell.locator('img').first().getAttribute('src');
		const head = await page.evaluate(async (src) => {
			const r = await fetch(src!);
			const buf = await r.arrayBuffer();
			return Array.from(new Uint8Array(buf).slice(0, 4))
				.map((b) => String.fromCharCode(b))
				.join('');
		}, previewSrc);
		expect(head).toBe('RIFF');
	});
});

test.describe('user settings — form interactions', () => {
	test.beforeEach(async ({ page }) => {
		await goToSettings(page);
	});

	test('username slug input lowercases and dashes spaces', async ({ page }) => {
		const visibleNick = page.locator('input[form="check"][name="nick"]');
		await visibleNick.fill('Foo Bar BAZ');
		await expect(visibleNick).toHaveValue('foo-bar-baz');
	});

	test('submit button is never permanently disabled when a bad image is picked', async ({
		page
	}) => {
		const avatarShell = page.locator('fieldset', { hasText: 'Foto profilo' });
		const submit = page.getByRole('button', { name: /aggiorna il tuo account/i });

		await pickAvatar(page, FIXTURE('evil.png'));
		await expect(
			avatarShell.getByText(/non.*immagine valida|tipo "application\/pdf"/i)
		).toBeVisible();

		// The button must not be disabled forever just because we picked a bad file —
		// the user must be able to recover by picking a good file and submitting.
		await expect(submit).toBeEnabled({ timeout: 5_000 });
	});
});
