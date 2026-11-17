/**
 * E2e tests for the login screen.
 */

import { expect, test } from '@playwright/test';
import { createTestUser } from '@ta/auth/testing';

test.describe('login', () => {
  test.describe.configure({ mode: 'serial' });

  const testUser = createTestUser();

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('visits the login page', async ({ page }) => {
    await expect(page).toHaveURL(/\/login$/);
    await expect(page.getByLabel('Email')).toBeVisible();
  });

  test('shows site header on the login page', async ({ page }) => {
    await expect(page.getByRole('banner')).toBeVisible();
  });

  test('signs in with a verified user', async ({ page }) => {
    const { email, password, name } = await testUser;
    const banner = page.getByRole('banner');

    await expect(banner.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(banner.getByRole('link', { name: 'Sign up' })).toBeVisible();

    await page.locator('#login-email').fill(email);
    await page.locator('#login-password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    const authenticatedBanner = page.getByRole('banner');
    await expect(authenticatedBanner.getByLabel(name)).toBeVisible();
    await expect(authenticatedBanner.getByRole('link', { name: 'Sign in' })).toBeHidden();
    await expect(authenticatedBanner.getByRole('link', { name: 'Sign up' })).toBeHidden();
  });

  test('signs out from the account menu', async ({ page }) => {
    const { email, password, name } = await testUser;
    await page.locator('#login-email').fill(email);
    await page.locator('#login-password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
    const authenticatedBanner = page.getByRole('banner');
    await authenticatedBanner.getByRole('button', { name }).click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();

    await expect(page).toHaveURL(/\/login$/);

    const loggedOutBanner = page.getByRole('banner');
    await expect(loggedOutBanner.getByRole('link', { name: 'Sign in' })).toBeVisible();
    await expect(loggedOutBanner.getByRole('link', { name: 'Sign up' })).toBeVisible();
    await expect(loggedOutBanner.getByRole('button', { name })).toBeHidden();
  });
});
