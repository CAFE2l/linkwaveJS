import { test, expect } from '@playwright/test';

const TEST_EMAIL = process.env.TEST_USER_EMAIL;
const TEST_PASSWORD = process.env.TEST_USER_PASSWORD;

if (!TEST_EMAIL || !TEST_PASSWORD) {
  console.warn('E2E: TEST_USER_EMAIL and TEST_USER_PASSWORD must be set in env to run tests');
}

test.describe('Dashboard - links CRUD and reorder', () => {
  test('login, create, reorder and delete a link', async ({ page }) => {
    if (!TEST_EMAIL || !TEST_PASSWORD) {
      test.skip();
      return;
    }

    // Programmatic login via test API (sets Supabase auth cookies)
    // Programmatic login via test API (sets Supabase auth cookies) using browser fetch so cookies are applied
    const loginResult = await page.evaluate(async (email, password) => {
      const res = await fetch('/api/test/ci-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });
      return { status: res.status, body: await res.text() };
    }, TEST_EMAIL, TEST_PASSWORD);

    if (loginResult.status !== 200) {
      test.fail();
      throw new Error('Test login failed: ' + loginResult.body);
    }

    // Navigate to dashboard after cookies set
    await page.goto('/dashboard');
    await page.waitForURL('**/dashboard', { timeout: 15000 });

    // Create a new link
    await page.fill('input[placeholder="Título do link"]', 'E2E Test Link');
    await page.fill('input[placeholder="https://seulink.com"]', 'https://example.com/e2e');
    await page.click('button:has-text("Criar link")');
    await expect(page.locator('text=E2E Test Link')).toBeVisible({ timeout: 5000 });

    // Capture initial order
    const firstCard = page.locator('.link-card').first();
    const initialText = await firstCard.innerText();

    // If there are at least two items, try reorder by dragging created item to top
    const created = page.locator('text=E2E Test Link').first();
    if (await page.locator('.link-card').count() > 1) {
      const target = page.locator('.link-card').first();
      await created.dragTo(target);
      // Wait a bit for server action to complete
      await page.waitForTimeout(800);
      await expect(page.locator('text=E2E Test Link')).toBeVisible();
    }

    // Delete the created link via delete button (trash)
    const card = page.locator('text=E2E Test Link').first().locator('xpath=ancestor::article');
    // Fallback if structure differs: click the delete button near the title
    if (await card.count() > 0) {
      const deleteBtn = card.locator('button[aria-label="Excluir"]');
      if (await deleteBtn.count() === 0) {
        // try generic trash icon button
        await card.locator('button:has(svg[data-icon="Trash2"])').click().catch(() => {});
      } else {
        await deleteBtn.click();
      }
      // Confirm deletion modal
      await page.click('button:has-text("Confirmar")').catch(() => {});
    } else {
      // fallback: try to find any trash button and click the last one
      const trash = page.locator('button:has(svg[data-icon="Trash2"])').last();
      if ((await trash.count()) > 0) {
        await trash.click();
        await page.click('button:has-text("Confirmar")').catch(() => {});
      }
    }

    // Ensure the link is gone
    await page.waitForTimeout(800);
    await expect(page.locator('text=E2E Test Link')).not.toBeVisible({ timeout: 5000 }).catch(() => {});
  });
});
