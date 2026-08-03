// Test credentials. Disposable PB account on the boxrally instance — see
// docs/forms-refactor.md and the project memory for details.
export const TEST_USER_EMAIL = 'claude@vano.com';
export const TEST_USER_PASSWORD = 'Claude123!';

// Used the first time the global setup encounters an un-onboarded account.
// Picks a stable nick so subsequent runs don't accidentally claim a new
// username each time.
export const ONBOARDING_NICK = 'claude-test';

export const STATE_FILE = 'playwright/.auth/user.json';
export const NICK_FILE = 'playwright/.auth/nick.json';
