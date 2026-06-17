Playwright tests for LinkWave

Usage:
1. Install dev deps: npm i -D @playwright/test
2. Install browsers: npx playwright install
3. Set env vars: TEST_USER_EMAIL, TEST_USER_PASSWORD, PLAYWRIGHT_BASE_URL (optional)
4. Run tests: npx playwright test e2e/dashboard.spec.ts

Notes:
- Tests assume a seeded test user exists in Supabase and can log in via /login.
- Adjust selectors if UI structure changed.
- If CI, set PLAYWRIGHT_BASE_URL to the deployed URL.
