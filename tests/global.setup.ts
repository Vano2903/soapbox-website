import { expect, test as setup, type Page } from '@playwright/test';
import PocketBase from 'pocketbase';
import {
	ONBOARDING_NICK,
	STATE_FILE,
	TEST_USER_EMAIL,
	TEST_USER_PASSWORD
} from './helpers/credentials';
import { saveNick } from './helpers/userNick';
import { waitForHydration } from './helpers/waitForHydration';

const PB_URL = 'https://pb.boxrally.eu';

/**
 * Authenticate directly against PocketBase and inject the auth cookie. Bypasses
 * the SvelteKit `/login` action, which redirects to `/me` — a non-existent route
 * that crashes Superforms' `applyAction` client-side and leaves the form in a
 * partial state.
 */
async function authenticateViaCookie(page: Page) {
	const pb = new PocketBase(PB_URL);
	// The live PB instance occasionally drops a request (ClientResponseError 0);
	// a couple of retries keeps the whole suite from failing on a network blip.
	let lastError: unknown;
	for (let attempt = 1; attempt <= 3; attempt++) {
		try {
			await pb.collection('users').authWithPassword(TEST_USER_EMAIL, TEST_USER_PASSWORD);
			lastError = undefined;
			break;
		} catch (err) {
			lastError = err;
			console.warn(`PocketBase auth attempt ${attempt}/3 failed, retrying in ${attempt}s`, err);
			await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
		}
	}
	if (lastError) throw lastError;

	// Reset image slots so every run starts from the "empty field" state the
	// image-pipeline tests assume — previous runs may have saved an avatar.
	const userId = pb.authStore.record?.id;
	if (userId) {
		await pb
			.collection('users')
			.update(userId, {
				avatar: null,
				avatarCropped: null,
				avatarCrop: null,
				banner: null,
				bannerCropped: null,
				bannerCrop: null
			})
			.catch((err) => console.warn('could not reset test user images', err));
	}
	const cookieString = pb.authStore.exportToCookie({
		httpOnly: false,
		secure: false,
		sameSite: 'Strict'
	});
	const match = cookieString.match(/^pb_auth=([^;]+)/);
	if (!match) throw new Error('failed to parse pb_auth cookie from PocketBase');
	await page.context().addCookies([
		{
			name: 'pb_auth',
			value: match[1],
			domain: 'localhost',
			path: '/',
			httpOnly: false,
			secure: false,
			sameSite: 'Strict'
		}
	]);
}

async function fillOnboarding(page: Page) {
	await waitForHydration(page);

	await page.locator('input[name="name"]').fill('Claude');
	await page.locator('input[name="lastName"]').fill('Test');
	await page.locator('select[name="prefix"]').selectOption('+39');
	await page.locator('input[name="phone"]').fill('3331234567');
	await page.locator('input[name="gender"][value="other"]').check();
	await page.locator('input[name="birthDate"]').fill('2000-01-01');

	const usernameInput = page.locator('input[form="check"][name="username"]');
	await usernameInput.fill(ONBOARDING_NICK);
	// Allow the debounced username availability check to settle.
	await page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => {});

	await page.locator('input[name="visibility"][value="public"]').check();

	const submit = page.getByRole('button', { name: /completa registrazione/i });
	await expect(submit).toBeEnabled({ timeout: 10_000 });
	await submit.click();
}

setup('authenticate + onboard', async ({ page }) => {
	// Auth goes to the live PB instance and may need retries; don't let the
	// default 30s test timeout kill the whole suite on a slow network.
	setup.setTimeout(90_000);
	await authenticateViaCookie(page);

	await page.goto('/onboarding');

	if (page.url().includes('/onboarding')) {
		await fillOnboarding(page);
		await page.waitForURL((url) => !url.pathname.startsWith('/onboarding'), { timeout: 30_000 });
	}

	const match = page.url().match(/\/user\/([^/?#]+)/);
	if (!match) {
		throw new Error(`expected /user/<nick>/... after onboarding, got ${page.url()}`);
	}
	const nick = match[1];
	saveNick(nick);

	await page.context().storageState({ path: STATE_FILE });
	expect(nick).toBeTruthy();
});
