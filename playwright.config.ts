import { defineConfig, devices } from '@playwright/test';

const PORT = 5174;

export default defineConfig({
	testDir: './tests',
	fullyParallel: false,
	forbidOnly: !!process.env.CI,
	retries: 0,
	workers: 1,
	reporter: process.env.CI ? 'github' : 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'retain-on-failure',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure'
	},
	projects: [
		{
			name: 'setup',
			testMatch: /global\.setup\.ts$/
		},
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'], storageState: 'playwright/.auth/user.json' },
			dependencies: ['setup']
		}
	],
	webServer: {
		command: `pnpm vite dev --port ${PORT}`,
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		stdout: 'pipe',
		stderr: 'pipe',
		env: {
			...process.env,
			// pb.boxrally.eu publishes an AAAA record but IPv6 is not reachable
			// from every network; prefer IPv4 so SSR fetches to PocketBase don't
			// intermittently hang on the dead v6 route.
			NODE_OPTIONS: `${process.env.NODE_OPTIONS ?? ''} --dns-result-order=ipv4first`.trim()
		}
	}
});
