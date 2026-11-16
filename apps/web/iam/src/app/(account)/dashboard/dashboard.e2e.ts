/**
 * E2e tests for the dashboard (access control and API keys table).
 */

import { expect, type Page, test } from '@playwright/test';
import { createTestUser, createUserApiKey } from '@ta/auth/testing';
import { apikey, db, user } from '@ta/db';
import { eq } from 'drizzle-orm';

async function signIn(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
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
    const testUser = createTestUser();

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
      await db
        .update(apikey)
        .set({ expiresAt: new Date('2020-01-01T00:00:00.000Z') })
        .where(eq(apikey.id, legacy.id));

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
  });
});
