/**
 * E2e tests for the login screen.
 */

import { expect, test } from '@playwright/test';
import { createTestUser } from '@ta/auth/testing';

test.describe('login', () => {
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

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(banner.getByLabel(name)).toBeVisible();
    await expect(banner.getByRole('link', { name: 'Sign in' })).toBeHidden();
    await expect(banner.getByRole('link', { name: 'Sign up' })).toBeHidden();
  });
});
