/**
 * this file will contain e2e tests with the login screen
 */

import { expect, test } from '@playwright/test';

test('visits the login page', async ({ page }) => {
  await page.goto('/login');

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByLabel('Email')).toBeVisible();
});
