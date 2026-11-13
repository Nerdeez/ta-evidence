/**
 * E2e tests for dashboard access control.
 */

import { expect, test } from '@playwright/test';
import { createTestUser } from '@ta/auth/testing';
import { db, user } from '@ta/db';
import { eq } from 'drizzle-orm';

test.describe('dashboard', () => {
  test('redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login$/);
  });

  test.describe('verified user', () => {
    const testUser = createTestUser();

    test('allows a verified signed-in user to view the dashboard', async ({ page }) => {
      const { email, password } = await testUser;

      await page.goto('/login');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/dashboard$/);

      await page.goto('/dashboard');
      await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    });
  });

  test.describe('unverified user', () => {
    const testUser = createTestUser();

    test('redirects signed-in users with unverified email to verify-email', async ({ page }) => {
      const { email, password } = await testUser;

      await page.goto('/login');
      await page.getByLabel('Email').fill(email);
      await page.getByLabel('Password').fill(password);
      await page.getByRole('button', { name: 'Sign in' }).click();
      await expect(page).toHaveURL(/\/dashboard$/);

      await db.update(user).set({ emailVerified: false }).where(eq(user.email, email));

      await page.goto('/dashboard');
      await expect(page).toHaveURL(/\/verify-email$/);
      await expect(page.getByRole('heading', { name: 'Verify your email' })).toBeVisible();
    });
  });
});
