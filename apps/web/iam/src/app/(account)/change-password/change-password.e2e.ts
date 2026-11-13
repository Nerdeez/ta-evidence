/**
 * E2e tests for the change password screen.
 */

import { expect, test } from '@playwright/test';
import { createTestUser } from '@ta/auth/testing';

test.describe('change password', () => {
  const testUser = createTestUser();

  test('redirects unauthenticated visitors to login', async ({ page }) => {
    await page.goto('/change-password');
    await expect(page).toHaveURL(/\/login$/);
  });

  test('changes password when signed in', async ({ page }) => {
    const { email, password, name } = await testUser;
    const newPassword = `${password}-next`;

    await page.goto('/login');
    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);

    const banner = page.getByRole('banner');
    await banner.getByRole('button', { name }).click();
    await page.getByRole('menuitem', { name: 'Change password' }).click();

    await expect(page).toHaveURL(/\/change-password$/);
    await page.getByLabel('Current password').fill(password);
    await page.getByLabel('New password', { exact: true }).fill(newPassword);
    await page.getByLabel('Confirm new password').fill(newPassword);
    await page.getByRole('button', { name: 'Update password' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);

    await banner.getByRole('button', { name }).click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login$/);

    await page.getByLabel('Email').fill(email);
    await page.getByLabel('Password').fill(newPassword);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
  });
});
