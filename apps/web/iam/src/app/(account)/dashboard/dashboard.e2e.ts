/**
 * E2e tests for the dashboard (access control and API keys table).
 */

import { expect, type Page, test } from '@playwright/test';
import { createTestUser, createUserApiKey, expireUserApiKeyForE2e } from '@ta/auth/testing';
import { apikey, db, user } from '@ta/db';
import { eq } from 'drizzle-orm';

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.locator('#login-email').fill(email);
  await page.locator('#login-password').fill(password);
  await page.getByRole('button', { name: 'Sign in' }).click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

test.describe('dashboard', () => {
  test('redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test.describe('verified user', () => {
    const testUser = createTestUser();

    test('allows a verified signed-in user to view the dashboard', async ({ page }) => {
      const { email, password } = await testUser;

      await signIn(page, email, password);
      await page.goto('/dashboard');
      await expect(page.getByRole('heading', { name: 'API keys', level: 1 })).toBeVisible();
    });
  });

  test.describe('unverified user', () => {
    const testUser = createTestUser();

    test('redirects signed-in users with unverified email to verify-email', async ({ page }) => {
      const { email, password } = await testUser;

      await signIn(page, email, password);

      await db.update(user).set({ emailVerified: false }).where(eq(user.email, email));

      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/verify-email$/);
      await expect(page.getByRole('heading', { name: 'Verify your email' })).toBeVisible();
    });
  });

  test.describe('API keys table', () => {
    test.describe.configure({ mode: 'serial' });

    const testUser = createTestUser();

    test.beforeEach(async () => {
      const { id: userId } = await testUser;
      await db.delete(apikey).where(eq(apikey.referenceId, userId));
    });

    test('shows empty state when the user has no keys', async ({ page }) => {
      const { email, password } = await testUser;
      await signIn(page, email, password);
      await page.goto('/dashboard');

      await expect(page.getByRole('heading', { name: 'API keys', level: 1 })).toBeVisible();
      await expect(page.getByText('You have not created any API keys yet')).toBeVisible();
    });

    test('lists active and expired keys in separate sections', async ({ page }) => {
      const { email, password, id: userId } = await testUser;

      await createUserApiKey(userId, { name: 'Production' });
      const legacy = await createUserApiKey(userId, { name: 'Legacy integration' });
      await expireUserApiKeyForE2e(legacy.id);

      await signIn(page, email, password);
      await page.goto('/dashboard');

      await expect(page.getByRole('heading', { name: 'Active keys', level: 2 })).toBeVisible();
      await expect(page.getByRole('heading', { name: 'Expired keys', level: 2 })).toBeVisible();
      await expect(page.getByText('Production')).toBeVisible();
      await expect(page.getByText('Legacy integration')).toBeVisible();
      await expect(page.getByText('Active', { exact: true })).toBeVisible();
      await expect(page.getByText('Expired', { exact: true })).toBeVisible();
      await expect(page.locator('code').filter({ hasText: '*****' }).first()).toBeVisible();
    });

    test('deletes an active key after confirmation', async ({ page }) => {
      const { email, password, id: userId } = await testUser;

      const toDelete = await createUserApiKey(userId, { name: 'Delete me' });
      await createUserApiKey(userId, { name: 'Keep me' });

      await signIn(page, email, password);
      await page.goto('/dashboard');

      await expect(page.getByText('Delete me')).toBeVisible();
      await expect(page.getByText('Keep me')).toBeVisible();
      await page.getByRole('button', { name: 'Delete Delete me' }).click();
      await expect(page.getByRole('alertdialog')).toBeVisible();
      await page.getByRole('button', { name: 'Delete', exact: true }).click();

      await expect(page.getByText('API key deleted')).toBeVisible();
      await expect(page.getByText('Delete me')).not.toBeVisible();
      await expect(page.getByText('Keep me')).toBeVisible();

      const rows = await db.select().from(apikey).where(eq(apikey.id, toDelete.id));
      expect(rows).toHaveLength(0);
    });

    test('deletes an expired key after confirmation', async ({ page }) => {
      const { email, password, id: userId } = await testUser;

      const expired = await createUserApiKey(userId, { name: 'Expired to delete' });
      await expireUserApiKeyForE2e(expired.id);

      await signIn(page, email, password);
      await page.goto('/dashboard');

      await expect(page.getByRole('heading', { name: 'Expired keys', level: 2 })).toBeVisible();
      await page.getByRole('button', { name: 'Delete Expired to delete' }).click();
      await page.getByRole('button', { name: 'Delete', exact: true }).click();

      await expect(page.getByText('API key deleted')).toBeVisible();
      await expect(page.locator('main').getByText('Expired to delete')).not.toBeVisible();
      const rows = await db.select().from(apikey).where(eq(apikey.id, expired.id));
      expect(rows).toHaveLength(0);
    });
  });
});
